<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Company;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class CompanyProfileController extends Controller
{
    /**
     * Display the company profile page.
     */
    public function index()
    {
        // Get the primary company the user manages
        $company = Auth::user()->managedCompanies()
            ->wherePivot('is_primary', true)
            ->first();

        // If no primary company, get the first company they manage
        if (!$company) {
            $company = Auth::user()->managedCompanies()->first();
        }

        if (!$company) {
            return redirect()->route('manager.dashboard')
                ->with('error', 'Anda tidak memiliki akses ke perusahaan manapun.');
        }

        // Get company with its statistics
        $company->load('jobs');

        // Get statistics for the company
        $totalJobs = $company->jobs()->count();
        $activeJobs = $company->jobs()->where('is_active', true)->count();
        $totalApplications = $company->jobs()->withCount('jobApplications')->get()->sum('job_applications_count');

        // Get the recent job applications
        $recentApplications = $company->jobs()
            ->with(['jobApplications' => function($query) {
                $query->with(['user', 'status'])->latest()->take(5);
            }])
            ->get()
            ->pluck('jobApplications')
            ->flatten()
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->map(function($application) {
                return [
                    'id' => $application->id,
                    'job' => [
                        'id' => $application->job->id,
                        'title' => $application->job->title,
                    ],
                    'user' => [
                        'id' => $application->user->id,
                        'name' => $application->user->name,
                        'avatar' => $application->user->avatar ? Storage::url($application->user->avatar) : null,
                    ],
                    'status' => [
                        'name' => $application->status->name,
                        'color' => $application->status->color,
                    ],
                    'created_at' => $application->created_at->format('Y-m-d'),
                ];
            });

        // Get company managers
        $managers = $company->managers()
            ->withPivot('is_primary')
            ->get()
            ->map(function($manager) {
                return [
                    'id' => $manager->id,
                    'name' => $manager->name,
                    'email' => $manager->email,
                    'avatar' => $manager->avatar ? Storage::url($manager->avatar) : null,
                    'is_primary' => $manager->pivot->is_primary,
                ];
            });

        return Inertia::render('Manager/CompanyProfile/Index', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'description' => $company->description,
                'logo' => $company->logo ? Storage::url($company->logo) : null,
                'website' => $company->website,
                'address' => $company->address,
                'phone' => $company->phone,
                'email' => $company->email,
                'industry' => $company->industry,
                'is_active' => $company->is_active,
                'created_at' => $company->created_at->format('Y-m-d'),
                'updated_at' => $company->updated_at->format('Y-m-d'),
            ],
            'stats' => [
                'totalJobs' => $totalJobs,
                'activeJobs' => $activeJobs,
                'totalApplications' => $totalApplications,
            ],
            'recentApplications' => $recentApplications,
            'managers' => $managers,
        ]);
    }

    /**
     * Show the form for editing the company profile.
     */
    public function edit()
    {
        // Get the primary company the user manages
        $company = Auth::user()->managedCompanies()
            ->wherePivot('is_primary', true)
            ->first();

        // If no primary company, get the first company they manage
        if (!$company) {
            $company = Auth::user()->managedCompanies()->first();
        }

        if (!$company) {
            return redirect()->route('manager.dashboard')
                ->with('error', 'Anda tidak memiliki akses ke perusahaan manapun.');
        }

        // Industries list for dropdown
        $industries = [
            ['id' => 'Teknologi', 'name' => 'Teknologi'],
            ['id' => 'Kesehatan', 'name' => 'Kesehatan'],
            ['id' => 'Pendidikan', 'name' => 'Pendidikan'],
            ['id' => 'Keuangan', 'name' => 'Keuangan'],
            ['id' => 'Retail', 'name' => 'Retail'],
            ['id' => 'Manufaktur', 'name' => 'Manufaktur'],
            ['id' => 'Media', 'name' => 'Media'],
            ['id' => 'Hiburan', 'name' => 'Hiburan'],
            ['id' => 'Pariwisata', 'name' => 'Pariwisata'],
            ['id' => 'Makanan & Minuman', 'name' => 'Makanan & Minuman'],
            ['id' => 'Transportasi', 'name' => 'Transportasi'],
            ['id' => 'Logistik', 'name' => 'Logistik'],
            ['id' => 'Konstruksi', 'name' => 'Konstruksi'],
            ['id' => 'Real Estate', 'name' => 'Real Estate'],
            ['id' => 'Konsultan', 'name' => 'Konsultan'],
            ['id' => 'Minyak & Gas', 'name' => 'Minyak & Gas'],
            ['id' => 'Pertambangan', 'name' => 'Pertambangan'],
            ['id' => 'Agrikultur', 'name' => 'Agrikultur'],
            ['id' => 'Telekomunikasi', 'name' => 'Telekomunikasi'],
            ['id' => 'Lainnya', 'name' => 'Lainnya']
        ];

        return Inertia::render('Manager/CompanyProfile/Edit', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'description' => $company->description,
                'logo' => $company->logo ? Storage::url($company->logo) : null,
                'website' => $company->website,
                'address' => $company->address,
                'phone' => $company->phone,
                'email' => $company->email,
                'industry' => $company->industry,
            ],
            'industries' => $industries,
        ]);
    }

    /**
     * Update the company profile.
     */
    public function update(Request $request)
    {
        try {
            Log::info('Starting company profile update', ['user_id' => Auth::id()]);
            
            // Get the primary company the user manages
            $company = Auth::user()->managedCompanies()
                ->wherePivot('is_primary', true)
                ->first();

            // If no primary company, get the first company they manage
            if (!$company) {
                $company = Auth::user()->managedCompanies()->first();
            }

            if (!$company) {
                Log::warning('User attempted to update company with no access', ['user_id' => Auth::id()]);
                return redirect()->route('manager.dashboard')
                    ->with('error', 'Anda tidak memiliki akses ke perusahaan manapun.');
            }

            // Validate request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'website' => 'nullable|url|max:255',
                'address' => 'nullable|string',
                'phone' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'industry' => 'nullable|string',
                'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
            ], [
                'logo.image' => 'File harus berupa gambar.',
                'logo.mimes' => 'Format gambar yang didukung: JPEG, PNG, JPG, GIF.',
                'logo.max' => 'Ukuran file tidak boleh lebih dari 2MB.',
            ]);

            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }

            // Handle logo upload
            if ($request->hasFile('logo')) {
                Log::info('Processing logo upload', ['company_id' => $company->id]);
                
                try {
                    // Delete old logo if exists
                    if ($company->logo) {
                        Storage::disk('public')->delete($company->logo);
                    }

                    // Generate unique filename
                    $fileName = 'company_' . $company->id . '_' . time() . '.' . 
                        $request->file('logo')->getClientOriginalExtension();
                    
                    // Store new logo with the unique filename
                    $logoPath = $request->file('logo')->storeAs('company_logos', $fileName, 'public');
                    $company->logo = $logoPath;
                    
                    Log::info('Logo uploaded successfully', ['path' => $logoPath]);
                } catch (\Exception $e) {
                    Log::error('Failed to upload company logo', [
                        'error' => $e->getMessage(),
                        'company_id' => $company->id
                    ]);
                    
                    return redirect()->back()
                        ->with('error', 'Gagal mengunggah logo perusahaan. Silakan coba lagi.');
                }
            }

            // Update company details
            $company->name = $request->name;
            $company->description = $request->description ?: null;
            $company->website = $request->website ?: null;
            $company->address = $request->address ?: null;
            $company->phone = $request->phone ?: null;
            $company->email = $request->email ?: null;
            $company->industry = $request->industry ?: null;
            
            // Save changes
            $company->save();
            
            Log::info('Company profile updated successfully', ['company_id' => $company->id]);
            
            return redirect()->route('manager.company-profile.index')
                ->with('success', 'Profil perusahaan berhasil diperbarui.');
                
        } catch (\Exception $e) {
            Log::error('Failed to update company profile', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan saat memperbarui profil perusahaan. Silakan coba lagi.');
        }
    }
}
