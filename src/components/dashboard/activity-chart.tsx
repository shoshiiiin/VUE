"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface ActivityChartProps {
    data: number[];
}

export function ActivityChart({ data }: ActivityChartProps) {
    const max = Math.max(...data, 1); // Avoid divide by zero

    return (
        <Card className="glass-card relative overflow-hidden flex flex-col">
            <CardHeader className="pb-2">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">7 Day Activity</CardTitle>
                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                 </div>
            </CardHeader>
            <CardContent className="flex-1 flex items-end justify-between gap-2 p-5 pt-2">
                {data.map((value, index) => {
                    const heightPercentage = (value / max) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col justify-end items-center group h-full relative">
                            {/* Tooltip */}
                            <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--surface-3)] text-[var(--text-strong)] text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                {value} Generated
                            </div>
                            
                            {/* Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPercentage}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                                className="w-full bg-indigo-500/20 rounded-sm relative overflow-hidden group-hover:bg-indigo-500/40 transition-colors"
                            >
                                <motion.div 
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                                    className="absolute bottom-0 left-0 right-0 bg-indigo-500 h-1" 
                                />
                            </motion.div>
                            
                            {/* Label */}
                            <span className="text-[9px] text-[var(--text-muted)] mt-1 font-mono">
                                {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { weekday: 'narrow' })}
                            </span>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
