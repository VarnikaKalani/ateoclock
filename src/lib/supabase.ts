import { createClient } from '@supabase/supabase-js'

type Database = {
  public: {
    Tables: {
      waitlist: {
        Row: { id: string; email: string; created_at: string }
        Insert: { id?: string; email: string; created_at?: string }
        Update: { id?: string; email?: string; created_at?: string }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const publicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase =
  publicSupabaseUrl && publicSupabaseAnonKey
    ? createClient<Database>(publicSupabaseUrl, publicSupabaseAnonKey)
    : null

function getEnvValue(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY' | 'SUPABASE_SERVICE_ROLE_KEY') {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

export function getSupabaseServerClient() {
  const supabaseUrl = getEnvValue('NEXT_PUBLIC_SUPABASE_URL')
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? getEnvValue('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
