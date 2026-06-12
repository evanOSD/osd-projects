import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase.from('books').select('*').limit(5)
  return NextResponse.json({ data, error })
}
