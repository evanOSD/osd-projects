// src/app/(dashboard)/users/page.tsx

import { redirect } from 'next/navigation'

export default function UsersIndexPage() {
  // Langsung lempar user ke Tab 1
  redirect('/users/list')
}
