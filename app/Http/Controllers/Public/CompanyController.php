<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    /**
     * Display a listing of companies.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $companies = Company::query()
            ->when($request->search, function($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('industry', 'like', "%{$search}%");
            })
            ->when($request->industry, function($query, $industry) {
                $query->where('industry', $industry);
            })
            ->when($request->sort, function($query, $sort) {
                if ($sort === 'name_asc') {
                    $query->orderBy('name', 'asc');
                } elseif ($sort === 'name_desc') {
                    $query->orderBy('name', 'desc');
                } elseif ($sort === 'newest') {
                    $query->orderBy('created_at', 'desc');
                } elseif ($sort === 'oldest') {
                    $query->orderBy('created_at', 'asc');
                }
            }, function($query) {
                $query->orderBy('name', 'asc');
            })
            ->paginate(12)
            ->withQueryString();

        $filters = $request->only(['search', 'industry', 'sort']);

        // Get unique industries for the filter
        $industries = Company::distinct()->pluck('industry')->filter()->values();

        return Inertia::render('Public/Companies/Index', [
            'companies' => $companies,
            'filters' => $filters,
            'industries' => $industries,
        ]);
    }

    /**
     * Display the specified company.
     *
     * @param Company $company
     * @return \Inertia\Response
     */
    public function show(Company $company)
    {
        $jobCount = $company->jobs()->active()->count();

        // Get company reviews data
        $reviews = $company->reviews()
            ->with(['user:id,name', 'jobApplication.job:id,title'])
            ->where('is_approved', true)
            ->latest()
            ->take(10)
            ->get();

        // Calculate review statistics
        $reviewStats = $this->calculateReviewStats($company);

        return Inertia::render('Public/Companies/Show', [
            'company' => $company->load(['jobs' => function ($query) {
                $query->active()->latest()->take(5);
            }]),
            'jobCount' => $jobCount,
            'reviews' => $reviews,
            'reviewStats' => $reviewStats,
        ]);
    }

    /**
     * Calculate company review statistics
     *
     * @param \App\Models\Company $company
     * @return array
     */
    private function calculateReviewStats(Company $company)
    {
        $reviews = $company->reviews()->where('is_approved', true)->get();

        if ($reviews->isEmpty()) {
            return [
                'average_rating' => 0,
                'total_reviews' => 0,
                'rating_counts' => [
                    '5' => 0,
                    '4' => 0,
                    '3' => 0,
                    '2' => 0,
                    '1' => 0,
                ],
                'average_categories' => [
                    'work_culture' => 0,
                    'career_growth' => 0,
                    'work_life_balance' => 0,
                    'salary_benefits' => 0,
                    'management' => 0,
                ],
            ];
        }

        // Calculate average rating
        $totalRating = $reviews->sum('rating');
        $averageRating = $totalRating / $reviews->count();

        // Count ratings per star
        $ratingCounts = [
            '5' => $reviews->where('rating', 5)->count(),
            '4' => $reviews->where('rating', 4)->count(),
            '3' => $reviews->where('rating', 3)->count(),
            '2' => $reviews->where('rating', 2)->count(),
            '1' => $reviews->where('rating', 1)->count(),
        ];

        // Calculate average category ratings
        $categoryTotals = [
            'work_culture' => 0,
            'career_growth' => 0,
            'work_life_balance' => 0,
            'salary_benefits' => 0,
            'management' => 0,
        ];

        $categoryCounters = [
            'work_culture' => 0,
            'career_growth' => 0,
            'work_life_balance' => 0,
            'salary_benefits' => 0,
            'management' => 0,
        ];

        foreach ($reviews as $review) {
            $categories = $review->rating_categories ?? [];

            foreach ($categoryTotals as $category => $total) {
                if (isset($categories[$category])) {
                    $categoryTotals[$category] += $categories[$category];
                    $categoryCounters[$category]++;
                }
            }
        }

        $averageCategories = [];
        foreach ($categoryTotals as $category => $total) {
            $averageCategories[$category] = $categoryCounters[$category] > 0
                ? $total / $categoryCounters[$category]
                : 0;
        }

        return [
            'average_rating' => round($averageRating, 1),
            'total_reviews' => $reviews->count(),
            'rating_counts' => $ratingCounts,
            'average_categories' => $averageCategories,
        ];
    }
}
