
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  likes: number;
}

export interface Comment {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  post_id: string;
}

interface PostState {
  posts: Post[];
  comments: { [postId: string]: Comment[] };
  loading: boolean;
  createPost: (postData: { title: string; content: string }) => Promise<{ error?: string }>;
  fetchPosts: () => Promise<void>;
  fetchComments: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<{ error?: string }>;
  toggleLike: (postId: string) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  comments: {},
  loading: true,
  
  fetchPosts: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }
      
      set({ posts: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({ loading: false });
    }
  },
  
  createPost: async (postData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: 'You must be logged in to create a post' };
      }
      
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: postData.title.trim(),
            content: postData.content.trim(),
            author_id: user.id,
            author_name: user.user_metadata?.name || user.email || 'Anonymous',
          },
        ])
        .select()
        .single();
      
      if (error) {
        return { error: error.message };
      }
      
      // Add the new post to the current state
      const currentPosts = get().posts;
      set({ posts: [data, ...currentPosts] });
      
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  },
  
  fetchComments: async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }
      
      const currentComments = get().comments;
      set({ 
        comments: { 
          ...currentComments, 
          [postId]: data || [] 
        } 
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  },
  
  addComment: async (postId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: 'You must be logged in to comment' };
      }
      
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            content: content.trim(),
            post_id: postId,
            author_id: user.id,
            author_name: user.user_metadata?.name || user.email || 'Anonymous',
          },
        ])
        .select()
        .single();
      
      if (error) {
        return { error: error.message };
      }
      
      // Add the new comment to the current state
      const currentComments = get().comments;
      const postComments = currentComments[postId] || [];
      set({ 
        comments: { 
          ...currentComments, 
          [postId]: [data, ...postComments] 
        } 
      });
      
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  },
  
  toggleLike: async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return;
      }
      
      // This is a simplified like system - in production you'd want a separate likes table
      const currentPosts = get().posts;
      const postIndex = currentPosts.findIndex(p => p.id === postId);
      
      if (postIndex === -1) return;
      
      const updatedPosts = [...currentPosts];
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        likes: updatedPosts[postIndex].likes + 1
      };
      
      set({ posts: updatedPosts });
      
      // Update in database
      await supabase
        .from('posts')
        .update({ likes: updatedPosts[postIndex].likes })
        .eq('id', postId);
        
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }
}));
