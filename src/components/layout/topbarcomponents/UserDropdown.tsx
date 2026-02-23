// src/components/layout/topbarcomponents/UserDropdown.tsx

"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

import UserProfile from "./UserProfile"
import UserSettings from "./UserSettings"
import LogoutButton from "./LogoutButton"

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ top: 0, right: 0 })
  const [mounted, setMounted] = useState(false)
  
  // State Data User
  const [userName, setUserName] = useState<string>("Memuat...")
  const [userEmail, setUserEmail] = useState<string>("Memuat...")
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email ?? "Email tidak ditemukan")
        setUserName(user.user_metadata?.full_name ?? user.user_metadata?.name ?? "Pengguna OSD")
        setUserAvatar(user.user_metadata?.avatar_url ?? null)
      }
    }
    fetchUser()
    setMounted(true)
  }, [supabase])

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setCoords({ top: rect.bottom + 12, right: window.innerWidth - rect.right })
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  return (
    <>
      <button 
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-surface transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2 hover:ring-offset-background focus:outline-none"
      >
        {userAvatar ? (
          <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
        ) : (
          <User size={20} className="text-muted" />
        )}
      </button>

      {mounted && isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed w-64 origin-top-right rounded-xl border border-border bg-surface shadow-xl outline-none z-50 animate-dropdown"
          style={{ top: coords.top, right: coords.right }}
        >
          <UserProfile userName={userName} userEmail={userEmail} />
          
          <div className="py-1">
            <UserSettings />
          </div>
          
          <LogoutButton />
        </div>,
        document.body 
      )}
    </>
  )
}
