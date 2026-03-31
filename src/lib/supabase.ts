import { createClient } from '@supabase/supabase-js'

type Database = {
  public: {
    Tables: {
      waitlist: {
        Row: { id: string; email: string; created_at: string; role: string; country: string; instagram_url: string | null }
        Insert: { id?: string; email: string; created_at?: string; role?: string; country?: string; instagram_url?: string | null }
        Update: { id?: string; email?: string; created_at?: string; role?: string; country?: string; instagram_url?: string | null }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

let browserClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseBrowserClient() {
  const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const publicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!publicSupabaseUrl || !publicSupabaseAnonKey) {
    return null
  }

  if (!browserClient) {
    browserClient = createClient<Database>(publicSupabaseUrl, publicSupabaseAnonKey)
  }

  return browserClient
}

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
