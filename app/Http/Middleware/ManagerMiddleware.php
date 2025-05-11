<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;


class ManagerMiddleware
{

    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            return redirect()->route('login');
        }

        if (Auth::user()->role->slug !== 'manager') {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Unauthorized. Manager access required.'], 403);
            }
            return redirect()->route('dashboard')->with('error', 'You do not have manager access.');
        }

        return $next($request);
    }
}

