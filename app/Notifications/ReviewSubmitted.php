<?php

namespace App\Notifications;

use App\Models\CompanyReview;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class ReviewSubmitted extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The company review instance.
     *
     * @var \App\Models\CompanyReview
     */
    protected $review;

    /**
     * Create a new notification instance.
     */
    public function __construct(CompanyReview $review)
    {
        $this->review = $review;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $companyName = $this->review->company->name;
        $reviewerName = $this->review->is_anonymous ? 'Anonymous User' : $this->review->user->name;
        $rating = $this->review->rating;
        $stars = str_repeat('★', $rating) . str_repeat('☆', 5 - $rating);

        return (new MailMessage)
            ->subject("New Company Review for {$companyName}")
            ->greeting("Hello {$notifiable->name},")
            ->line("A new review has been submitted for {$companyName}.")
            ->line("Reviewer: {$reviewerName}")
            ->line(new HtmlString("Rating: <strong>{$stars} ({$rating}/5)</strong>"))
            ->line(new HtmlString("Review: <em>" . nl2br(e($this->review->review_text)) . "</em>"))
            ->action('View Review Details', url('/company/reviews/' . $this->review->id))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'review_id' => $this->review->id,
            'company_id' => $this->review->company_id,
            'company_name' => $this->review->company->name,
            'rating' => $this->review->rating,
            'is_anonymous' => $this->review->is_anonymous,
            'reviewer_name' => $this->review->is_anonymous ? 'Anonymous User' : $this->review->user->name,
            'submitted_at' => $this->review->created_at->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => 'company_review',
            'title' => 'New Company Review',
            'message' => "A new " . $this->review->rating . "-star review has been submitted for " . $this->review->company->name,
            'review_id' => $this->review->id,
            'company_id' => $this->review->company_id,
            'time' => now()->diffForHumans(),
        ]);
    }
}
