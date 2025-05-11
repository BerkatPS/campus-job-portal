<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Inertia\Inertia;

class EmailVerificationController extends Controller
{
    /**
     * Show the email verification notice.
     */
    public function show(Request $request)
    {
        return $request->user()->hasVerifiedEmail()
            ? redirect()->intended(route('dashboard'))
            : Inertia::render('Auth/VerifyEmail');
    }

    /**
     * Verify the email.
     */
    public function verify(EmailVerificationRequest $request)
    {
        $request->fulfill();
 
        return redirect()->route('dashboard');
    }

    /**
     * Resend the email verification notification.
     */
    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }
 
        $request->user()->sendEmailVerificationNotification();
 
        return back()->with('status', 'verification-link-sent');
    }
} 