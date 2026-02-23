// src/components/layout/topbarcomponents/LogoutButton.tsx

"use client"

import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.success("Berhasil logout")
      router.push("/login")
      router.refresh() 
    } catch (error: any) {
      toast.error("Gagal logout: " + error.message)
    }
  }

  return (
    <div className="border-t border-border py-1">
      <button 
        onClick={handleLogout}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/20"
      >
        <LogOut size={16} /><span>Logout</span>
      </button>
    </div>
  )
}
