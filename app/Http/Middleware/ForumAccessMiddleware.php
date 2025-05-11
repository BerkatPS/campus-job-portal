<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ForumAccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('message', 'Anda harus login untuk mengakses forum.');
        }

        if (!Auth::user()->isCandidate()) {
            return redirect()->route('public.home')->with('error', 'Hanya mahasiswa yang dapat mengakses forum.');
        }

        return $next($request);
    }
} 