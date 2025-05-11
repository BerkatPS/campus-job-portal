<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Category;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobController extends Controller
{
    /**
     * Display a listing of the jobs.
     */
    public function index(Request $request)
    {
        // Query to get active jobs
        $query = Job::with(['company', 'category'])
            ->where(function($q) {
                $q->where('is_active', true)->orWhere('status', 'active');
            });

        // Apply filters
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('type')) {
            $query->where('job_type', $request->type);
        }

        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        if ($request->filled('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('company', function($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Get total count for display
        $total = $query->count();

        // Order results
        $query->latest();

        // Paginate results
        $jobs = $query->paginate(10);

        // Get all categories for filter
        $categories = Category::orderBy('name')->get();
        
        return Inertia::render('Public/Jobs/Index', [
            'jobs' => $jobs,
            'filters' => $request->only(['search', 'location', 'category_id', 'type', 'experience_level', 'page']),
            'categories' => $categories,
            'total' => $total
        ]);
    }

    /**
     * Display the specified job.
     */
    public function show($id)
    {
        $job = Job::with(['company', 'category'])->findOrFail($id);
        
        return Inertia::render('Public/Jobs/Show', [
            'job' => $job
        ]);
    }
} 