<?php

namespace App\Exports;

use App\Models\JobApplication;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class JobApplicationsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $applications;

    public function __construct($applications)
    {
        $this->applications = $applications;
    }

    /**
     * Return the collection of applications to export
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return $this->applications;
    }

    /**
     * Define the CSV headings
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Applicant Name',
            'Applicant Email',
            'Job Title',
            'Job Location',
            'Status',
            'Current Stage',
            'Applied Date',
        ];
    }

    /**
     * Map the application data to CSV columns
     * @param  mixed $application
     * @return array
     */
    public function map($application): array
    {
        return [
            $application->id,
            $application->user->name,
            $application->user->email,
            $application->job->title,
            $application->job->location,
            $application->status ? $application->status->name : 'Unknown',
            $application->currentStage ? $application->currentStage->name : 'Not started',
            $application->created_at->toDateString(),
        ];
    }
}
