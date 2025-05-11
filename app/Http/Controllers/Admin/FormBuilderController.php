<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FormField;
use App\Models\FormSection;
use App\Http\Requests\Admin\FormSectionRequest;
use App\Http\Requests\Admin\FormFieldRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormBuilderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $formSections = FormSection::with('formFields')
            ->orderBy('order_index')
            ->get()
            ->map(function ($section) {
                return [
                    'id' => $section->id,
                    'name' => $section->name,
                    'description' => $section->description,
                    'is_enabled' => $section->is_enabled,
                    'order_index' => $section->order_index,
                    'fields_count' => $section->formFields->count(),
                    'created_at' => $section->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Admin/FormBuilder/Index', [
            'formSections' => $formSections,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/FormBuilder/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FormSectionRequest $request)
    {
        // Get the highest order_index
        $maxOrder = FormSection::max('order_index') ?? 0;

        // Create the form section
        $section = FormSection::create([
            'name' => $request->name,
            'description' => $request->description,
            'is_enabled' => $request->is_enabled,
            'order_index' => $request->order_index ?? ($maxOrder + 1),
        ]);

        // Process the fields
        if ($request->has('fields') && is_array($request->fields)) {
            foreach ($request->fields as $index => $fieldData) {
                $section->formFields()->create([
                    'name' => $fieldData['name'],
                    'field_type' => $fieldData['field_type'],
                    'options' => $fieldData['options'] ?? null,
                    'is_required' => $fieldData['is_required'] ?? false,
                    'order_index' => $index,
                ]);
            }
        }

        return redirect()->route('admin.form-builder.edit', $section->id)
            ->with('success', 'Form section created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(FormSection $formSection)
    {
        // Redirect to edit
        return redirect()->route('admin.form-builder.edit', $formSection->id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FormSection $formSection)
    {
        $formSection->load(['formFields' => function($query) {
            $query->orderBy('order_index');
        }]);

        return Inertia::render('Admin/FormBuilder/Edit', [
            'formSection' => [
                'id' => $formSection->id,
                'name' => $formSection->name,
                'description' => $formSection->description,
                'is_enabled' => $formSection->is_enabled,
                'order_index' => $formSection->order_index,
            ],
            'formFields' => $formSection->formFields->map(function($field) {
                return [
                    'id' => $field->id,
                    'name' => $field->name,
                    'field_type' => $field->field_type,
                    'options' => $field->options,
                    'is_required' => $field->is_required,
                    'order_index' => $field->order_index,
                ];
            }),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FormSectionRequest $request, FormSection $formSection)
    {
        // Update the form section
        $formSection->update([
            'name' => $request->name,
            'description' => $request->description,
            'is_enabled' => $request->is_enabled,
            'order_index' => $request->order_index ?? $formSection->order_index,
        ]);

        // Handle fields if they exist
        if ($request->has('fields') && is_array($request->fields)) {
            // Get existing field IDs
            $existingFieldIds = $formSection->formFields()->pluck('id')->toArray();
            $updatedFieldIds = [];

            foreach ($request->fields as $index => $fieldData) {
                if (isset($fieldData['id']) && $fieldData['id']) {
                    // Update existing field
                    $formSection->formFields()->where('id', $fieldData['id'])->update([
                        'name' => $fieldData['name'],
                        'field_type' => $fieldData['field_type'],
                        'options' => $fieldData['options'] ?? null,
                        'is_required' => $fieldData['is_required'] ?? false,
                        'order_index' => $index,
                    ]);
                    $updatedFieldIds[] = $fieldData['id'];
                } else {
                    // Create new field
                    $field = $formSection->formFields()->create([
                        'name' => $fieldData['name'],
                        'field_type' => $fieldData['field_type'],
                        'options' => $fieldData['options'] ?? null,
                        'is_required' => $fieldData['is_required'] ?? false,
                        'order_index' => $index,
                    ]);
                    $updatedFieldIds[] = $field->id;
                }
            }

            // Delete fields that were not in the update
            $fieldsToDelete = array_diff($existingFieldIds, $updatedFieldIds);
            if (!empty($fieldsToDelete)) {
                $formSection->formFields()->whereIn('id', $fieldsToDelete)->delete();
            }
        }

        return redirect()->route('admin.form-builder.edit', $formSection->id)
            ->with('success', 'Form section updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FormSection $formSection)
    {
        $formSection->delete();

        return redirect()->route('admin.form-builder.index')
            ->with('success', 'Form section deleted successfully.');
    }

    /**
     * Toggle the enabled status of the form section.
     */
    public function toggle(FormSection $formSection)
    {
        $formSection->update([
            'is_enabled' => !$formSection->is_enabled
        ]);

        return back()->with('success', 'Form section status updated successfully.');
    }

    /**
     * Reorder form sections.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'sections' => 'required|array',
            'sections.*.id' => 'required|exists:form_sections,id',
            'sections.*.order_index' => 'required|integer|min:0',
        ]);

        foreach ($request->sections as $section) {
            FormSection::where('id', $section['id'])->update([
                'order_index' => $section['order_index'],
            ]);
        }

        return back()->with('success', 'Form sections reordered successfully.');
    }

    /**
     * Store a new form field.
     */
    public function storeField(FormFieldRequest $request, FormSection $section)
    {
        // Get the highest order_index
        $maxOrder = $section->formFields()->max('order_index') ?? 0;

        // Create the form field
        $field = $section->formFields()->create([
            'name' => $request->name,
            'field_type' => $request->field_type,
            'options' => $request->options,
            'is_required' => $request->is_required,
            'order_index' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Form field added successfully.');
    }

    /**
     * Update a form field.
     */
    public function updateField(FormFieldRequest $request, FormField $field)
    {
        // Update the form field
        $field->update([
            'name' => $request->name,
            'field_type' => $request->field_type,
            'options' => $request->options,
            'is_required' => $request->is_required,
        ]);

        return back()->with('success', 'Form field updated successfully.');
    }

    /**
     * Remove a form field.
     */
    public function destroyField(FormField $field)
    {
        $field->delete();

        return back()->with('success', 'Form field deleted successfully.');
    }

    /**
     * Reorder form fields.
     */
    public function reorderFields(Request $request, FormSection $section)
    {
        $request->validate([
            'fields' => 'required|array',
            'fields.*.id' => 'required|exists:form_fields,id',
            'fields.*.order_index' => 'required|integer|min:0',
        ]);

        foreach ($request->fields as $field) {
            FormField::where('id', $field['id'])
                ->where('form_section_id', $section->id)
                ->update([
                    'order_index' => $field['order_index'],
                ]);
        }

        return back()->with('success', 'Form fields reordered successfully.');
    }
}
