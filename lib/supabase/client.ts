import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          full_name: string | null
          preferences: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          full_name?: string | null
          preferences?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          full_name?: string | null
          preferences?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          thumbnail_url: string | null
          is_public: boolean
          template_type: string
          settings: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          thumbnail_url?: string | null
          is_public?: boolean
          template_type?: string
          settings?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          thumbnail_url?: string | null
          is_public?: boolean
          template_type?: string
          settings?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          project_id: string
          path: string
          content: string
          language: string
          size: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          path: string
          content?: string
          language?: string
          size?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          path?: string
          content?: string
          language?: string
          size?: number
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          project_id: string
          type: string
          title: string
          content: string
          version: number
          parent_id: string | null
          created_by_agent: string
          metadata: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: string
          title: string
          content?: string
          version?: number
          parent_id?: string | null
          created_by_agent: string
          metadata?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          type?: string
          title?: string
          content?: string
          version?: number
          parent_id?: string | null
          created_by_agent?: string
          metadata?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
      agent_interactions: {
        Row: {
          id: string
          project_id: string
          agent_id: string
          user_message: string
          agent_response: string
          action_taken: string | null
          metadata: Record<string, any>
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          agent_id: string
          user_message: string
          agent_response: string
          action_taken?: string | null
          metadata?: Record<string, any>
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          agent_id?: string
          user_message?: string
          agent_response?: string
          action_taken?: string | null
          metadata?: Record<string, any>
          created_at?: string
        }
      }
      project_collaborators: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: 'owner' | 'editor' | 'viewer'
          invited_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role: 'owner' | 'editor' | 'viewer'
          invited_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: 'owner' | 'editor' | 'viewer'
          invited_by?: string | null
          created_at?: string
        }
      }
    }
  }
}
