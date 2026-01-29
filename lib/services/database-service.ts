import { supabase, Database } from '@/lib/supabase/client'

type Tables = Database['public']['Tables']
type Project = Tables['projects']['Row']
type ProjectInsert = Tables['projects']['Insert']
type ProjectUpdate = Tables['projects']['Update']
type File = Tables['files']['Row']
type FileInsert = Tables['files']['Insert']
type FileUpdate = Tables['files']['Update']
type Document = Tables['documents']['Row']
type DocumentInsert = Tables['documents']['Insert']
type DocumentUpdate = Tables['documents']['Update']
type AgentInteraction = Tables['agent_interactions']['Row']
type AgentInteractionInsert = Tables['agent_interactions']['Insert']
type Profile = Tables['profiles']['Row']
type ProfileUpdate = Tables['profiles']['Update']

export class DatabaseService {
  static async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    return { data, error }
  }

  static async updateProfile(userId: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    return { data, error }
  }

  static async getProjects(userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    return { data, error }
  }

  static async getProject(projectId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle()

    return { data, error }
  }

  static async createProject(project: ProjectInsert) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()

    return { data, error }
  }

  static async updateProject(projectId: string, updates: ProjectUpdate) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()

    return { data, error }
  }

  static async deleteProject(projectId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    return { error }
  }

  static async getProjectFiles(projectId: string) {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('project_id', projectId)
      .order('path')

    return { data, error }
  }

  static async getFile(fileId: string) {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .maybeSingle()

    return { data, error }
  }

  static async getFileByPath(projectId: string, path: string) {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('project_id', projectId)
      .eq('path', path)
      .maybeSingle()

    return { data, error }
  }

  static async createFile(file: FileInsert) {
    const { data, error } = await supabase
      .from('files')
      .insert(file)
      .select()
      .single()

    return { data, error }
  }

  static async updateFile(fileId: string, updates: FileUpdate) {
    const { data, error } = await supabase
      .from('files')
      .update(updates)
      .eq('id', fileId)
      .select()
      .single()

    return { data, error }
  }

  static async updateFileByPath(projectId: string, path: string, updates: FileUpdate) {
    const { data, error } = await supabase
      .from('files')
      .update(updates)
      .eq('project_id', projectId)
      .eq('path', path)
      .select()
      .single()

    return { data, error }
  }

  static async deleteFile(fileId: string) {
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId)

    return { error }
  }

  static async deleteFileByPath(projectId: string, path: string) {
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('project_id', projectId)
      .eq('path', path)

    return { error }
  }

  static async getProjectDocuments(projectId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    return { data, error }
  }

  static async getDocument(documentId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .maybeSingle()

    return { data, error }
  }

  static async createDocument(document: DocumentInsert) {
    const { data, error } = await supabase
      .from('documents')
      .insert(document)
      .select()
      .single()

    return { data, error }
  }

  static async updateDocument(documentId: string, updates: DocumentUpdate) {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', documentId)
      .select()
      .single()

    return { data, error }
  }

  static async deleteDocument(documentId: string) {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)

    return { error }
  }

  static async getProjectInteractions(projectId: string) {
    const { data, error } = await supabase
      .from('agent_interactions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    return { data, error }
  }

  static async createInteraction(interaction: AgentInteractionInsert) {
    const { data, error } = await supabase
      .from('agent_interactions')
      .insert(interaction)
      .select()
      .single()

    return { data, error }
  }

  static async getPublicProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*, profiles(username, avatar_url)')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(20)

    return { data, error }
  }

  static async searchProjects(query: string, userId?: string) {
    let queryBuilder = supabase
      .from('projects')
      .select('*, profiles(username, avatar_url)')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    if (userId) {
      queryBuilder = queryBuilder.or(`user_id.eq.${userId},is_public.eq.true`)
    } else {
      queryBuilder = queryBuilder.eq('is_public', true)
    }

    const { data, error } = await queryBuilder
      .order('updated_at', { ascending: false })
      .limit(50)

    return { data, error }
  }
}

export type {
  Project,
  ProjectInsert,
  ProjectUpdate,
  File,
  FileInsert,
  FileUpdate,
  Document,
  DocumentInsert,
  DocumentUpdate,
  AgentInteraction,
  AgentInteractionInsert,
  Profile,
  ProfileUpdate,
}
