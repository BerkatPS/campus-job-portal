<?php

namespace Database\Seeders;

use App\Models\PortfolioItem;
use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PortfolioItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Find the candidate role ID
        $candidateRole = Role::where('name', 'candidate')->first();
        
        if (!$candidateRole) {
            $this->command->info('Candidate role not found. Please run RoleSeeder first.');
            return;
        }

        // Get candidate users
        $candidates = User::where('role_id', $candidateRole->id)
            ->take(10)
            ->get();

        if ($candidates->isEmpty()) {
            $this->command->info('No candidate users found. Please run UserSeeder first.');
            return;
        }

        // All available portfolio types
        $types = array_keys(PortfolioItem::getTypes());
        
        // Media types
        $mediaTypes = array_keys(PortfolioItem::getMediaTypes());
        
        // Sample data for different portfolio types
        $portfolioSamples = [
            'project' => [
                'titles' => [
                    'E-commerce Website', 'Task Management System', 'Mobile Banking App', 
                    'Student Information System', 'AI-powered Chat Application', 'Financial Planning Tool',
                    'Community Forum Platform', 'Inventory Management System', 'Healthcare App'
                ],
                'descriptions' => [
                    'A comprehensive project that demonstrates my abilities in system design, frontend and backend development, and integration of third-party services.',
                    'Built this from concept to completion, handling everything from UX design to database architecture and deployment.',
                    'Collaborated with a team to develop this solution, focusing on efficiency, user experience, and robust architecture.'
                ],
                'organizations' => [
                    'University Project', 'Freelance Client', 'Personal Project', 
                    'Startup Weekend', 'Hackathon', 'Group Assignment'
                ],
                'roles' => [
                    'Developer', 'Project Manager', 'Technical Lead', 
                    'Full-stack Developer', 'UI/UX Designer', 'Product Owner'
                ]
            ],
            'work_experience' => [
                'titles' => [
                    'Software Engineer', 'Web Developer', 'UI/UX Designer', 
                    'Business Analyst', 'Project Manager', 'Marketing Specialist',
                    'HR Consultant', 'Content Writer', 'Data Analyst', 'Social Media Manager'
                ],
                'descriptions' => [
                    'Managed key projects and contributed to significant improvements in processes and systems.',
                    'Collaborated with cross-functional teams to deliver high-quality solutions on time and within budget.',
                    'Drove innovation and implemented new methodologies that enhanced overall productivity and quality.'
                ],
                'organizations' => [
                    'Tech Innovations Inc.', 'Creative Solutions LLC', 'Global Services Corp.', 
                    'Startup Ventures', 'National Bank', 'Healthcare Systems', 
                    'Educational Institute', 'Government Agency', 'Retail Giant'
                ],
                'roles' => [
                    'Team Lead', 'Junior Specialist', 'Senior Consultant', 
                    'Assistant Manager', 'Coordinator', 'Director'
                ]
            ],
            'education' => [
                'titles' => [
                    'Bachelor of Computer Science', 'Master of Business Administration', 
                    'Diploma in Digital Marketing', 'Certificate in Project Management',
                    'Bachelor of Arts in Communication', 'Associate Degree in Graphic Design',
                    'Master of Science in Data Analytics', 'Bachelor of Engineering'
                ],
                'descriptions' => [
                    'Comprehensive education with focus on practical applications and theoretical foundations.',
                    'Graduated with honors, participating in various extracurricular activities and research projects.',
                    'Developed strong analytical and problem-solving skills through rigorous coursework and practical projects.'
                ],
                'organizations' => [
                    'State University', 'Technical Institute', 'International College', 
                    'Business School', 'Online Learning Platform', 'Community College'
                ],
                'roles' => [
                    'Student', 'Research Assistant', 'Teaching Assistant', 
                    'Student Representative', 'Student Researcher', 'Peer Mentor'
                ]
            ],
            'volunteer' => [
                'titles' => [
                    'Community Service Volunteer', 'Environmental Conservation Volunteer', 
                    'Youth Mentor', 'Disaster Relief Volunteer', 'Health Campaign Volunteer',
                    'Education Outreach Volunteer', 'Animal Shelter Assistant'
                ],
                'descriptions' => [
                    'Contributed time and skills to help improve community conditions and support important causes.',
                    'Organized events and initiatives that created positive impact on the local community.',
                    'Provided essential services and support to those in need, developing leadership and communication skills.'
                ],
                'organizations' => [
                    'Local Community Center', 'Red Cross', 'Wildlife Conservation', 
                    'Habitat for Humanity', 'Food Bank', 'Youth Development Program'
                ],
                'roles' => [
                    'Volunteer', 'Coordinator', 'Team Leader', 
                    'Organizer', 'Peer Mentor', 'Campaign Assistant'
                ]
            ],
            'certification' => [
                'titles' => [
                    'AWS Certified Solutions Architect', 'Project Management Professional (PMP)', 
                    'Certified Digital Marketing Specialist', 'Microsoft Office Specialist',
                    'Google Analytics Certification', 'ITIL Foundation Certification',
                    'CompTIA A+ Certification', 'Cisco Certified Network Associate'
                ],
                'descriptions' => [
                    'Completed rigorous training and examination to demonstrate professional expertise in this area.',
                    'Earned industry-recognized credential that validates technical knowledge and skills.',
                    'Pursued this certification to enhance professional capabilities and remain current with industry standards.'
                ],
                'organizations' => [
                    'Microsoft', 'Google', 'Amazon Web Services', 
                    'Project Management Institute', 'Oracle', 'Adobe',
                    'HubSpot', 'Salesforce', 'Cisco'
                ],
                'roles' => [
                    'Certificate Holder', 'Certified Professional', 'Certified Specialist', 
                    'Licensed Practitioner', 'Accredited Professional'
                ]
            ],
            'publication' => [
                'titles' => [
                    'Research Paper on Machine Learning Applications', 'Industry Trend Analysis', 
                    'White Paper on Digital Transformation', 'Case Study of Business Innovation',
                    'Market Research Report', 'Technical Documentation', 'Academic Journal Article'
                ],
                'descriptions' => [
                    'Authored comprehensive research that contributes to the field and demonstrates analytical abilities.',
                    'Published work that showcases expertise, research skills, and ability to communicate complex ideas effectively.',
                    'Collaborated with peers to produce valuable insights and analysis for industry professionals and academics.'
                ],
                'organizations' => [
                    'Academic Journal', 'Industry Magazine', 'Online Publication', 
                    'University Press', 'Research Institute', 'Professional Blog'
                ],
                'roles' => [
                    'Author', 'Co-author', 'Lead Researcher', 
                    'Contributing Writer', 'Editor', 'Research Assistant'
                ]
            ],
            'award' => [
                'titles' => [
                    'Employee of the Month', 'Innovation Award', 'Academic Excellence Award', 
                    'Leadership Recognition', 'Customer Service Award', 'Sales Achievement',
                    'Industry Recognition Award', 'Community Impact Award'
                ],
                'descriptions' => [
                    'Recognized for outstanding performance, dedication, and contribution to organizational success.',
                    'Awarded for demonstrating exceptional skills, innovation, and commitment to excellence.',
                    'Received this honor based on peer recognition and measurable achievements in the field.'
                ],
                'organizations' => [
                    'Employer', 'Industry Association', 'Educational Institution', 
                    'Professional Organization', 'Community Group', 'Government Entity'
                ],
                'roles' => [
                    'Recipient', 'Honoree', 'Award Winner', 
                    'Recognized Professional', 'Team Member'
                ]
            ],
            'creative_work' => [
                'titles' => [
                    'Graphic Design Portfolio', 'Photography Collection', 'Animation Showreel', 
                    'Art Exhibition', 'Music Composition', 'Fashion Design Collection',
                    'Interior Design Project', 'Short Film Production'
                ],
                'descriptions' => [
                    'Created this work to express artistic vision and showcase creative talent and technical skills.',
                    'Developed this creative project from concept to completion, demonstrating both artistic and project management abilities.',
                    'Collaborated with other creatives to produce work that resonates with audiences and meets client objectives.'
                ],
                'organizations' => [
                    'Design Studio', 'Art Gallery', 'Creative Agency', 
                    'Media Production Company', 'Fashion House', 'Independent Platform'
                ],
                'roles' => [
                    'Designer', 'Creator', 'Artist', 
                    'Director', 'Composer', 'Producer'
                ]
            ],
            'open_source' => [
                'titles' => [
                    'Laravel Package for PDF Generation', 'React Component Library', 
                    'CSS Framework for Dark Mode', 'Python Data Analysis Tool',
                    'JavaScript Date Formatter', 'Mobile App Template', 'UI Component Kit'
                ],
                'descriptions' => [
                    'Contributed to the open source community by developing and maintaining this useful tool.',
                    'Created this solution to address common challenges faced by developers in this area.',
                    'Collaborated with the community to improve and extend functionality over time.'
                ],
                'organizations' => [
                    'GitHub', 'Open Source Initiative', 'Personal Project', 
                    'Community Collaboration', 'Hackathon Project', 'Code Camp'
                ],
                'roles' => [
                    'Creator', 'Maintainer', 'Core Contributor', 
                    'Developer', 'Project Lead', 'Collaborator'
                ]
            ],
            'other' => [
                'titles' => [
                    'Personal Blog', 'Podcast Series', 'Workshop Facilitator', 
                    'Online Course Creation', 'Professional Network Building',
                    'Mentorship Program', 'Industry Event Organization'
                ],
                'descriptions' => [
                    'Pursued this initiative to develop additional skills and contribute to professional growth.',
                    'Engaged in this activity to expand knowledge, network, and personal capabilities.',
                    'Dedicated time to this endeavor to round out professional experience and explore new areas.'
                ],
                'organizations' => [
                    'Self-Initiated', 'Professional Group', 'Community Organization', 
                    'Industry Forum', 'Learning Platform', 'Networking Association'
                ],
                'roles' => [
                    'Creator', 'Organizer', 'Participant', 
                    'Facilitator', 'Host', 'Member'
                ]
            ],
            'presentation' => [
                'titles' => [
                    'Industry Conference Talk', 'Workshop Session', 'Webinar Series',
                    'Technology Demonstration', 'Guest Lecture', 'Product Launch Presentation',
                    'Panel Discussion', 'Educational Seminar'
                ],
                'descriptions' => [
                    'Delivered engaging presentation on important topics to industry professionals and peers.',
                    'Shared knowledge and insights through structured presentation with interactive elements.',
                    'Communicated complex concepts in an accessible way to diverse audiences.'
                ],
                'organizations' => [
                    'Industry Conference', 'Professional Association', 'University',
                    'Corporate Event', 'Meetup Group', 'Online Platform',
                    'Training Program', 'Community Event'
                ],
                'roles' => [
                    'Speaker', 'Presenter', 'Panelist',
                    'Workshop Leader', 'Instructor', 'Facilitator',
                    'Keynote Speaker', 'Moderator'
                ]
            ],
            'research' => [
                'titles' => [
                    'Market Analysis Study', 'User Behavior Research', 'Technology Impact Assessment',
                    'Feasibility Study', 'Scientific Investigation', 'Academic Research Project',
                    'Data Analysis Report', 'Trend Forecasting Study'
                ],
                'descriptions' => [
                    'Conducted in-depth research to explore key questions and produce valuable insights.',
                    'Applied rigorous methodology to investigate important phenomena and document findings.',
                    'Collaborated with team to design and implement research project with practical applications.'
                ],
                'organizations' => [
                    'University', 'Research Institute', 'Corporate R&D',
                    'Think Tank', 'Industry Consortium', 'Government Agency',
                    'Independent Research', 'Collaborative Project'
                ],
                'roles' => [
                    'Lead Researcher', 'Research Assistant', 'Principal Investigator',
                    'Data Analyst', 'Research Coordinator', 'Subject Matter Expert',
                    'Research Consultant', 'Team Member'
                ]
            ]
        ];
        
        // Common skills by portfolio type
        $skillsByType = [
            'project' => [
                'Project Management', 'Software Development', 'UI/UX Design', 'Database Design',
                'API Integration', 'System Architecture', 'Quality Assurance', 'User Testing',
                'Requirements Gathering', 'Documentation', 'Agile Methodology'
            ],
            'work_experience' => [
                'Leadership', 'Team Collaboration', 'Client Communication', 'Problem Solving',
                'Time Management', 'Strategic Planning', 'Budgeting', 'Resource Allocation',
                'Performance Analysis', 'Process Improvement', 'Stakeholder Management'
            ],
            'education' => [
                'Research', 'Critical Thinking', 'Academic Writing', 'Data Analysis',
                'Presentation Skills', 'Technical Proficiency', 'Teamwork', 'Time Management',
                'Problem Solving', 'Communication', 'Analytical Skills'
            ],
            'volunteer' => [
                'Organization', 'Communication', 'Leadership', 'Empathy',
                'Time Management', 'Problem Solving', 'Community Outreach', 'Event Planning',
                'Fundraising', 'Public Speaking', 'Team Coordination'
            ],
            'certification' => [
                'Technical Expertise', 'Industry Knowledge', 'Best Practices', 'Methodologies',
                'Tools & Platforms', 'Standards Compliance', 'Professional Development'
            ],
            'publication' => [
                'Research', 'Writing', 'Analysis', 'Data Visualization',
                'Subject Matter Expertise', 'Communication', 'Critical Thinking'
            ],
            'award' => [
                'Excellence', 'Leadership', 'Innovation', 'Performance',
                'Customer Focus', 'Team Contribution', 'Problem Solving'
            ],
            'creative_work' => [
                'Design', 'Creativity', 'Technical Skills', 'Aesthetic Sense',
                'Attention to Detail', 'Conceptualization', 'Project Execution'
            ],
            'open_source' => [
                'Coding', 'Documentation', 'Collaboration', 'Problem Solving',
                'Code Review', 'Testing', 'Version Control', 'Community Engagement'
            ],
            'other' => [
                'Organization', 'Communication', 'Networking', 'Content Creation',
                'Knowledge Sharing', 'Public Speaking', 'Community Building'
            ],
            'presentation' => [
                'Public Speaking', 'Visual Communication', 'Content Development',
                'Audience Engagement', 'Technical Demonstration', 'Storytelling',
                'Slide Design', 'Clear Communication', 'Knowledge Translation'
            ],
            'research' => [
                'Data Analysis', 'Research Methods', 'Critical Thinking',
                'Documentation', 'Literature Review', 'Statistical Analysis',
                'Experimental Design', 'Hypothesis Testing', 'Academic Writing'
            ]
        ];

        // Common achievements by portfolio type
        $achievementsByType = [
            'project' => [
                'Completed project ahead of schedule', 'Reduced system errors by 40%', 
                'Increased user engagement by 25%', 'Implemented new features that increased functionality',
                'Successfully launched on multiple platforms', 'Positive user feedback and reviews'
            ],
            'work_experience' => [
                'Increased team productivity by 30%', 'Reduced costs by 25%', 
                'Managed a team of 10+ professionals', 'Led successful digital transformation initiative',
                'Delivered projects consistently on time and under budget', 'Improved customer satisfaction metrics'
            ],
            'education' => [
                'Dean\'s List recognition', 'GPA of 3.8/4.0', 
                'Recipient of academic scholarship', 'Completed thesis with honors',
                'Selected for competitive research program', 'Published research in student journal'
            ],
            'volunteer' => [
                'Organized events with 100+ participants', 'Raised over $5,000 for charitable causes', 
                'Led a team of 15 volunteers', 'Implemented new program that increased community participation',
                'Recognized for dedicated service', 'Created sustainable volunteer training program'
            ],
            'certification' => [
                'Scored in top 10% of test-takers', 'Completed certification in record time', 
                'Applied learnings to improve work processes', 'Mentored colleagues in certification preparation',
                'Received specialized endorsements', 'Maintained certification through continuing education'
            ],
            'publication' => [
                'Cited by industry professionals', 'Featured in prominent publication', 
                'Presented findings at conference', 'Research led to practical applications',
                'Collaborated with respected professionals in the field', 'Received positive peer reviews'
            ],
            'award' => [
                'Selected from 50+ candidates', 'First recipient in department history', 
                'Recognized for innovative approach', 'Award led to new opportunities',
                'Multiple-time recipient', 'Industry-wide recognition'
            ],
            'creative_work' => [
                'Featured in gallery exhibition', 'Positive critical reception', 
                'Selected for competitive showcase', 'Client satisfaction and repeat business',
                'Social media engagement and reach', 'Professional industry recognition'
            ],
            'open_source' => [
                'Project stars and forks', 'Active community of users', 
                'Contributions accepted to major repositories', 'Positive feedback from community',
                'Growing user adoption', 'Featured in developer resources'
            ],
            'other' => [
                'Growing audience and engagement', 'Positive feedback from participants', 
                'Established new connections and opportunities', 'Knowledge and skill development',
                'Recognition from peers', 'Community building and impact'
            ],
            'presentation' => [
                'Presented to audience of 100+ attendees', 'Received 90%+ positive feedback',
                'Invited for repeat presentations', 'Featured as expert speaker',
                'Generated significant post-event engagement', 'Content shared widely in industry'
            ],
            'research' => [
                'Published findings in respected publication', 'Findings adopted by practitioners',
                'Research cited in subsequent work', 'Secured funding for continued research',
                'Presented at prominent conference', 'Contributed new insights to field'
            ]
        ];

        // Common URLs
        $projectUrls = [
            'https://project-example.com',
            'https://portfolio-demo.com',
            'https://my-work.example.org',
            'https://showcase.example.net',
            null
        ];

        // Repository URLs (mainly for development-related items)
        $repoUrls = [
            'https://github.com/username/project',
            'https://gitlab.com/username/repo',
            'https://bitbucket.org/username/repo',
            null
        ];

        // Media URLs by media type
        $mediaUrlsByType = [
            'image' => [
                'https://example.com/portfolio/image1.jpg',
                'https://example.com/portfolio/image2.jpg',
                null
            ],
            'video' => [
                'https://youtube.com/watch?v=example1',
                'https://vimeo.com/example2',
                null
            ],
            'document' => [
                'https://example.com/portfolio/document1.pdf',
                'https://example.com/portfolio/document2.pdf',
                null
            ],
            'website' => [
                'https://myportfolio.com/project1',
                'https://behance.net/username/project',
                'https://dribbble.com/username/project',
                null
            ],
            'social_media' => [
                'https://linkedin.com/in/username',
                'https://instagram.com/username',
                'https://twitter.com/username',
                null
            ],
            'repository' => [
                'https://github.com/username/repo',
                'https://gitlab.com/username/repo',
                null
            ],
            'other' => [
                'https://example.com/portfolio/other',
                null
            ]
        ];

        // Ensure the thumbnails directory exists
        if (!Storage::disk('public')->exists('thumbnails')) {
            Storage::disk('public')->makeDirectory('thumbnails');
        }

        foreach ($candidates as $index => $candidate) {
            // Generate 3-8 portfolio items for each candidate
            $itemCount = rand(3, 8);
            
            for ($i = 0; $i < $itemCount; $i++) {
                // Select a random type
                $type = $types[array_rand($types)];
                
                // Get samples for this type
                $typeSamples = $portfolioSamples[$type];
                
                // Select a title
                $title = $typeSamples['titles'][array_rand($typeSamples['titles'])];
                
                // Make title unique
                $title = $title . ' ' . Str::random(2);
                
                // Select description, role, organization
                $description = $typeSamples['descriptions'][array_rand($typeSamples['descriptions'])];
                $role = $typeSamples['roles'][array_rand($typeSamples['roles'])];
                $organization = $typeSamples['organizations'][array_rand($typeSamples['organizations'])];
                
                // Select random skills (3-6)
                $skillPool = $skillsByType[$type];
                $skillCount = min(count($skillPool), rand(3, 6));
                $skills = array_slice($skillPool, 0, $skillCount);
                shuffle($skills);
                
                // Select random achievements (2-4)
                $achievementPool = $achievementsByType[$type];
                $achievementCount = min(count($achievementPool), rand(2, 4));
                $achievements = array_slice($achievementPool, 0, $achievementCount);
                shuffle($achievements);
                
                // Select media type and URL
                $mediaType = $mediaTypes[array_rand($mediaTypes)];
                $mediaUrl = $mediaUrlsByType[$mediaType][array_rand($mediaUrlsByType[$mediaType])];
                
                // Set project and repository URLs
                $projectUrl = $projectUrls[array_rand($projectUrls)];
                $repositoryUrl = null;
                
                // Only include repository URLs for developer-focused types
                if (in_array($type, ['project', 'open_source'])) {
                    $repositoryUrl = $repoUrls[array_rand($repoUrls)];
                }
                
                // Create portfolio item
                PortfolioItem::create([
                    'user_id' => $candidate->id,
                    'title' => $title,
                    'description' => $description,
                    'project_url' => $projectUrl,
                    'repository_url' => $repositoryUrl,
                    'thumbnail' => null, // We can't easily generate real images in a seeder
                    'start_date' => now()->subMonths(rand(1, 24)),
                    'end_date' => rand(0, 1) ? now()->subMonths(rand(0, 12)) : null, // 50% chance of being completed
                    'type' => $type,
                    'is_featured' => rand(0, 3) === 0, // 25% chance of being featured
                    'display_order' => $i,
                    'role' => $role,
                    'organization' => $organization,
                    'skills' => $skills,
                    'achievements' => $achievements,
                    'media_type' => $mediaType,
                    'media_url' => $mediaUrl,
                ]);
            }
        }

        $this->command->info('Created diverse portfolio items for ' . count($candidates) . ' candidates.');
    }
}
