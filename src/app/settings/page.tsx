"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Image as ImageIcon, Save, Sparkles, Building2, Key, Palette } from "lucide-react"
import { useBrand } from "@/lib/brand-context"

export default function SettingsPage() {
    const { logoUrl, setLogoUrl, primaryColor, setPrimaryColor, companyName, setCompanyName } = useBrand()
    const [isConnected, setIsConnected] = React.useState<boolean | null>(null)
    const [modelId, setModelId] = React.useState("gemini-3-pro-image-preview") // Default
    const [saved, setSaved] = React.useState(false)

    // Load Model & Check Connection
    React.useEffect(() => {
        const storedModel = localStorage.getItem("selected_model")
        if (storedModel) setModelId(storedModel)
        
        // Check server connection
        fetch("/api/status")
            .then(res => res.json())
            .then(data => setIsConnected(data.connected))
            .catch(() => setIsConnected(false))
    }, [])

    const handleSave = () => {
        localStorage.setItem("selected_model", modelId)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoUrl(reader.result as string);
        }
        reader.readAsDataURL(file);
    }

    return (
        <main className="p-8 lg:p-12 max-w-5xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-[var(--text-strong)]">Settings</h1>
                <p className="text-[var(--text-muted)]">Manage your workspace configuration and branding.</p>
            </div>

            <div className="grid gap-8">
                {/* AI Configuration */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="w-5 h-5 text-accent-500" />
                            AI connection
                        </CardTitle>
                        <CardDescription>Connection status to Google's Generative AI.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                            <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500"}`} />
                            <div className="flex-1">
                                <p className="font-medium text-sm text-[var(--text-strong)]">
                                    {isConnected === null ? "Checking..." : isConnected ? "Connected" : "Not Connected"}
                                </p>
                                <p className="text-xs text-[var(--text-muted)]">
                                    {isConnected 
                                        ? "Server is securely configured with Google API Key." 
                                        : "Server missing GOOGLE_API_KEY environment variable."}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="model">Model Selection</Label>
                            <select 
                                id="model"
                                value={modelId} 
                                onChange={(e) => setModelId(e.target.value)} 
                                className="select w-full"
                            >
                                <option value="gemini-3-pro-image-preview">Nano Banana Pro (Gemini 3 Pro)</option>
                                <option value="gemini-2.0-flash-exp">Nano Banana (Gemini 2.0 Flash)</option>
                            </select>
                        </div>
                        <Button onClick={handleSave} className="w-full sm:w-auto">
                            {saved ? "Saved!" : "Save Configuration"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Branding */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="w-5 h-5 text-accent-500" />
                            Whitelabel Branding
                        </CardTitle>
                        <CardDescription>Customize the look and feel of the Product Studio.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-8 md:grid-cols-2">
                        
                        {/* Information */}
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Company Name</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                    <Input 
                                        value={companyName} 
                                        onChange={(e) => setCompanyName(e.target.value)} 
                                        placeholder="Enter company name"
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Primary Brand Color</Label>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg border border-[var(--border)] p-1 bg-white shadow-sm flex-shrink-0">
                                        <input 
                                            type="color" 
                                            value={primaryColor} 
                                            onChange={(e) => setPrimaryColor(e.target.value)} 
                                            className="w-full h-full rounded cursor-pointer opacity-100" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="font-mono text-sm bg-[var(--surface-2)] px-2 py-1 rounded text-[var(--text-strong)] block w-fit">
                                            {primaryColor}
                                        </span>
                                        <p className="text-[10px] text-[var(--text-muted)]">Used for accents and buttons.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div className="space-y-2">
                            <Label>Brand Logo</Label>
                            <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-[var(--surface-2)]/50 transition-colors relative group">
                                <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden border border-[var(--border)]">
                                     {logoUrl ? (
                                        <img src={logoUrl} className="w-full h-full object-cover" alt="Brand Logo" />
                                     ) : (
                                        <ImageIcon className="w-8 h-8 text-[var(--text-muted)]" />
                                     )}
                                </div>
                                <div>
                                    <Button variant="secondary" size="sm" className="relative">
                                        Upload Logo
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="absolute inset-0 opacity-0 cursor-pointer" 
                                            onChange={handleLogoUpload} 
                                        />
                                    </Button>
                                    <p className="text-[10px] text-[var(--text-muted)] mt-2">Recommended: Square PNG, 512x512</p>
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
