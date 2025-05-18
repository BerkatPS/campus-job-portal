<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use App\Models\JobApplication;
use App\Services\MessageAnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class MessageAnalyticsController extends Controller
{
    protected $analyticsService;

    public function __construct(MessageAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Display message analytics dashboard.
     */
    public function index()
    {
        $manager = Auth::user();
        
        $overallStats = $this->analyticsService->getOverallStats();
        $managerPerformance = $this->analyticsService->getManagerPerformance($manager->id);
        
        // Get top jobs by message activity
        $topJobs = Message::select('job_id')
            ->where(function($query) use ($manager) {
                $query->where('sender_id', $manager->id)
                    ->orWhere('recipient_id', $manager->id);
            })
            ->whereNotNull('job_id')
            ->groupBy('job_id')
            ->selectRaw('count(*) as message_count')
            ->with('job:id,title,company_id', 'job.company:id,name')
            ->orderByDesc('message_count')
            ->limit(5)
            ->get()
            ->map(function($message) {
                if ($message->job) {
                    return [
                        'job_id' => $message->job_id,
                        'job_title' => $message->job->title,
                        'company_name' => $message->job->company->name ?? 'N/A',
                        'message_count' => $message->message_count,
                    ];
                }
                return null;
            })
            ->filter()
            ->values();
        
        // Get recently active conversations
        $recentConversations = Message::select('conversation_id')
            ->where(function($query) use ($manager) {
                $query->where('sender_id', $manager->id)
                    ->orWhere('recipient_id', $manager->id);
            })
            ->groupBy('conversation_id')
            ->selectRaw('MAX(created_at) as last_message_date')
            ->orderByDesc('last_message_date')
            ->limit(5)
            ->get()
            ->map(function($message) {
                $conversation = Message::where('conversation_id', $message->conversation_id)
                    ->with(['sender:id,name', 'job:id,title'])
                    ->orderBy('created_at', 'desc')
                    ->first();
                
                if ($conversation) {
                    $otherParty = null;
                    if ($conversation->sender_id == Auth::id()) {
                        $otherParty = User::find($conversation->recipient_id);
                    } else {
                        $otherParty = $conversation->sender;
                    }
                    
                    return [
                        'conversation_id' => $message->conversation_id,
                        'last_message_date' => Carbon::parse($message->last_message_date)->format('d M Y H:i'),
                        'job_title' => $conversation->job->title ?? 'N/A',
                        'other_party' => $otherParty->name ?? 'Unknown',
                        'last_message' => substr($conversation->message, 0, 50) . (strlen($conversation->message) > 50 ? '...' : ''),
                    ];
                }
                return null;
            })
            ->filter()
            ->values();
        
        return Inertia::render('Manager/Messages/Analytics', [
            'stats' => $overallStats,
            'performance' => $managerPerformance,
            'topJobs' => $topJobs,
            'recentConversations' => $recentConversations,
            'responseTimeDistribution' => $overallStats['response_time_distribution'] ?? [],
        ]);
    }
    
    /**
     * Get detailed response time metrics.
     */
    public function responseTimeMetrics()
    {
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();
        
        // Get daily average response times
        $dailyResponseTimes = Message::whereNotNull('parent_id')
            ->join('messages as parent', 'messages.parent_id', '=', 'parent.id')
            ->where('messages.created_at', '>=', $startDate)
            ->where('messages.sender_id', '!=', 'parent.sender_id')
            ->select(
                'messages.id',
                'messages.created_at',
                'parent.created_at as parent_created_at',
                DB::raw('DATE(messages.created_at) as date')
            )
            ->get()
            ->groupBy('date')
            ->map(function($messages) {
                $responseTimes = $messages->map(function($message) {
                    return Carbon::parse($message->created_at)
                        ->diffInMinutes(Carbon::parse($message->parent_created_at));
                });
                
                return [
                    'date' => $messages->first()->date,
                    'avg_time' => $responseTimes->avg(),
                    'count' => $responseTimes->count(),
                ];
            })
            ->values();
        
        // Get metrics by job
        $jobMetrics = Message::whereNotNull('job_id')
            ->groupBy('job_id')
            ->selectRaw('job_id, count(*) as message_count')
            ->with('job:id,title,company_id', 'job.company:id,name')
            ->orderByDesc('message_count')
            ->limit(10)
            ->get()
            ->map(function($message) {
                if ($message->job) {
                    // Calculate response time for this job
                    $responseTime = Message::whereNotNull('parent_id')
                        ->where('job_id', $message->job_id)
                        ->join('messages as parent', 'messages.parent_id', '=', 'parent.id')
                        ->select(
                            'messages.id',
                            'messages.created_at',
                            'parent.created_at as parent_created_at'
                        )
                        ->get()
                        ->map(function($msg) {
                            return Carbon::parse($msg->created_at)
                                ->diffInMinutes(Carbon::parse($msg->parent_created_at));
                        })
                        ->avg();
                    
                    return [
                        'job_id' => $message->job_id,
                        'job_title' => $message->job->title,
                        'company_name' => $message->job->company->name ?? 'N/A',
                        'message_count' => $message->message_count,
                        'avg_response_time' => round($responseTime) ?? 0,
                    ];
                }
                return null;
            })
            ->filter()
            ->values();
        
        return Inertia::render('Manager/Messages/ResponseTimeMetrics', [
            'dailyResponseTimes' => $dailyResponseTimes,
            'jobMetrics' => $jobMetrics,
        ]);
    }
    
    /**
     * Get analytics for a specific application.
     */
    public function applicationAnalytics(JobApplication $application)
    {
        // Check access permission
        $manager = Auth::user();
        if (!$this->hasAccessToApplication($application)) {
            return back()->with('error', 'You do not have permission to view this application.');
        }
        
        $analytics = $this->analyticsService->getAnalyticsByApplication($application);
        
        return response()->json($analytics);
    }
    
    /**
     * Check if user has access to the application.
     */
    protected function hasAccessToApplication(JobApplication $application)
    {
        $user = Auth::user();
        if ($user->hasRole('manager')) {
            return $application->job->company_id === $user->company_id;
        }
        return false;
    }
}
