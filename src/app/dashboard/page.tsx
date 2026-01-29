"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
    LayoutDashboard, 
    Sparkles, 
    TrendingUp, 
    Leaf,
    PieChart,
    ArrowUpRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { getStats, getHistory } from "@/lib/storage"
import { useBrand } from "@/lib/brand-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function DashboardPage() {
    const { companyName } = useBrand()
    const [stats, setStats] = React.useState({ 
        count: 0, 
        savings: 0, 
        timeSavedHours: "0", 
        topStyle: "N/A", 
        activityData: [0,0,0,0,0,0,0],
        categoryMix: { Studio: 0, Lifestyle: 0, Creative: 0 },
        co2SavedKg: "0" 
    })
    const [history, setHistory] = React.useState<any[]>([])
    const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())
    
    // Derived state
    const isSelectionMode = selectedItems.size > 0

    React.useEffect(() => {
        const load = async () => {
            setStats(await getStats())
            setHistory(await getHistory())
        }
        load()
    }, [])

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedItems)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setSelectedItems(newSet)
    }
    
    const selectAll = () => {
        if (selectedItems.size === history.length) {
            setSelectedItems(new Set())
        } else {
            setSelectedItems(new Set(history.map(h => h.id)))
        }
    }

    const handleDelete = async () => {
        if (!confirm(`Delete ${selectedItems.size} items?`)) return;
        
        // Dynamic import to avoid SSR issues if used elsewhere, though deleteItems is safe
        const { deleteItems } = await import("@/lib/storage")
        const updated = await deleteItems(Array.from(selectedItems))
        setHistory(updated)
        setStats(await getStats()) // Refresh stats
        setSelectedItems(new Set())
        toast.success("Items deleted")
    }

    const handleDownload = () => {
        const selected = history.filter(h => selectedItems.has(h.id))
        selected.forEach((item, index) => {
            setTimeout(() => {
                const link = document.createElement('a')
                link.href = item.imageUrl
                link.download = `${item.templateName}-${item.timestamp}.png`
                link.click()
            }, index * 500) // Stagger to prevent browser blocking
        })
        toast.success(`Started download for ${selected.length} items`)
    }

    return (
        <main className="app-canvas p-8 lg:p-12 min-h-full pb-24">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="text-gray-500 mt-1">Production intelligence & analytics.</p>
                    </div>
                </div>

                {/* Metrics Grid - Analytics Hub */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 1. Total Impact (Large) */}
                    <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-sm relative overflow-hidden">
                        <CardContent className="p-8 flex flex-col justify-between h-full">
                                <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <Sparkles className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Total Production</span>
                                </div>
                                <div className="flex items-baseline gap-4">
                                    <div className="text-7xl font-bold text-gray-900 tracking-tighter">{stats.count}</div>
                                    <div className="text-lg text-gray-400 font-medium">Assets Generated</div>
                                </div>
                                </div>
                                <div className="mt-8 grid grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Market Value</div>
                                        <div className="text-3xl font-semibold text-emerald-600 tracking-tight">${stats.savings.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Time Saved</div>
                                        <div className="text-3xl font-semibold text-indigo-600 tracking-tight">{stats.timeSavedHours}h</div>
                                    </div>
                                </div>
                        </CardContent>
                    </Card>

                    {/* 2. Sustainability (Green) */}
                    <Card className="bg-white border border-gray-200 shadow-sm relative overflow-hidden">
                        <CardContent className="p-8">
                                <div className="flex items-center gap-2 mb-8">
                                    <Leaf className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Eco Impact</span>
                                </div>
                                <div className="text-6xl font-bold text-gray-900 tracking-tighter mb-2">{stats.co2SavedKg}</div>
                                <div className="text-base text-gray-500 font-medium">kg CO2 Avoided</div>
                                <p className="text-xs text-gray-400 mt-6 leading-relaxed">
                                    Visualizing the environmental benefit of virtual photography.
                                </p>
                        </CardContent>
                    </Card>

                    {/* 3. Activity Chart (Full Width) */}
                    <div className="lg:col-span-2 h-72 bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                            <ActivityChart data={stats.activityData} />
                    </div>

                        {/* 4. Category Mix (Progress Bars) */}
                        <Card className="bg-white border border-gray-200 shadow-sm relative overflow-hidden">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-2 mb-8">
                                    <PieChart className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Content Mix</span>
                                </div>
                                
                                <div className="space-y-8">
                                    {/* Studio */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-gray-900">Studio</span>
                                            <span className="text-gray-500 font-mono">{stats.categoryMix?.Studio || 0}</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(stats.categoryMix?.Studio / (stats.count || 1)) * 100}%` }}
                                            transition={{ duration: 1 }}
                                            className="h-full bg-gray-900" 
                                            />
                                        </div>
                                    </div>

                                    {/* Lifestyle */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-gray-900">Lifestyle</span>
                                            <span className="text-gray-500 font-mono">{stats.categoryMix?.Lifestyle || 0}</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(stats.categoryMix?.Lifestyle / (stats.count || 1)) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                            className="h-full bg-gray-400" 
                                            />
                                        </div>
                                    </div>

                                    {/* Creative */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-gray-900">Creative</span>
                                            <span className="text-gray-500 font-mono">{stats.categoryMix?.Creative || 0}</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(stats.categoryMix?.Creative / (stats.count || 1)) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.4 }}
                                            className="h-full bg-gray-300" 
                                            />
                                        </div>
                                    </div>
                                </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
