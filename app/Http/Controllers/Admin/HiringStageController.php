<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HiringStage;
use App\Http\Requests\Admin\HiringStageRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class HiringStageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hiringStages = HiringStage::orderBy('order_index')
            ->get()
            ->map(function ($stage) {
                return [
                    'id' => $stage->id,
                    'name' => $stage->name,
                    'slug' => $stage->slug,
                    'description' => $stage->description,
                    'color' => $stage->color,
                    'order_index' => $stage->order_index,
                    'is_default' => $stage->is_default,
                    'created_at' => $stage->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Admin/HiringStages/Index', [
            'hiringStages' => $hiringStages,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/HiringStages/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(HiringStageRequest $request)
    {
        // Get the highest order_index
        $maxOrder = HiringStage::max('order_index') ?? 0;

        // Create the hiring stage
        HiringStage::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'color' => $request->color,
            'order_index' => $maxOrder + 1,
            'is_default' => $request->is_default,
        ]);

        return redirect()->route('admin.hiring-stages.index')
            ->with('success', 'Hiring stage created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(HiringStage $hiringStage)
    {
        // Redirect to edit
        return redirect()->route('admin.hiring-stages.edit', $hiringStage->id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(HiringStage $hiringStage)
    {
        return Inertia::render('Admin/HiringStages/Edit', [
            'hiringStage' => [
                'id' => $hiringStage->id,
                'name' => $hiringStage->name,
                'slug' => $hiringStage->slug,
                'description' => $hiringStage->description,
                'color' => $hiringStage->color,
                'order_index' => $hiringStage->order_index,
                'is_default' => $hiringStage->is_default,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(HiringStageRequest $request, HiringStage $hiringStage)
    {
        // Update the hiring stage
        $hiringStage->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'color' => $request->color,
            'is_default' => $request->is_default,
        ]);

        return redirect()->route('admin.hiring-stages.index')
            ->with('success', 'Hiring stage updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HiringStage $hiringStage)
    {
        // Check if stage is being used by any job or application
        $isInUse = $hiringStage->jobHiringStages()->exists() ||
            $hiringStage->jobApplications()->exists() ||
            $hiringStage->stageHistory()->exists();

        if ($isInUse) {
            return back()->with('error', 'Cannot delete hiring stage as it is currently in use.');
        }

        $hiringStage->delete();

        return redirect()->route('admin.hiring-stages.index')
            ->with('success', 'Hiring stage deleted successfully.');
    }

    /**
     * Reorder hiring stages.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'stages' => 'required|array',
            'stages.*.id' => 'required|exists:hiring_stages,id',
            'stages.*.order_index' => 'required|integer|min:0',
        ]);

        foreach ($request->stages as $stage) {
            HiringStage::where('id', $stage['id'])->update([
                'order_index' => $stage['order_index'],
            ]);
        }

        return back()->with('success', 'Hiring stages reordered successfully.');
    }
}
