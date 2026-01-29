"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useWorkspace } from "./workspace-context"
import { cn } from "@/lib/utils"

// Zone definitions for positioning logic
const ZONES = {
    A: { x: 100, y: 100, label: "A: Quick Shot" }, // Top Left
    B: { x: 650, y: 100, label: "B: Pack" },       // Top Center
    E: { x: 650, y: 800, label: "E: Queue" }       // Bottom Center (approx)
}

export function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    const { state } = useWorkspace()

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[var(--bg-0)] flex">
             {/* Ambient Background Layer */}
             <div className="absolute inset-0 z-0 pointer-events-none">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/30" />
                 {/* Vignette */}
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)]" />
                 {/* Dynamic Blur Overlay based on state */}
                 <div className={cn(
                     "absolute inset-0 backdrop-blur-[0px] transition-all duration-1000",
                     state.status === 'generating' && "backdrop-blur-[2px] bg-white/10"
                 )} />
             </div>

             {/* Main Content Area */}
             <main className="relative z-10 flex-1 flex flex-col p-6">
                {/* We will render children (widgets) here. 
                    Ideally, children are passed as specific draggable components 
                    or the layout maps them. For now, just render grid.
                */}
                 {children}
             </main>

             {/* Hint Grid (Optional - Visible on Drag) */}
             {/* <div className="absolute inset-0 z-0 pointer-events-none grid grid-cols-3 grid-rows-3 gap-4 p-8 opacity-10">
                 <div className="border border-dashed border-black rounded-3xl flex items-center justify-center">A</div>
                 <div className="border border-dashed border-black rounded-3xl flex items-center justify-center">B</div>
                 <div className="border border-dashed border-black rounded-3xl flex items-center justify-center">C</div>
                 <div className="border border-dashed border-black rounded-3xl flex items-center justify-center">D</div>
                 <div className="border border-dashed border-black rounded-3xl flex items-center justify-center">E</div>
                 <div className="border border-dashed border-black rounded-3xl flex items-center justify-center">F</div>
             </div> */}
        </div>
    )
}
