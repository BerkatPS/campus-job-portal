<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Broadcasting\PrivateChannel;
use App\Models\Company;

class NewCompanyRegistration extends BaseNotification
{
    /**
     * @var Company
     */
    protected $company;

    /**
     * Create a new notification instance.
     *
     * @param mixed $notifiable The admin receiving the notification
     * @param Company $company The newly registered company
     * @param array $data Additional data
     */
    public function __construct($notifiable, Company $company, array $data = [])
    {
        parent::__construct($notifiable, $data);
        $this->company = $company;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = route('admin.companies.show', $this->company->id);

        return (new MailMessage)
            ->subject('Pendaftaran Perusahaan Baru: ' . $this->company->name)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line('Perusahaan baru telah mendaftar di platform dan perlu ditinjau:')
            ->line('Nama: ' . $this->company->name)
            ->line('Email: ' . $this->company->email)
            ->line('Nomor Telepon: ' . $this->company->phone)
            ->line('Industri: ' . $this->company->industry)
            ->action('Tinjau Perusahaan', $url)
            ->line('Silakan tinjau informasi perusahaan dan menyetujui atau menolak pendaftaran.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $url = route('admin.companies.show', $this->company->id);
        
        return [
            'title' => 'Pendaftaran Perusahaan Baru',
            'message' => 'Perusahaan baru "' . $this->company->name . '" telah mendaftar dan menunggu persetujuan',
            'action_url' => $url,
            'action_text' => 'Tinjau Perusahaan',
            'company_id' => $this->company->id,
            'company_name' => $this->company->name,
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     *
     * @param mixed $notifiable
     * @return BroadcastMessage
     */
        public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => get_class($this),
            'data' => $this->toArray($notifiable),
            'created_at' => now()->toISOString(),
            'read_at' => null,
        ]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn($notifiable)
    {
        return new PrivateChannel('App.Models.User.' . $notifiable->id);
    }
}
