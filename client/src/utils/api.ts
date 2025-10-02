import { fetchAuthSession } from 'aws-amplify/auth';
import { supabase } from '../supabaseClient';
import { UserProfile } from '../types';

// Helper to get current user ID
async function getCurrentUserId(): Promise<string> {
  const session = await fetchAuthSession();
  const userId = session.tokens?.idToken?.payload?.sub as string;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  return userId;
}

// Check if Supabase is available
async function isSupabaseAvailable(): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    return !error || error.code !== 'PGRST205'; // PGRST205 = table not found
  } catch {
    return false;
  }
}

// LocalStorage fallback for profiles
const localStorageAPI = {
  async getProfile(): Promise<{ data: UserProfile }> {
    const session = await fetchAuthSession();
    const userId = session.tokens?.idToken?.payload?.sub as string;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const profileKey = `mappm_profile_${userId}`;
    const storedProfile = localStorage.getItem(profileKey);

    if (!storedProfile) {
      throw { response: { status: 404 } };
    }

    return { data: JSON.parse(storedProfile) };
  },

  async updateProfile(profileData: any): Promise<{ data: UserProfile }> {
    const session = await fetchAuthSession();
    const userId = session.tokens?.idToken?.payload?.sub as string;
    const userEmail = session.tokens?.idToken?.payload?.email as string;
    const userName = session.tokens?.idToken?.payload?.name as string;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const profile: UserProfile = {
      id: userId,
      cognitoId: userId,
      email: userEmail || '',
      name: profileData.name || userName || '',
      avatar: profileData.avatar || '',
      status: profileData.status,
      experience: profileData.experience,
      pmFocus: profileData.pmFocus || [],
      industry: profileData.industry || [],
      companyStage: profileData.companyStage || [],
      skills: profileData.skills || [],
      interests: profileData.interests || [],
      location: profileData.location,
      privacy: profileData.privacy,
      isProfileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const profileKey = `mappm_profile_${userId}`;
    localStorage.setItem(profileKey, JSON.stringify(profile));

    return { data: profile };
  }
};

// User API calls with Supabase fallback to localStorage
export const userAPI = {
  async getProfile(): Promise<{ data: UserProfile }> {
    if (await isSupabaseAvailable()) {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('cognito_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw { response: { status: 404 } };
        }
        throw error;
      }

      return { data };
    } else {
      return localStorageAPI.getProfile();
    }
  },

  async updateProfile(profileData: any): Promise<{ data: UserProfile }> {
    if (await isSupabaseAvailable()) {
      const session = await fetchAuthSession();
      const userId = session.tokens?.idToken?.payload?.sub as string;
      const userEmail = session.tokens?.idToken?.payload?.email as string;
      const userName = session.tokens?.idToken?.payload?.name as string;

      const profile = {
        cognito_id: userId,
        email: userEmail || '',
        name: profileData.name || userName || '',
        avatar: profileData.avatar || '',
        status: profileData.status,
        experience: profileData.experience,
        pm_focus: profileData.pmFocus || [],
        industry: profileData.industry || [],
        company_stage: profileData.companyStage || [],
        skills: profileData.skills || [],
        interests: profileData.interests || [],
        location: profileData.location,
        privacy: profileData.privacy,
        is_profile_complete: true,
        updated_at: new Date().toISOString()
      };

      // Try to update existing profile first
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('cognito_id', userId)
        .single();

      let data, error;

      if (existing) {
        // Update existing profile
        const result = await supabase
          .from('users')
          .update(profile)
          .eq('cognito_id', userId)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        // Insert new profile
        const result = await supabase
          .from('users')
          .insert(profile)
          .select()
          .single();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      return { data };
    } else {
      return localStorageAPI.updateProfile(profileData);
    }
  },

  async searchUsers(params: any): Promise<{ data: UserProfile[] }> {
    let query = supabase.from('users').select('*');

    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { data: data || [] };
  },

  async getMapUsers(_params?: any): Promise<{ data: UserProfile[] }> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_profile_complete', true)
      .not('location', 'is', null);

    if (error) throw error;

    return { data: data || [] };
  },

  async getUserById(id: string): Promise<{ data: UserProfile }> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { data };
  },
};

// Forum API calls using Supabase
export const forumAPI = {
  async getPosts(params?: any): Promise<{ data: any[] }> {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data: data || [] };
  },

  async createPost(postData: any): Promise<{ data: any }> {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        author_id: userId,
        title: postData.title,
        content: postData.content,
        category: postData.category,
        tags: postData.tags || []
      })
      .select()
      .single();

    if (error) throw error;

    return { data };
  },

  async getPost(id: string): Promise<{ data: any }> {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*, forum_comments(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { data };
  },

  async updatePost(id: string, postData: any): Promise<{ data: any }> {
    const { data, error } = await supabase
      .from('forum_posts')
      .update({
        title: postData.title,
        content: postData.content
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { data };
  },

  async deletePost(id: string): Promise<{ data: any }> {
    const { error } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { data: { success: true } };
  },

  async addComment(postId: string, commentData: any): Promise<{ data: any }> {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('forum_comments')
      .insert({
        post_id: postId,
        author_id: userId,
        content: commentData.content
      })
      .select()
      .single();

    if (error) throw error;

    return { data };
  },

  async upvotePost(postId: string): Promise<{ data: any }> {
    // Increment upvotes
    const { data, error } = await supabase.rpc('increment', {
      table_name: 'forum_posts',
      row_id: postId,
      column_name: 'upvotes'
    });

    if (error) {
      // Fallback: fetch, increment, update
      const { data: post } = await supabase
        .from('forum_posts')
        .select('upvotes')
        .eq('id', postId)
        .single();

      if (post) {
        await supabase
          .from('forum_posts')
          .update({ upvotes: (post.upvotes || 0) + 1 })
          .eq('id', postId);
      }
    }

    return { data: { success: true } };
  },

  async downvotePost(postId: string): Promise<{ data: any }> {
    // Increment downvotes
    const { data: post } = await supabase
      .from('forum_posts')
      .select('downvotes')
      .eq('id', postId)
      .single();

    if (post) {
      await supabase
        .from('forum_posts')
        .update({ downvotes: (post.downvotes || 0) + 1 })
        .eq('id', postId);
    }

    return { data: { success: true } };
  },

  async getUserPosts(): Promise<{ data: any[] }> {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data: data || [] };
  },
};

// Resource API calls (placeholder - implement based on your schema)
export const resourceAPI = {
  async getResources(_params?: any): Promise<{ data: any[] }> {
    return { data: [] };
  },
  async createResource(_data: any): Promise<{ data: any }> {
    throw new Error('Not implemented');
  },
  async getResource(_id: string): Promise<{ data: any }> {
    throw new Error('Not implemented');
  },
  async rateResource(_id: string, _rating: number): Promise<{ data: any }> {
    throw new Error('Not implemented');
  },
};

// Connection API calls (placeholder - implement based on your schema)
export const connectionAPI = {
  async getConnections(): Promise<{ data: any[] }> {
    return { data: [] };
  },
  async sendRequest(_recipientId: string, _message?: string): Promise<{ data: any }> {
    throw new Error('Not implemented');
  },
  async respondToRequest(_connectionId: string, _status: 'accepted' | 'declined'): Promise<{ data: any }> {
    throw new Error('Not implemented');
  },
  async getRequests(): Promise<{ data: any[] }> {
    return { data: [] };
  },
};