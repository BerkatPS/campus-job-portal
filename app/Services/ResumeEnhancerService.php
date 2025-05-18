<?php

namespace App\Services;

use App\Models\ResumeEnhancement;
use App\Models\ResumeVersion;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

class ResumeEnhancerService
{
    protected $guzzle;
    protected $openrouterApiKey;

    /**
     * Create a new service instance.
     */
    public function __construct()
    {
        // Set longer timeout values for Guzzle client to prevent timeout issues
        $this->guzzle = new Client([
            'timeout' => 120, // 2 minute timeout for the entire request
            'connect_timeout' => 30, // 30 second timeout for the connection
        ]);
        $this->openrouterApiKey = config('services.openrouter.api_key');
    }

    /**
     * Analyze resume content and provide enhancement suggestions.
     *
     * @param ResumeVersion $resumeVersion
     * @return ResumeEnhancement
     */
    public function enhanceResume(ResumeVersion $resumeVersion): ResumeEnhancement
    {
        // Create a new enhancement record
        $enhancement = ResumeEnhancement::create([
            'user_id' => $resumeVersion->user_id,
            'resume_version_id' => $resumeVersion->id,
            'original_content' => $resumeVersion->content,
            'status' => 'processing',
        ]);

        try {
            // Increase PHP script timeout for this operation
            set_time_limit(300); // 5 minutes

            // Analyze with OpenRouter using DeepSeek model
            $result = $this->analyzeWithOpenRouter($resumeVersion->content);

            // Update enhancement with results
            $enhancement->update([
                'enhanced_content' => $result['enhanced_content'] ?? $resumeVersion->content,
                'enhancement_suggestions' => $result['enhancement_suggestions'] ?? json_encode([['suggestion' => 'Tidak ada saran yang tersedia saat ini.']]),
                'keyword_analysis' => $result['keyword_analysis'] ?? json_encode([['keyword' => 'Tidak ada analisis kata kunci.']]),
                'format_suggestions' => $result['format_suggestions'] ?? json_encode([['suggestion' => 'Tidak ada saran format.']]),
                'skill_suggestions' => $result['skill_suggestions'] ?? json_encode([['skill' => 'Tidak ada saran keterampilan.']]),
                'overall_feedback' => $result['overall_feedback'] ?? 'Tidak ada umpan balik yang tersedia saat ini.',
                'score' => $result['score'] ?? 5,
                'status' => 'completed',
                'processed_at' => now(),
            ]);

        } catch (\Exception $e) {
            Log::error('Resume enhancement failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'resume_version_id' => $resumeVersion->id
            ]);

            // Create default structure for a failed enhancement
            $enhancement->update([
                'status' => 'failed',
                'enhanced_content' => $resumeVersion->content,
                'enhancement_suggestions' => json_encode([['suggestion' => 'Gagal menganalisis resume. Silakan coba lagi nanti.']]),
                'keyword_analysis' => json_encode([['keyword' => 'Analisis tidak tersedia karena error.']]),
                'format_suggestions' => json_encode([['suggestion' => 'Saran format tidak tersedia karena error.']]),
                'skill_suggestions' => json_encode([['skill' => 'Saran keterampilan tidak tersedia karena error.']]),
                'overall_feedback' => 'Terjadi kesalahan saat menganalisis resume Anda: ' . $e->getMessage(),
                'score' => 0,
                'processed_at' => now(),
            ]);
        }

        return $enhancement;
    }

    /**
     * Analyze resume content using OpenRouter API with DeepSeek model.
     *
     * @param string $content
     * @return array
     * @throws \Exception
     */
    protected function analyzeWithOpenRouter(string $content): array
    {
        try {
            if (empty($this->openrouterApiKey)) {
                throw new \Exception('OpenRouter API key is not configured');
            }

            // Log start of API request
            Log::info('Starting OpenRouter API request', ['content_length' => strlen($content)]);

            $promptText = "Silakan analisis resume ini secara mendalam dan berikan umpan balik terperinci berdasarkan kategori-kategori berikut. Jawaban Anda harus dalam format JSON, mencakup seluruh informasi yang ditentukan. Analisis harus SANGAT PROFESIONAL, MENDALAM, KOMPREHENSIF, dan DETAIL. Semua konten jawaban HARUS dalam Bahasa Indonesia yang formal dan profesional, namun kunci JSON tetap dalam Bahasa Inggris.

Enhanced Content:

Berikan versi yang ditingkatkan dari konten resume dengan Bahasa Indonesia yang formal dan profesional. Fokus pada membuat teks lebih profesional, padat, berdampak, dan sangat relevan dengan pasar kerja Indonesia. Perbaiki bagian-bagian yang berlebihan dan ubah kata-kata untuk terdengar lebih profesional sambil mempertahankan makna aslinya. Tambahkan frasa profesional yang umum digunakan di industri yang relevan dan hilangkan bahasa yang terlalu kasual.

Enhancement Suggestions:

Identifikasi MINIMAL 5-7 area spesifik di mana konten resume dapat diperbaiki secara profesional. Setiap saran harus sangat spesifik, terperinci, dan langsung dapat diterapkan. Elaborasi secara detail untuk setiap saran dengan contoh konkret bagaimana kandidat dapat mengimplementasikan saran tersebut. Gunakan Bahasa Indonesia yang profesional dan formal dengan terminologi industri yang tepat.

Keyword Analysis:

Identifikasi MINIMAL 7-10 istilah industri utama dan kata kunci ATS (Applicant Tracking System) yang ada dalam resume maupun yang seharusnya ditambahkan. Jelaskan MENGAPA kata kunci tersebut penting dalam konteks industri yang sesuai. Sertakan istilah teknis terbaru, sertifikasi relevan, dan jargon industri yang umum dicari oleh rekruter. Semua penjelasan harus dalam Bahasa Indonesia yang profesional dengan mempertahankan istilah teknis yang standar.

Format Suggestions:

Berikan MINIMAL 4-6 saran terperinci mengenai format dan tata letak resume. Evaluasi secara kritis struktur, hirarki informasi, penggunaan whitespace, tipografi, dan konsistensi visual. Jelaskan bagaimana perubahan format dapat meningkatkan keterbacaan dan membuat resume lebih menonjol di mata rekruter Indonesia. Saran harus konkret, dapat ditindaklanjuti, dan dijelaskan dengan Bahasa Indonesia yang formal dan profesional.

Skill Suggestions:

Sarankan MINIMAL 6-8 keterampilan tambahan yang spesifik dan relevan dengan industri target. Keterampilan harus mencakup kombinasi keterampilan teknis (hard skills) dan interpersonal (soft skills) yang saat ini dicari oleh perusahaan di Indonesia. Jelaskan MENGAPA keterampilan tersebut penting dan bagaimana kandidat dapat membuktikan atau meningkatkan keterampilan tersebut. Semua penjelasan harus dalam Bahasa Indonesia yang profesional.

Overall Feedback:

Berikan analisis komprehensif dan mendalam tentang resume secara keseluruhan dengan minimum 150-200 kata. Evaluasi kesesuaian dengan standar industri di Indonesia, kejelasan pesan, dan dampak potensial terhadap keputusan rekrutmen. Tawarkan perspektif rekruter profesional dan berikan peta jalan yang jelas untuk perbaikan. Gunakan Bahasa Indonesia yang sangat profesional dengan struktur yang terorganisir dengan baik.

Score:

Berikan skor numerik dari 0 hingga 10 dengan presisi satu angka desimal berdasarkan kualitas keseluruhan resume. Skor ini harus mencerminkan seberapa kompetitif resume tersebut di pasar kerja Indonesia yang relevan, dengan mempertimbangkan standar industri saat ini. Jelaskan secara singkat alasan pemberian skor tersebut.

HARUS mengembalikan respon dalam format JSON seperti berikut:
{
  \"enhanced_content\": \"Isi resume yang sudah ditingkatkan dengan bahasa profesional\",
  \"enhancement_suggestions\": [{\"suggestion\": \"Saran profesional dan terperinci 1\"}, {\"suggestion\": \"Saran profesional dan terperinci 2\"}],
  \"keyword_analysis\": [{\"keyword\": \"Kata kunci profesional 1\"}, {\"keyword\": \"Kata kunci profesional 2\"}],
  \"format_suggestions\": [{\"suggestion\": \"Saran format profesional 1\"}, {\"suggestion\": \"Saran format profesional 2\"}],
  \"skill_suggestions\": [{\"skill\": \"Keterampilan profesional 1\"}, {\"skill\": \"Keterampilan profesional 2\"}],
  \"overall_feedback\": \"Umpan balik profesional dan komprehensif tentang resume\",
  \"score\": 7.5
}

Berikut adalah resume yang perlu dianalisis:

$content";

            // Make the API request
            $response = $this->guzzle->post('https://openrouter.ai/api/v1/chat/completions', [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer ' . $this->openrouterApiKey,
                    'HTTP-Referer' => config('app.url'), // Required by OpenRouter
                    'X-Title' => 'Campus Job Portal Resume Enhancer', // Optional but recommended
                ],
                'json' => [
                    'model' => 'deepseek/deepseek-r1:free',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'Anda adalah pakar analisis resume dan penasihat karir profesional dengan pengalaman lebih dari 15 tahun di bidang rekrutmen dan pengembangan karir di Indonesia. Tugas Anda adalah memberikan analisis mendalam dan saran peningkatan yang sangat profesional untuk resume yang dikirimkan. Respon Anda harus sangat terperinci, spesifik, dan langsung dapat diterapkan, menggunakan Bahasa Indonesia profesional yang kaya dengan terminologi industri yang relevan. Format respons Anda HARUS berupa objek JSON yang valid dengan kunci dalam Bahasa Inggris tetapi nilai/konten dalam Bahasa Indonesia profesional. Jangan tambahkan kunci baru di luar yang diminta dan pastikan respons sangat terstruktur sesuai format yang diminta.'
                        ],
                        [
                            'role' => 'user',
                            'content' => $promptText
                        ]
                    ],
                    'temperature' => 0.7,
                    'max_tokens' => 4000,
                    'response_format' => ['type' => 'json_object'],
                ]
            ]);

            $responseBody = json_decode($response->getBody()->getContents(), true);

            // Log the API response for debugging
            Log::info('OpenRouter API response received', [
                'has_choices' => isset($responseBody['choices']),
                'response_size' => strlen(json_encode($responseBody))
            ]);

            if (!isset($responseBody['choices'][0]['message']['content'])) {
                throw new \Exception('Invalid response format from OpenRouter API: Missing expected fields');
            }

            // Get the raw response content
            $rawContent = $responseBody['choices'][0]['message']['content'];
            Log::debug('OpenRouter raw content', ['content' => $rawContent]);

            // First try direct JSON parsing
            $result = json_decode($rawContent, true);

            // If that fails, try to handle non-JSON responses
            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::warning('JSON parsing error: ' . json_last_error_msg());

                // Try to extract JSON if it's wrapped in markdown code blocks
                if (preg_match('/```(?:json)?\s*([\s\S]*?)\s*```/m', $rawContent, $matches)) {
                    $jsonContent = $matches[1];
                    Log::info('Extracted JSON from code block', ['content' => $jsonContent]);
                    $result = json_decode($jsonContent, true);
                }

                // If we still don't have valid JSON, create a structured response with the raw text
                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::warning('Failed to parse as JSON after code block extraction: ' . json_last_error_msg());
                    Log::warning('Creating structured fallback response');

                    // Parse the content to extract sections if possible
                    $lines = explode("\n", $rawContent);
                    $enhancedContent = '';
                    $suggestions = [];
                    $keywords = [];
                    $formatSuggestions = [];
                    $skillSuggestions = [];
                    $overallFeedback = '';
                    $score = 5;

                    // Try to extract sections based on common headings
                    $currentSection = '';
                    foreach ($lines as $line) {
                        $line = trim($line);
                        if (empty($line)) continue;

                        if (stripos($line, 'enhanced') !== false && stripos($line, 'content') !== false) {
                            $currentSection = 'enhanced_content';
                            continue;
                        } elseif (stripos($line, 'suggestion') !== false && stripos($line, 'enhancement') !== false) {
                            $currentSection = 'enhancement_suggestions';
                            continue;
                        } elseif (stripos($line, 'keyword') !== false) {
                            $currentSection = 'keyword_analysis';
                            continue;
                        } elseif (stripos($line, 'format') !== false) {
                            $currentSection = 'format_suggestions';
                            continue;
                        } elseif (stripos($line, 'skill') !== false) {
                            $currentSection = 'skill_suggestions';
                            continue;
                        } elseif (stripos($line, 'feedback') !== false || stripos($line, 'overall') !== false) {
                            $currentSection = 'overall_feedback';
                            continue;
                        } elseif (stripos($line, 'score') !== false) {
                            if (preg_match('/(\d+(\.\d+)?)/', $line, $matches)) {
                                $score = min(10, max(0, (float)$matches[1]));
                                Log::info('Extracted score: ' . $score);
                            }
                            continue;
                        }

                        // Add content to the appropriate section
                        if ($currentSection === 'enhanced_content') {
                            $enhancedContent .= $line . "\n";
                        } elseif ($currentSection === 'enhancement_suggestions') {
                            if (strpos($line, '-') === 0 || strpos($line, '*') === 0) {
                                $suggestions[] = ['suggestion' => trim(substr($line, 1))];
                            } else {
                                $suggestions[] = ['suggestion' => $line];
                            }
                        } elseif ($currentSection === 'keyword_analysis') {
                            if (strpos($line, '-') === 0 || strpos($line, '*') === 0) {
                                $keywords[] = ['keyword' => trim(substr($line, 1))];
                            } else {
                                $keywords[] = ['keyword' => $line];
                            }
                        } elseif ($currentSection === 'format_suggestions') {
                            if (strpos($line, '-') === 0 || strpos($line, '*') === 0) {
                                $formatSuggestions[] = ['suggestion' => trim(substr($line, 1))];
                            } else {
                                $formatSuggestions[] = ['suggestion' => $line];
                            }
                        } elseif ($currentSection === 'skill_suggestions') {
                            if (strpos($line, '-') === 0 || strpos($line, '*') === 0) {
                                $skillSuggestions[] = ['skill' => trim(substr($line, 1))];
                            } else {
                                $skillSuggestions[] = ['skill' => $line];
                            }
                        } elseif ($currentSection === 'overall_feedback') {
                            $overallFeedback .= $line . "\n";
                        }
                    }

                    // If we couldn't extract structured content, create a simple fallback
                    if (empty($enhancedContent) && empty($suggestions) && empty($keywords) &&
                        empty($formatSuggestions) && empty($skillSuggestions) && empty($overallFeedback)) {

                        Log::warning('Could not extract structured content, using raw response');

                        // Create an example structure based on the raw content
                        $result = [
                            'enhanced_content' => $content, // Use original content as fallback
                            'enhancement_suggestions' => [
                                ['suggestion' => 'AI memberikan respons tidak terstruktur. Lihat umpan balik keseluruhan.']
                            ],
                            'keyword_analysis' => [
                                ['keyword' => 'Tidak tersedia dalam format terstruktur']
                            ],
                            'format_suggestions' => [
                                ['suggestion' => 'Tidak tersedia dalam format terstruktur']
                            ],
                            'skill_suggestions' => [
                                ['skill' => 'Tidak tersedia dalam format terstruktur']
                            ],
                            'overall_feedback' => "AI memberikan respons tidak terstruktur. Berikut adalah respons lengkap:\n\n" . $rawContent,
                            'score' => 5 // Default middle score
                        ];
                    } else {
                        // Create a structured result from the extracted sections
                        $result = [
                            'enhanced_content' => !empty($enhancedContent) ? $enhancedContent : $content,
                            'enhancement_suggestions' => !empty($suggestions) ? $suggestions : [['suggestion' => 'Tidak ada saran peningkatan yang terstruktur.']],
                            'keyword_analysis' => !empty($keywords) ? $keywords : [['keyword' => 'Tidak tersedia dalam format terstruktur']],
                            'format_suggestions' => !empty($formatSuggestions) ? $formatSuggestions : [['suggestion' => 'Tidak tersedia dalam format terstruktur']],
                            'skill_suggestions' => !empty($skillSuggestions) ? $skillSuggestions : [['skill' => 'Tidak tersedia dalam format terstruktur']],
                            'overall_feedback' => !empty($overallFeedback) ? $overallFeedback : "AI memberikan respons tidak terstruktur. Berikut adalah respons lengkap:\n\n" . $rawContent,
                            'score' => $score
                        ];
                    }
                }
            }

            // Ensure all fields are present with proper defaults
            if (!isset($result['enhanced_content']) || empty($result['enhanced_content'])) {
                $result['enhanced_content'] = $content;
            }

            // Convert non-array fields to arrays if needed
            foreach (['enhancement_suggestions', 'keyword_analysis', 'format_suggestions', 'skill_suggestions'] as $field) {
                if (!isset($result[$field])) {
                    $result[$field] = [['suggestion' => 'Tidak ada data yang tersedia.']];
                } else if (!is_array($result[$field])) {
                    // If field exists but isn't an array, convert it
                    $result[$field] = [['suggestion' => $result[$field]]];
                }
            }

            if (!isset($result['overall_feedback']) || empty($result['overall_feedback'])) {
                $result['overall_feedback'] = 'Tidak ada umpan balik keseluruhan yang tersedia.';
            }

            if (!isset($result['score'])) {
                $result['score'] = 5;
            }

            // Ensure all expected fields are present with proper JSON encoding
            return [
                'enhanced_content' => $result['enhanced_content'],
                'enhancement_suggestions' => is_string($result['enhancement_suggestions']) ? $result['enhancement_suggestions'] : json_encode($result['enhancement_suggestions']),
                'keyword_analysis' => is_string($result['keyword_analysis']) ? $result['keyword_analysis'] : json_encode($result['keyword_analysis']),
                'format_suggestions' => is_string($result['format_suggestions']) ? $result['format_suggestions'] : json_encode($result['format_suggestions']),
                'skill_suggestions' => is_string($result['skill_suggestions']) ? $result['skill_suggestions'] : json_encode($result['skill_suggestions']),
                'overall_feedback' => $result['overall_feedback'],
                'score' => is_numeric($result['score']) ? $result['score'] : 5,
            ];
        } catch (GuzzleException $e) {
            Log::error('OpenRouter API request failed: ' . $e->getMessage(), [
                'exception_class' => get_class($e),
                'code' => $e->getCode(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('Failed to communicate with OpenRouter API: ' . $e->getMessage());
        } catch (\Exception $e) {
            Log::error('OpenRouter processing failed: ' . $e->getMessage(), [
                'exception_class' => get_class($e),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Generate a text summary of the enhancement suggestions.
     *
     * @param ResumeEnhancement $enhancement
     * @return string
     */
    public function getSummary(ResumeEnhancement $enhancement): string
    {
        if ($enhancement->status !== 'completed') {
            return 'Analysis not completed yet.';
        }

        return $enhancement->overall_feedback ?? 'No feedback available.';
    }
}
