<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CandidateMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Jika tidak login
        if (!Auth::check()) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            return redirect()->route('login');
        }

        // Jika bukan candidate
        if (Auth::user()->role->slug !== 'candidate') {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Unauthorized. Candidate access required.'], 403);
            }
            return redirect()->route('dashboard')->with('error', 'You do not have candidate access.');
        }

        // Jika candidate, lanjutkan request
        return $next($request);
    }
}
