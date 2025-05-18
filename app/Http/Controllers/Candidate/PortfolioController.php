<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    /**
     * Display a listing of the portfolio items.
     */
    public function index()
    {
        $user = auth()->user();
        $portfolioItems = $user->portfolioItems()
            ->orderBy('is_featured', 'desc')
            ->orderBy('display_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'project_url' => $item->project_url,
                    'repository_url' => $item->repository_url,
                    'thumbnail' => $item->thumbnail ? Storage::url($item->thumbnail) : null,
                    'start_date' => $item->start_date ? $item->start_date->format('Y-m-d') : null,
                    'end_date' => $item->end_date ? $item->end_date->format('Y-m-d') : null,
                    'type' => $item->type,
                    'is_featured' => $item->is_featured,
                    'display_order' => $item->display_order,
                    'role' => $item->role,
                    'organization' => $item->organization,
                    'skills' => $item->skills,
                    'achievements' => $item->achievements,
                    'media_type' => $item->media_type,
                    'media_url' => $item->media_url,
                    'created_at' => $item->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $item->updated_at->format('Y-m-d H:i:s'),
                ];
            });

        $types = PortfolioItem::getTypes();

        return Inertia::render('Candidate/Portfolio/Index', [
            'portfolioItems' => $portfolioItems,
            'types' => $types
        ]);
    }

    /**
     * Show the form for creating a new portfolio item.
     */
    public function create()
    {
        $types = PortfolioItem::getTypes();
        $mediaTypes = PortfolioItem::getMediaTypes();

        return Inertia::render('Candidate/Portfolio/Create', [
            'types' => $types,
            'mediaTypes' => $mediaTypes
        ]);
    }

    /**
     * Store a newly created portfolio item in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_url' => 'nullable|url|max:255',
            'repository_url' => 'nullable|url|max:255',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'type' => 'required|string|in:'.implode(',', array_keys(PortfolioItem::getTypes())),
            'is_featured' => 'boolean',
            'role' => 'nullable|string|max:255',
            'organization' => 'nullable|string|max:255',
            'skills' => 'nullable|array',
            'achievements' => 'nullable|array',
            'media_type' => 'nullable|string|in:'.implode(',', array_keys(PortfolioItem::getMediaTypes())),
            'media_url' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();
        $data['user_id'] = $user->id;

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail') && $request->file('thumbnail')->isValid()) {
            $thumbnailPath = $request->file('thumbnail')->store('portfolio_thumbnails', 'public');
            $data['thumbnail'] = $thumbnailPath;
        }

        // Set display order to the highest current value + 1
        $lastOrder = $user->portfolioItems()->max('display_order') ?? 0;
        $data['display_order'] = $lastOrder + 1;

        PortfolioItem::create($data);

        return redirect()->route('candidate.portfolio.index')
            ->with('success', 'Portfolio item created successfully');
    }

    /**
     * Display the specified portfolio item.
     */
    public function show(PortfolioItem $portfolioItem)
    {
        // Make sure the portfolio item belongs to the authenticated user
        $this->authorize('view', $portfolioItem);

        $portfolioItem->thumbnail = $portfolioItem->thumbnail ? Storage::url($portfolioItem->thumbnail) : null;

        return Inertia::render('Candidate/Portfolio/Show', [
            'portfolioItem' => $portfolioItem,
            'types' => PortfolioItem::getTypes(),
            'mediaTypes' => PortfolioItem::getMediaTypes()
        ]);
    }

    /**
     * Show the form for editing the specified portfolio item.
     */
    public function edit(PortfolioItem $portfolioItem)
    {
        // Make sure the portfolio item belongs to the authenticated user
        $this->authorize('update', $portfolioItem);

        $types = PortfolioItem::getTypes();
        $mediaTypes = PortfolioItem::getMediaTypes();

        $portfolioItem->thumbnail = $portfolioItem->thumbnail ? Storage::url($portfolioItem->thumbnail) : null;

        return Inertia::render('Candidate/Portfolio/Edit', [
            'portfolioItem' => $portfolioItem,
            'types' => $types,
            'mediaTypes' => $mediaTypes
        ]);
    }

    /**
     * Update the specified portfolio item in storage.
     */
    public function update(Request $request, PortfolioItem $portfolioItem)
    {
        // Make sure the portfolio item belongs to the authenticated user
        $this->authorize('update', $portfolioItem);

        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'project_url' => 'nullable|url|max:255',
            'repository_url' => 'nullable|url|max:255',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'type' => 'nullable|string|in:'.implode(',', array_keys(PortfolioItem::getTypes())),
            'is_featured' => 'boolean',
            'role' => 'nullable|string|max:255',
            'organization' => 'nullable|string|max:255',
            'skills' => 'nullable|array',
            'achievements' => 'nullable|array',
            'media_type' => 'nullable|string|in:'.implode(',', array_keys(PortfolioItem::getMediaTypes())),
            'media_url' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail') && $request->file('thumbnail')->isValid()) {
            // Delete old thumbnail if exists
            if ($portfolioItem->thumbnail && Storage::disk('public')->exists($portfolioItem->thumbnail)) {
                Storage::disk('public')->delete($portfolioItem->thumbnail);
            }

            $thumbnailPath = $request->file('thumbnail')->store('portfolio_thumbnails', 'public');
            $data['thumbnail'] = $thumbnailPath;
        }

        $portfolioItem->update($data);

        return redirect()->route('candidate.portfolio.index')
            ->with('success', 'Portfolio item updated successfully');
    }

    /**
     * Remove the specified portfolio item from storage.
     */
    public function destroy(PortfolioItem $portfolioItem)
    {
        // Make sure the portfolio item belongs to the authenticated user
        $this->authorize('delete', $portfolioItem);

        // Delete thumbnail if exists
        if ($portfolioItem->thumbnail && Storage::disk('public')->exists($portfolioItem->thumbnail)) {
            Storage::disk('public')->delete($portfolioItem->thumbnail);
        }

        $portfolioItem->delete();

        return redirect()->route('candidate.portfolio.index')
            ->with('success', 'Portfolio item deleted successfully');
    }

    /**
     * Update the order of portfolio items.
     */
    public function updateOrder(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:portfolio_items,id',
            'items.*.display_order' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        foreach ($request->items as $item) {
            $portfolioItem = PortfolioItem::find($item['id']);

            // Make sure the portfolio item belongs to the authenticated user
            if ($portfolioItem->user_id === $user->id) {
                $portfolioItem->update(['display_order' => $item['display_order']]);
            }
        }

        return response()->json(['message' => 'Order updated successfully']);
    }

    /**
     * Toggle featured status for a portfolio item.
     */
    public function toggleFeatured(PortfolioItem $portfolioItem)
    {
        // Make sure the portfolio item belongs to the authenticated user
        $this->authorize('update', $portfolioItem);

        $portfolioItem->update([
            'is_featured' => !$portfolioItem->is_featured
        ]);

        return back()->with('success', 'Featured status updated successfully');
    }
}
