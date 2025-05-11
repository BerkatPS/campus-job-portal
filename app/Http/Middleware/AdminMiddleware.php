<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && Auth::user()->role->slug === 'admin') {
            return $next($request);
        }

        if ($request->wantsJson()) {
            return response()->json(['error' => 'Unauthorized. Admin access required.'], 403);
        }

        return redirect()->route('dashboard')->with('error', 'You do not have admin access.');
    }

}
