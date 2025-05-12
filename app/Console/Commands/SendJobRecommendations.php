<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NotificationService;

class SendJobRecommendations extends Command
{
    protected $signature = 'notifications:job-recommendations';
    protected $description = 'Send job recommendations to candidates based on their profiles';

    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    public function handle()
    {
        $this->info('Sending job recommendations...');
        $this->notificationService->sendJobRecommendations();
        $this->info('Job recommendations sent successfully.');
    }
}
