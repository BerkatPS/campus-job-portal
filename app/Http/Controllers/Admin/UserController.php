<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Http\Requests\Admin\UserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('role')
            ->latest()
            ->paginate(10)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'nim' => $user->nim,
                    'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                    'role' => [
                        'id' => $user->role->id,
                        'name' => $user->role->name,
                    ],
                    'is_active' => $user->is_active,
                    'created_at' => $user->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => request()->all(['search', 'field', 'direction'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get all roles except manager (handled separately)
        $roles = Role::where('slug', '!=', 'manager')
            ->get()
            ->map(function($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                ];
            });

        return Inertia::render('Admin/Users/Create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        // Ensure not trying to create a manager (handled separately)
        $role = Role::findOrFail($request->role_id);
        if ($role->slug === 'manager') {
            return redirect()->back()->with('error', 'Managers should be created using the Manager management interface.');
        }

        // Handle avatar upload if provided
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        // Create the user
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'nim' => $request->nim,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
            'avatar' => $avatarPath,
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // Redirect manager view to manager controller
        if ($user->role->slug === 'manager') {
            return redirect()->route('admin.managers.show', $user->id);
        }

        $user->load('role');

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'nim' => $user->nim,
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                'role' => [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ],
                'is_active' => $user->is_active,
                'created_at' => $user->created_at->format('M d, Y'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        // Redirect manager edit to manager controller
        if ($user->role->slug === 'manager') {
            return redirect()->route('admin.managers.edit', $user->id);
        }

        // Get all roles except manager (handled separately)
        $roles = Role::where('slug', '!=', 'manager')
            ->get()
            ->map(function($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                ];
            });

        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'nim' => $user->nim,
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                'role_id' => $user->role_id,
                'is_active' => $user->is_active,
            ],
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        // Redirect manager update to manager controller
        if ($user->role->slug === 'manager') {
            return redirect()->route('admin.managers.edit', $user->id);
        }

        // Ensure not trying to change to manager role (handled separately)
        $role = Role::findOrFail($request->role_id);
        if ($role->slug === 'manager') {
            return redirect()->back()->with('error', 'Managers should be managed using the Manager management interface.');
        }

        // Prepare data for update
        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'nim' => $request->nim,
            'role_id' => $request->role_id,
            'is_active' => $request->is_active,
        ];

        // Update password if provided
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        // Handle avatar upload if provided
        if ($request->hasFile('avatar')) {
            // Delete old avatar if it exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        // Update the user
        $user->update($data);

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Redirect manager delete to manager controller
        if ($user->role->slug === 'manager') {
            return redirect()->route('admin.managers.destroy', $user->id);
        }

        // Delete avatar if it exists
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
