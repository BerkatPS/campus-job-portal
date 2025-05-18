<?php

namespace App\Services;

use App\Models\Message;
use App\Models\User;
use App\Models\JobApplication;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MessageAnalyticsService
{
    /**
     * Get overall message statistics
     */
    public function getOverallStats()
    {
        $totalMessages = Message::count();
        $totalConversations = Message::distinct('conversation_id')->count('conversation_id');
        
        $responseTimes = $this->calculateResponseTimes();
        
        return [
            'total_messages' => $totalMessages,
            'total_conversations' => $totalConversations,
            'avg_response_time' => $responseTimes['avg_response_time'],
            'messages_by_status' => $this->getMessagesByStatus(),
            'messages_by_date' => $this->getMessagesByDate(),
        ];
    }
    
    /**
     * Calculate response time metrics
     */
    public function calculateResponseTimes()
    {
        // Get all reply messages (not initial messages)
        $replies = Message::whereNotNull('parent_id')
            ->join('messages as parent', 'messages.parent_id', '=', 'parent.id')
            ->select(
                'messages.id',
                'messages.sender_id',
                'messages.created_at',
                'parent.created_at as parent_created_at',
                'parent.sender_id as parent_sender_id'
            )
            ->get();
        
        $responseTimes = [];
        $managerResponseTimes = [];
        $candidateResponseTimes = [];
        
        foreach ($replies as $reply) {
            // Skip if sender is the same (user replying to themselves)
            if ($reply->sender_id == $reply->parent_sender_id) {
                continue;
            }
            
            $responseTime = Carbon::parse($reply->created_at)
                ->diffInMinutes(Carbon::parse($reply->parent_created_at));
            
            $responseTimes[] = $responseTime;
            
            // Determine if this is a manager or candidate response
            $user = User::find($reply->sender_id);
            if ($user && $user->hasRole('manager')) {
                $managerResponseTimes[] = $responseTime;
            } else {
                $candidateResponseTimes[] = $responseTime;
            }
        }
        
        // Calculate averages
        $avgResponseTime = count($responseTimes) > 0 ? array_sum($responseTimes) / count($responseTimes) : 0;
        $avgManagerResponseTime = count($managerResponseTimes) > 0 ? array_sum($managerResponseTimes) / count($managerResponseTimes) : 0;
        $avgCandidateResponseTime = count($candidateResponseTimes) > 0 ? array_sum($candidateResponseTimes) / count($candidateResponseTimes) : 0;
        
        // Calculate response time distribution
        $distribution = [
            'within_1_hour' => 0,
            '1_to_4_hours' => 0,
            '4_to_24_hours' => 0,
            'over_24_hours' => 0,
        ];
        
        foreach ($responseTimes as $time) {
            if ($time <= 60) {
                $distribution['within_1_hour']++;
            } elseif ($time <= 240) {
                $distribution['1_to_4_hours']++;
            } elseif ($time <= 1440) {
                $distribution['4_to_24_hours']++;
            } else {
                $distribution['over_24_hours']++;
            }
        }
        
        // Calculate percentages
        $total = count($responseTimes);
        if ($total > 0) {
            foreach ($distribution as $key => $value) {
                $distribution[$key] = round(($value / $total) * 100, 1);
            }
        }
        
        return [
            'avg_response_time' => round($avgResponseTime),
            'avg_manager_response_time' => round($avgManagerResponseTime),
            'avg_candidate_response_time' => round($avgCandidateResponseTime),
            'response_time_distribution' => $distribution,
            'total_responses' => count($responseTimes),
            'manager_responses' => count($managerResponseTimes),
            'candidate_responses' => count($candidateResponseTimes),
        ];
    }
    
    /**
     * Get message counts by status
     */
    private function getMessagesByStatus()
    {
        $statuses = Message::select('is_read', DB::raw('count(*) as total'))
            ->groupBy('is_read')
            ->get()
            ->mapWithKeys(function ($item) {
                $status = $item->is_read ? 'read' : 'unread';
                return [$status => $item->total];
            })
            ->toArray();
        
        // Ensure both keys exist
        if (!isset($statuses['read'])) $statuses['read'] = 0;
        if (!isset($statuses['unread'])) $statuses['unread'] = 0;
        
        return $statuses;
    }
    
    /**
     * Get message counts by date (last 30 days)
     */
    private function getMessagesByDate()
    {
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();
        
        $messages = Message::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as total')
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        // Create an array with all dates in the last 30 days
        $dateRange = [];
        $currentDate = clone $startDate;
        
        while ($currentDate <= $endDate) {
            $formattedDate = $currentDate->format('Y-m-d');
            $dateRange[$formattedDate] = 0;
            $currentDate->addDay();
        }
        
        // Fill in the actual counts
        foreach ($messages as $message) {
            $dateRange[$message->date] = $message->total;
        }
        
        return $dateRange;
    }
    
    /**
     * Get message analytics by application
     */
    public function getAnalyticsByApplication(JobApplication $application)
    {
        $messages = Message::where('job_id', $application->job_id)
            ->where(function($query) use ($application) {
                $query->where('sender_id', $application->user_id)
                    ->orWhere('recipient_id', $application->user_id);
            })
            ->get();
        
        $totalMessages = $messages->count();
        $managerMessages = $messages->where('sender_id', '!=', $application->user_id)->count();
        $candidateMessages = $messages->where('sender_id', $application->user_id)->count();
        
        // Calculate response times
        $responseTimes = [];
        $previousMessage = null;
        
        foreach ($messages->sortBy('created_at') as $message) {
            if ($previousMessage && $previousMessage->sender_id != $message->sender_id) {
                $responseTime = Carbon::parse($message->created_at)
                    ->diffInMinutes(Carbon::parse($previousMessage->created_at));
                $responseTimes[] = $responseTime;
            }
            
            $previousMessage = $message;
        }
        
        $avgResponseTime = count($responseTimes) > 0 ? array_sum($responseTimes) / count($responseTimes) : 0;
        
        return [
            'total_messages' => $totalMessages,
            'manager_messages' => $managerMessages,
            'candidate_messages' => $candidateMessages,
            'avg_response_time' => round($avgResponseTime),
            'message_ratio' => $totalMessages > 0 ? round(($managerMessages / $totalMessages) * 100, 1) : 0,
        ];
    }
    
    /**
     * Get manager response performance
     */
    public function getManagerPerformance($managerId)
    {
        // Get all messages sent to this manager
        $receivedMessages = Message::where('recipient_id', $managerId)
            ->where('sender_id', '!=', $managerId)
            ->get();
        
        // Get all responses from this manager
        $sentResponses = Message::where('sender_id', $managerId)
            ->whereIn('parent_id', $receivedMessages->pluck('id'))
            ->get();
        
        $responseRate = $receivedMessages->count() > 0 
            ? ($sentResponses->count() / $receivedMessages->count()) * 100 
            : 0;
            
        // Calculate average response time
        $responseTimes = [];
        
        foreach ($sentResponses as $response) {
            $originalMessage = $receivedMessages->firstWhere('id', $response->parent_id);
            
            if ($originalMessage) {
                $responseTime = Carbon::parse($response->created_at)
                    ->diffInMinutes(Carbon::parse($originalMessage->created_at));
                $responseTimes[] = $responseTime;
            }
        }
        
        $avgResponseTime = count($responseTimes) > 0 ? array_sum($responseTimes) / count($responseTimes) : 0;
        
        // Get response time distribution
        $responseTimeDistribution = [
            'within_1_hour' => 0,
            '1_to_4_hours' => 0,
            '4_to_24_hours' => 0,
            'over_24_hours' => 0,
        ];
        
        foreach ($responseTimes as $time) {
            if ($time <= 60) {
                $responseTimeDistribution['within_1_hour']++;
            } elseif ($time <= 240) {
                $responseTimeDistribution['1_to_4_hours']++;
            } elseif ($time <= 1440) {
                $responseTimeDistribution['4_to_24_hours']++;
            } else {
                $responseTimeDistribution['over_24_hours']++;
            }
        }
        
        return [
            'total_received' => $receivedMessages->count(),
            'total_responded' => $sentResponses->count(),
            'response_rate' => round($responseRate, 1),
            'avg_response_time' => round($avgResponseTime),
            'response_time_distribution' => $responseTimeDistribution,
        ];
    }
}
