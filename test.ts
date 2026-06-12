import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rrzikezrhxjwfmmcqnim.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseKey) {
  console.error("Please run with NEXT_PUBLIC_SUPABASE_ANON_KEY=... npx tsx test.ts")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("Querying Supabase...")
  const { data, error } = await supabase
    .from('books')
    .select('id, kitab, total_verses, chapter, pasal, category, book_name, book_code')
    .limit(5)
    
  console.log("Error:", error)
  console.log("Data:", JSON.stringify(data, null, 2))
}

test()
