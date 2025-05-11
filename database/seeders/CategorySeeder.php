<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Teknologi Informasi',
                'description' => 'Pekerjaan di bidang teknologi informasi, pemrograman, dan IT support.'
            ],
            [
                'name' => 'Keuangan',
                'description' => 'Pekerjaan di bidang keuangan, akuntansi, dan perbankan.'
            ],
            [
                'name' => 'Marketing',
                'description' => 'Pekerjaan di bidang pemasaran, digital marketing, dan sales.'
            ],
            [
                'name' => 'Desain & Kreatif',
                'description' => 'Pekerjaan di bidang desain, multimedia, dan kreativitas.'
            ],
            [
                'name' => 'Pendidikan',
                'description' => 'Pekerjaan di bidang pendidikan dan pengajaran.'
            ],
            [
                'name' => 'Kesehatan',
                'description' => 'Pekerjaan di bidang kesehatan dan medis.'
            ],
            [
                'name' => 'Teknik & Engineering',
                'description' => 'Pekerjaan di bidang teknik dan engineering.'
            ],
            [
                'name' => 'Administrasi',
                'description' => 'Pekerjaan di bidang administrasi dan manajemen kantor.'
            ],
            [
                'name' => 'Customer Service',
                'description' => 'Pekerjaan di bidang pelayanan pelanggan.'
            ],
            [
                'name' => 'Lainnya',
                'description' => 'Kategori untuk pekerjaan lainnya.'
            ],
        ];

        foreach ($categories as $category) {
            $slug = Str::slug($category['name']);
            Category::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $category['name'],
                    'slug' => $slug,
                    'description' => $category['description'],
                ]
            );
        }
    }
} 