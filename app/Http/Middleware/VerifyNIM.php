<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\NIMVerificationService;
use Symfony\Component\HttpFoundation\Response;

class VerifyNIM
{
    protected $verificationService;

    public function __construct(NIMVerificationService $verificationService)
    {
        $this->verificationService = $verificationService;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->has('nim')) {
            $nim = $request->nim;

            if (!$this->verificationService->verifyNIM($nim)) {
                return response()->json([
                    'error' => 'Invalid NIM. Only students from this campus can register.',
                    'field' => 'nim'
                ], 422);
            }
        }

        return $next($request);
    }
}
