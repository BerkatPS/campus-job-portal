<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ForumCategory;
use Illuminate\Support\Str;

class ForumCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Pengumuman',
                'description' => 'Pengumuman penting dari kampus dan administrator',
                'icon' => 'campaign',
                'color' => '#ef476f',
                'sort_order' => 1
            ],
            [
                'name' => 'Karir & Magang',
                'description' => 'Diskusi tentang karir, magang, dan peluang kerja',
                'icon' => 'work',
                'color' => '#118ab2',
                'sort_order' => 2
            ],
            [
                'name' => 'Tips & Trik Wawancara',
                'description' => 'Berbagi tips dan trik untuk persiapan wawancara kerja',
                'icon' => 'lightbulb',
                'color' => '#06d6a0',
                'sort_order' => 3
            ],
            [
                'name' => 'Pembuatan CV & Resume',
                'description' => 'Panduan dan saran untuk membuat CV dan resume yang menarik',
                'icon' => 'description',
                'color' => '#ffd166',
                'sort_order' => 4
            ],
            [
                'name' => 'Pengalaman Kerja',
                'description' => 'Berbagi pengalaman kerja dan magang di berbagai perusahaan',
                'icon' => 'business_center',
                'color' => '#073b4c',
                'sort_order' => 5
            ],
            [
                'name' => 'Teknologi & IT',
                'description' => 'Diskusi seputar teknologi terkini dan dunia IT',
                'icon' => 'computer',
                'color' => '#3a86ff',
                'sort_order' => 6
            ],
            [
                'name' => 'Bisnis & Kewirausahaan',
                'description' => 'Forum untuk diskusi bisnis dan kewirausahaan',
                'icon' => 'storefront',
                'color' => '#fb8500',
                'sort_order' => 7
            ],
            [
                'name' => 'Alumni',
                'description' => 'Forum untuk alumni dan networking',
                'icon' => 'school',
                'color' => '#8338ec',
                'sort_order' => 8
            ],
            [
                'name' => 'Pertanyaan Umum',
                'description' => 'Tanya jawab seputar CampusJob dan fitur-fiturnya',
                'icon' => 'help',
                'color' => '#ff006e',
                'sort_order' => 9
            ]
        ];
        
        foreach ($categories as $category) {
            $slug = Str::slug($category['name']);
            ForumCategory::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $category['name'],
                    'slug' => $slug,
                    'description' => $category['description'],
                    'icon' => $category['icon'],
                    'color' => $category['color'],
                    'sort_order' => $category['sort_order'],
                    'is_active' => true
                ]
            );
        }
    }
}
