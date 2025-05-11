<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Company;
use App\Models\Job;
use App\Models\JobApplication;
use Symfony\Component\HttpFoundation\Response;

class CheckCompanyAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip for admins
        if (Auth::user()->role->slug === 'admin') {
            return $next($request);
        }

        // Manager can only access their own company
        if (Auth::user()->role->slug === 'manager') {
            // Get the manager's companies
            $companyIds = Auth::user()->managedCompanies()->pluck('companies.id')->toArray();

            // Check company access
            if ($request->route('company') && !in_array($request->route('company')->id, $companyIds)) {
                return $this->unauthorized($request);
            }

            // Check job access
            if ($request->route('job')) {
                $job = $request->route('job');
                if (!in_array($job->company_id, $companyIds)) {
                    return $this->unauthorized($request);
                }
            }

            // Check application access
            if ($request->route('application')) {
                $application = $request->route('application');
                $job = Job::find($application->job_id);
                if (!$job || !in_array($job->company_id, $companyIds)) {
                    return $this->unauthorized($request);
                }
            }
        }

        return $next($request);
    }

    private function unauthorized(Request $request)
    {
        if ($request->wantsJson()) {
            return response()->json(['error' => 'Unauthorized. You can only access your company resources.'], 403);
        }

        return redirect()->route('manager.dashboard')->with('error', 'You can only access your company resources.');
    }
}
