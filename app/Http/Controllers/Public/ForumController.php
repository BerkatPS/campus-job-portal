<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ForumCategory;
use App\Models\ForumTopic;
use App\Models\ForumPost;
use App\Models\ForumLike;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Redirect;

class ForumController extends Controller
{
    /**
     * Menampilkan halaman utama forum
     */
    public function index()
    {
        // Cek akses forum
        if (!Auth::check()) {
            return Redirect::route('login')->with('message', 'Anda harus login untuk mengakses forum.');
        }
        
        if (!Auth::user()->isCandidate()) {
            return Redirect::route('public.home')->with('error', 'Hanya mahasiswa yang dapat mengakses forum.');
        }
        
        $categories = ForumCategory::withCount('topics')
                        ->with(['latestTopic' => function($query) {
                            $query->with('user')->latest();
                        }])
                        ->get();
                        
        $popularTopics = ForumTopic::withCount(['posts', 'likes'])
                        ->with('user')
                        ->orderBy('posts_count', 'desc')
                        ->take(5)
                        ->get();
        
        $recentTopics = ForumTopic::with(['user', 'latestPost.user'])
                        ->latest()
                        ->take(10)
                        ->get();
                        
        return Inertia::render('Public/Forum/Index', [
            'categories' => $categories,
            'popularTopics' => $popularTopics,
            'recentTopics' => $recentTopics,
        ]);
    }
    
    /**
     * Menampilkan topik berdasarkan kategori
     */
    public function category(ForumCategory $category)
    {
        // Cek akses forum
        if (!Auth::check()) {
            return Redirect::route('login')->with('message', 'Anda harus login untuk mengakses forum.');
        }
        
        if (!Auth::user()->isCandidate()) {
            return Redirect::route('public.home')->with('error', 'Hanya mahasiswa yang dapat mengakses forum.');
        }
        
        $topics = ForumTopic::where('forum_category_id', $category->id)
                    ->withCount(['posts', 'likes'])
                    ->with(['user', 'latestPost.user'])
                    ->orderBy('updated_at', 'desc')
                    ->paginate(20);
                    
        return Inertia::render('Public/Forum/Category', [
            'category' => $category,
            'topics' => $topics,
        ]);
    }
    
    /**
     * Menampilkan detail dari sebuah topik
     */
    public function topic(ForumTopic $topic)
    {
        // Cek akses forum
        if (!Auth::check()) {
            return Redirect::route('login')->with('message', 'Anda harus login untuk mengakses forum.');
        }
        
        if (!Auth::user()->isCandidate()) {
            return Redirect::route('public.home')->with('error', 'Hanya mahasiswa yang dapat mengakses forum.');
        }
        
        $topic->load('user', 'category');
        $topic->increment('views');
        
        $posts = ForumPost::where('forum_topic_id', $topic->id)
                    ->with(['user.candidateProfile', 'likes'])
                    ->withCount(['likes'])
                    ->orderBy('created_at', 'asc')
                    ->paginate(15);
                    
        // Tambahkan informasi like oleh user saat ini
        $userLikes = $posts->pluck('likes')->flatten()->where('user_id', Auth::id())->pluck('forum_post_id')->toArray();
        
        return Inertia::render('Public/Forum/Topic', [
            'topic' => $topic,
            'posts' => $posts,
            'userLikes' => $userLikes,
        ]);
    }
    
    /**
     * Menyimpan topik baru
     */
    public function storeTopic(Request $request)
    {
        // Cek akses forum
        if (!Auth::check()) {
            return Redirect::route('login')->with('message', 'Anda harus login untuk mengakses forum.');
        }
        
        if (!Auth::user()->isCandidate()) {
            return Redirect::route('public.home')->with('error', 'Hanya mahasiswa yang dapat mengakses forum.');
        }
        
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|min:5|max:100',
            'content' => 'required|string|min:10',
            'category_id' => 'required|exists:forum_categories,id',
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        $topic = ForumTopic::create([
            'title' => $request->title,
            'slug' => \Str::slug($request->title) . '-' . \Str::random(5),
            'forum_category_id' => $request->category_id,
            'user_id' => Auth::id(),
            'views' => 0,
        ]);
        
        // Buat post pertama dengan is_first_post = true
        ForumPost::create([
            'content' => $request->content,
            'forum_topic_id' => $topic->id,
            'user_id' => Auth::id(),
            'is_first_post' => true,
        ]);
        
        return redirect()->route('public.forum.topic', $topic->slug)
                ->with('success', 'Topik baru berhasil dibuat!');
    }
    
    /**
     * Menyimpan postingan/komentar baru
     */
    public function storePost(Request $request)
    {
        // Cek akses forum
        if (!Auth::check()) {
            return Redirect::route('login')->with('message', 'Anda harus login untuk mengakses forum.');
        }
        
        if (!Auth::user()->isCandidate()) {
            return Redirect::route('public.home')->with('error', 'Hanya mahasiswa yang dapat mengakses forum.');
        }
        
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|min:2',
            'topic_id' => 'required|exists:forum_topics,id',
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        $post = ForumPost::create([
            'content' => $request->content,
            'forum_topic_id' => $request->topic_id,
            'user_id' => Auth::id(),
            'is_first_post' => false,
        ]);
        
        // Update topic updated_at
        $topic = ForumTopic::findOrFail($request->topic_id);
        $topic->touch();
        
        return redirect()->back()->with('success', 'Komentar berhasil ditambahkan!');
    }
    
    /**
     * Toggle like pada postingan
     */
    public function toggleLike(ForumPost $post)
    {
        // Cek akses forum
        if (!Auth::check()) {
            return Redirect::route('login')->with('message', 'Anda harus login untuk mengakses forum.');
        }
        
        if (!Auth::user()->isCandidate()) {
            return Redirect::route('public.home')->with('error', 'Hanya mahasiswa yang dapat mengakses forum.');
        }
        
        $userId = Auth::id();
        
        $like = ForumLike::where('forum_post_id', $post->id)
                    ->where('user_id', $userId)
                    ->first();
                    
        if ($like) {
            // Jika sudah like, hapus like
            $like->delete();
            $message = 'Like dibatalkan';
        } else {
            // Jika belum like, tambahkan like
            ForumLike::create([
                'forum_post_id' => $post->id,
                'user_id' => $userId,
            ]);
            $message = 'Postingan disukai';
        }
        
        return redirect()->back()->with('success', $message);
    }
} 