Table roles {
id integer [pk]
name varchar
slug varchar [unique]
description text
created_at timestamp
updated_at timestamp
}

Table users {
id integer [pk]
name varchar
email varchar [unique]
nim varchar [unique, null]
email_verified_at timestamp
password varchar
role_id integer
avatar varchar
is_active boolean [default: true]
remember_token varchar
created_at timestamp
updated_at timestamp
}

Ref: users.role_id > roles.id

Table companies {
id integer [pk]
name varchar
description text [null]
logo varchar [null]
website varchar [null]
address text [null]
phone varchar [null]
email varchar [null]
industry varchar [null]
is_active boolean [default: true]
created_at timestamp
updated_at timestamp
}

Table company_managers {
id integer [pk]
company_id integer
user_id integer
is_primary boolean [default: false]
created_at timestamp
updated_at timestamp
}

Ref: company_managers.company_id > companies.id
Ref: company_managers.user_id > users.id

Table jobs {
id integer [pk]
title varchar
description text
requirements text [null]
responsibilities text [null]
benefits text [null]
company_id integer
location varchar
job_type varchar
experience_level varchar [null]
salary_min decimal [15, 2, null]
salary_max decimal [15, 2, null]
is_salary_visible boolean [default: false]
vacancies integer [default: 1]
submission_deadline date
is_active boolean [default: true]
created_at timestamp
updated_at timestamp
}

Ref: jobs.company_id > companies.id

Table application_statuses {
id integer [pk]
name varchar
slug varchar [unique]
color varchar [null]
description text [null]
order integer [default: 0]
created_at timestamp
updated_at timestamp
}

Table hiring_stages {
id integer [pk]
name varchar
slug varchar [unique]
description text [null]
color varchar [null]
order_index integer [default: 0]
is_default boolean [default: false]
created_at timestamp
updated_at timestamp
}

Table job_hiring_stages {
id integer [pk]
job_id integer
hiring_stage_id integer
order_index integer [default: 0]
created_at timestamp
updated_at timestamp
}

Ref: job_hiring_stages.job_id > jobs.id
Ref: job_hiring_stages.hiring_stage_id > hiring_stages.id

Table job_applications {
id integer [pk]
job_id integer
user_id integer
current_stage_id integer [null]
status_id integer
cover_letter text [null]
resume varchar [null]
notes text [null]
is_favorite boolean [default: false]
created_at timestamp
updated_at timestamp
}

Ref: job_applications.job_id > jobs.id
Ref: job_applications.user_id > users.id
Ref: job_applications.current_stage_id > hiring_stages.id
Ref: job_applications.status_id > application_statuses.id

Table application_stage_history {
id integer [pk]
job_application_id integer
hiring_stage_id integer
user_id integer [null]
notes text [null]
created_at timestamp
updated_at timestamp
}

Ref: application_stage_history.job_application_id > job_applications.id
Ref: application_stage_history.hiring_stage_id > hiring_stages.id
Ref: application_stage_history.user_id > users.id

Table candidate_profiles {
id integer [pk]
user_id integer
date_of_birth date [null]
phone varchar [null]
address varchar [null]
education text [null]
experience text [null]
skills text [null]
linkedin varchar [null]
website varchar [null]
twitter varchar [null]
github varchar [null]
resume varchar [null]
profile_picture varchar [null]
pan_card_number varchar [null]
created_at timestamp
updated_at timestamp
}

Ref: candidate_profiles.user_id > users.id

Table form_sections {
id integer [pk]
name varchar
description text [null]
is_enabled boolean [default: true]
order_index integer [default: 0]
created_at timestamp
updated_at timestamp
}

Table form_fields {
id integer [pk]
form_section_id integer
name varchar
field_type varchar
options text [null]
is_required boolean [default: false]
order_index integer [default: 0]
created_at timestamp
updated_at timestamp
}

Ref: form_fields.form_section_id > form_sections.id

Table form_responses {
id integer [pk]
job_application_id integer
form_field_id integer
response_value text
created_at timestamp
updated_at timestamp
}

Ref: form_responses.job_application_id > job_applications.id
Ref: form_responses.form_field_id > form_fields.id

Table events {
id integer [pk]
title varchar
description text [null]
start_time datetime
end_time datetime
job_application_id integer [null]
job_id integer [null]
user_id integer [null]
location varchar [null]
meeting_link varchar [null]
type varchar [null]
status varchar [null]
attendees json [null]
notes text [null]
created_at timestamp
updated_at timestamp
}

Ref: events.job_application_id > job_applications.id
Ref: events.job_id > jobs.id
Ref: events.user_id > users.id

Table sessions {
id varchar [pk]
user_id integer [null]
ip_address varchar [null]
user_agent text [null]
payload longtext
last_activity integer
}

Table categories {
id integer [pk]
name varchar
slug varchar [unique]
description text [null]
created_at timestamp
updated_at timestamp
}

Table forum_categories {
id integer [pk]
name varchar
slug varchar [unique]
description text [null]
icon varchar [null]
color varchar [default: '#4361ee']
sort_order integer [default: 0]
is_active boolean [default: true]
created_at timestamp
updated_at timestamp
}

Table forum_topics {
id integer [pk]
title varchar
slug varchar [unique]
forum_category_id integer
user_id integer
is_pinned boolean [default: false]
is_locked boolean [default: false]
views integer [default: 0]
created_at timestamp
updated_at timestamp
}

Ref: forum_topics.forum_category_id > forum_categories.id
Ref: forum_topics.user_id > users.id

Table forum_posts {
id integer [pk]
content text
forum_topic_id integer
user_id integer
is_solution boolean [default: false]
created_at timestamp
updated_at timestamp
deleted_at timestamp [null]
}

Ref: forum_posts.forum_topic_id > forum_topics.id
Ref: forum_posts.user_id > users.id

Table forum_likes {
id integer [pk]
forum_post_id integer
user_id integer
created_at timestamp
updated_at timestamp
}

Ref: forum_likes.forum_post_id > forum_posts.id
Ref: forum_likes.user_id > users.id

Table cache {
key varchar [pk]
value mediumtext
expiration integer
}

Table cache_locks {
key varchar [pk]
owner varchar
expiration integer
}



1. Fitur Untuk Kandidat (Candidate)
   a. Personalized Job Recommendations
   Deskripsi: Menggunakan algoritma untuk merekomendasikan pekerjaan yang sesuai dengan keterampilan, pengalaman, dan preferensi kandidat.

Cara Kerja: Kandidat akan menerima daftar pekerjaan yang dipersonalisasi berdasarkan data yang ada di profil mereka (misalnya, riwayat pekerjaan, keterampilan, pendidikan).

Keuntungan: Menyederhanakan pencarian pekerjaan dan meningkatkan peluang kandidat untuk menemukan pekerjaan yang sesuai dengan kebutuhan mereka.


AI-Powered Resume Enhancer
Deskripsi: Fitur berbasis AI untuk memeriksa resume kandidat dan memberikan saran untuk perbaikan atau peningkatan agar lebih sesuai dengan standar industri.

Cara Kerja: Algoritma AI akan menganalisis resume kandidat dan memberikan umpan balik tentang format, kata kunci, dan informasi yang kurang atau tidak relevan.

Keuntungan: Membantu kandidat meningkatkan kualitas resume mereka, meningkatkan peluang untuk diterima.

Career Path Simulator

Analisis historis aplikasi di application_stage_history

Visualisasi perkembangan karir dan rekomendasi peningkatan skill

Candidate Relationship Management (CRM)

Tabel talent_pools dan campaigns

Fitur nurture campaign untuk kandidat potensial

Talent pipeline tracking


2. Fitur Untuk Manajer Perusahaan (Manager Companies)
   a. Advanced Candidate Filtering and Matching
   Deskripsi: Sistem yang lebih canggih untuk menyaring dan mencocokkan kandidat dengan posisi pekerjaan yang sesuai menggunakan kecerdasan buatan dan analitik.

Cara Kerja: Menyaring kandidat berdasarkan keterampilan, pengalaman, lokasi, dan preferensi lainnya, serta memberikan rekomendasi terbaik untuk manajer perusahaan.

Keuntungan: Mempercepat proses perekrutan dengan mencocokkan kandidat yang paling cocok untuk posisi tertentu.

c. AI-Powered Job Description Generator
Deskripsi: Fitur berbasis AI yang membantu manajer perusahaan membuat deskripsi pekerjaan yang lebih menarik dan relevan dengan mudah.

Cara Kerja: Manajer hanya perlu memasukkan informasi dasar (misalnya, posisi pekerjaan, keterampilan yang dibutuhkan), dan AI akan menghasilkan deskripsi pekerjaan yang lebih komprehensif dan menarik.

Keuntungan: Mempercepat pembuatan posting pekerjaan dengan deskripsi yang lebih menarik, menghemat waktu dan upaya manajer HR.


e. Interview Scheduling Automation
Deskripsi: Sistem otomatis yang mengelola jadwal wawancara dengan kandidat, memungkinkan manajer perusahaan untuk memilih waktu wawancara dan mengirimkan undangan otomatis.

Cara Kerja: Manajer memilih waktu wawancara yang tersedia, dan sistem mengirimkan undangan otomatis ke kandidat, termasuk pengingat wawancara.

Keuntungan: Menghemat waktu dan mengurangi potensi kesalahan dalam penjadwalan wawancara.

Automated Screening Workflows

Tabel screening_criteria dan auto_reject_rules

AI scoring system untuk aplikasi masuk

Custom scoring rubric per lowongan
