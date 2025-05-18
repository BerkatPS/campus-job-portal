<?php

namespace App\Policies;

use App\Models\PortfolioItem;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PortfolioItemPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PortfolioItem $portfolioItem): bool
    {
        return $user->id === $portfolioItem->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PortfolioItem $portfolioItem): bool
    {
        return $user->id === $portfolioItem->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PortfolioItem $portfolioItem): bool
    {
        return $user->id === $portfolioItem->user_id;
    }
}
