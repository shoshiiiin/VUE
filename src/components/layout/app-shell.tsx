"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Sparkles, 
  Settings as SettingsIcon, 
  Image as ImageIcon,
  LogOut,
  Menu
} from "lucide-react"
import { useBrand } from "@/lib/brand-context"

const NAV_ITEMS = [
  { label: "Workspace", href: "/", icon: LayoutDashboard }, // New Home
  { label: "Studio", href: "/studio", icon: Sparkles }, // Old Home
  { label: "Gallery", href: "/gallery", icon: ImageIcon },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }, // Keep for now, maybe rename to Analytics
  { label: "Assets", href: "/assets", icon: ImageIcon, disabled: true },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { logoUrl, companyName } = useBrand()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <div className="flex min-h-screen bg-[var(--bg-1)]">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col p-4 fixed h-full z-50">
        <div className="sidebar flex-1 flex flex-col p-4">
            
            {/* Header / Brand */}
            {/* Added extra padding-bottom for separation */}
            <div className="flex items-center gap-4 mb-10 px-2 pt-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 border border-white/50 flex items-center justify-center overflow-hidden shadow-lg shadow-accent-500/10 flex-shrink-0 backdrop-blur-md">
                    {logoUrl ? (
                         <img src={logoUrl} className="w-full h-full object-cover" />
                    ) : (
                         <Sparkles className="text-accent-500 w-5 h-5" />
                    )}
                </div>
                <div className="overflow-hidden flex-1">
                    <h2 className="font-bold text-[var(--text-strong)] text-base tracking-tight truncate leading-none mb-1">{logoUrl ? companyName : "Product Studio"}</h2>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold opacity-70">Enterprise</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="space-y-2 flex-1">
                {NAV_ITEMS.map(item => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    
                    return (
                        <Link 
                            key={item.href} 
                            href={item.disabled ? '#' : item.href}
                            className={cn(
                                "nav-item group",
                                isActive && "is-active",
                                item.disabled && "opacity-40 cursor-not-allowed hover:bg-transparent hover:transform-none hover:shadow-none"
                            )}
                        >
                            <div className={cn(
                                "p-1.5 rounded-lg transition-colors duration-300",
                                isActive ? "bg-accent-500/10" : "bg-transparent group-hover:bg-white/50"
                            )}>
                                <Icon className={cn("nav-icon w-5 h-5", isActive ? "text-accent-500" : "text-[var(--text-muted)]")} />
                            </div>
                            <span className="font-medium text-[15px]">{item.label}</span>
                            {item.disabled && <span className="ml-auto text-[9px] font-bold uppercase text-[var(--text-muted)] border border-[var(--border)] px-1.5 py-0.5 rounded-md bg-white/20">Soon</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto space-y-2 pt-6">
                 {/* Decorative Separator */}
                 <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent mb-4 opacity-50" />
                 
                 <Link href="/settings" className="nav-item w-full text-left group flex items-center gap-3 px-3 py-2 hover:bg-white/50 rounded-lg transition-colors">
                    <div className="p-1.5 rounded-lg bg-transparent group-hover:bg-white/50 transition-colors">
                        <SettingsIcon className="nav-icon w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--text-strong)]" />
                    </div>
                    <span className="font-medium text-[15px] text-[var(--text-muted)] group-hover:text-[var(--text-strong)]">Settings</span>
                 </Link>
                 
                 <button className="nav-item w-full text-left text-[var(--danger)] hover:bg-[var(--danger)]/5 hover:text-[var(--danger)] group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors">
                    <div className="p-1.5 rounded-lg bg-transparent group-hover:bg-[var(--danger)]/10 transition-colors">
                        <LogOut className="nav-icon w-5 h-5 text-[var(--danger)] opacity-70 group-hover:opacity-100" />
                    </div>
                    <span className="font-medium text-[15px]">Logout</span>
                 </button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-72 relative min-h-screen">
          
          {/* Mobile Header (visible only on small screens) */}
          <div className="lg:hidden p-4 flex items-center justify-between glass-panel mx-4 mt-4 mb-2 sticky top-4 z-40">
                <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
                        <Sparkles className="text-accent-500 w-4 h-4" />
                     </div>
                     <span className="font-bold text-[var(--text-strong)]">Studio</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                    <Menu className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
          </div>

          {/* Canvas */}
          <div className="relative h-full"> 
             {children}
          </div>

      </main>
    </div>
  )
}
