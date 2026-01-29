"use client"

import * as React from "react"
import { toast } from "sonner"
// Logic
import { SHOT_TEMPLATES } from "@/lib/shot-templates"
import { saveGeneration } from "@/lib/storage"
import { convertToWebP } from "@/lib/utils"
// Import useBrand
import { useBrand } from "@/lib/brand-context"

// Types
export type WorkspaceStatus = 'idle' | 'images_ready' | 'generating' | 'done' | 'error'

export interface Job {
    id: string
    templateId: any
    templateName: string
    status: 'pending' | 'processing' | 'done' | 'error'
    resultUrl?: string
    error?: string
}

export interface WorkspaceState {
    status: WorkspaceStatus
    files: File[]
    activePackId: string
    queue: Job[]
    generatedCount: number
    modelId: string // "flash" | "pro"
    brandGuard: boolean
    lighting: string // "natural" | "studio" | "warm" | "cool" | "neon"
    aspectRatio: string // "1:1" | "4:5" | "16:9"
}

// Actions
export type WorkspaceAction = 
    | { type: 'UPLOAD_FILES', payload: File[] }
    | { type: 'REMOVE_FILE', payload: string } 
    | { type: 'SET_PACK', payload: string }
    | { type: 'SET_MODEL', payload: string }
    | { type: 'TOGGLE_BRAND_GUARD' }
    | { type: 'SET_LIGHTING', payload: string }
    | { type: 'SET_ASPECT_RATIO', payload: string }
    | { type: 'START_GENERATION', payload: Job[] }
    | { type: 'JOB_UPDATE', payload: { id: string, status: Job['status'], resultUrl?: string, error?: string } }
    | { type: 'RESET' }

// Pack Definitions
const PACK_DEFINITIONS: Record<string, number[]> = {
    'pack_studio': [1, 2, 3], // Front, 3/4, Side
    'pack_lifestyle': [14, 27, 24], // Outdoor, Cafe, Golden Hour
    'pack_creative': [5, 6, 25], // Top-down, Flatlay, Neon
    'pack_social': [11, 12, 18], // Size, On-Face, Selfie
}

const initialState: WorkspaceState = {
    status: 'idle',
    files: [],
    activePackId: 'pack_studio',
    queue: [],
    generatedCount: 0,
    modelId: 'gemini-2.5-flash-image', // Nano Banana (2.5 Flash)
    brandGuard: true,
    lighting: 'studio',
    aspectRatio: '1:1'
}

// Reducer
function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
    switch (action.type) {
        case 'UPLOAD_FILES':
            return { 
                ...state, 
                files: [...state.files, ...action.payload],
                status: 'images_ready'
            }
        case 'REMOVE_FILE':
            const newFiles = state.files.filter(f => f.name !== action.payload)
            return {
                ...state,
                files: newFiles,
                status: newFiles.length === 0 ? 'idle' : 'images_ready'
            }
        case 'SET_PACK':
            return { ...state, activePackId: action.payload }
        case 'SET_MODEL':
            return { ...state, modelId: action.payload }
        case 'TOGGLE_BRAND_GUARD':
            return { ...state, brandGuard: !state.brandGuard }
        case 'SET_LIGHTING':
            return { ...state, lighting: action.payload }
        case 'SET_ASPECT_RATIO':
            return { ...state, aspectRatio: action.payload }
        case 'START_GENERATION':
            return {
                ...state,
                status: 'generating',
                queue: action.payload,
                generatedCount: 0
            }
        case 'JOB_UPDATE':
            const updatedQueue = state.queue.map(job => 
                job.id === action.payload.id 
                    ? { ...job, ...action.payload } 
                    : job
            )
            const allDone = updatedQueue.every(j => j.status === 'done' || j.status === 'error')
            const newGeneratedCount = action.payload.status === 'done' ? state.generatedCount + 1 : state.generatedCount;

            return {
                ...state,
                queue: updatedQueue,
                status: allDone ? 'done' : 'generating',
                generatedCount: newGeneratedCount
            }
        case 'RESET':
            return initialState
        default:
            return state
    }
}

// Context
const WorkspaceContext = React.createContext<{
    state: WorkspaceState
    dispatch: React.Dispatch<WorkspaceAction>
    generatePack: () => Promise<void>
} | null>(null)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = React.useReducer(workspaceReducer, initialState)
    const { companyName, primaryColor } = useBrand()

    // Helper: Convert File to Base64
    const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
        })
    }

    // Main Action: Generate based on Active Pack
    const generatePack = async () => {
        if (state.files.length === 0) return;
        
        // apiKey check removed (handled server-side)


        // 1. Determine Jobs
        const templateIds = PACK_DEFINITIONS[state.activePackId] || PACK_DEFINITIONS['pack_studio'];
        const jobs: Job[] = templateIds.map(tid => {
            const t = SHOT_TEMPLATES.find(temp => temp.id === tid);
            return {
                id: crypto.randomUUID(),
                templateId: tid,
                templateName: t?.title || `Template ${tid}`,
                status: 'pending'
            }
        });

        dispatch({ type: 'START_GENERATION', payload: jobs });

        try {
            // Prepare Object Images (only once)
            const objectBase64s = await Promise.all(state.files.map(toBase64));

            // Execute Jobs in Parallel (Concurrency: 3)
            // Ideally we'd use a queue manager, but Promise.all is okay for MVP (3-4 items)
            await Promise.all(jobs.map(async (job) => {
                dispatch({ type: 'JOB_UPDATE', payload: { id: job.id, status: 'processing' } });

                try {
                    const template = SHOT_TEMPLATES.find(t => t.id === job.templateId);
                    if (!template) throw new Error("Template not found");

                    // Construct Deep Brand Prompt
                    let brandPrompt = "";
                    if (state.brandGuard) {
                        brandPrompt = `, consistent brand identity for ${companyName}, featuring ${primaryColor} accents, luxury commercial photography style`;
                    }

                    const res = await fetch("/api/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            // apiKey removed

                            modelId: state.modelId,
                            objectImages: objectBase64s, 
                            angleDescription: `${template.prompt}${state.lighting !== 'natural' ? `, ${state.lighting} lighting` : ''}${brandPrompt}`, 
                            angleName: template.title,
                            aspectRatio: state.aspectRatio
                        })
                    });

                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || "Generation failed");

                    if (data.image) {
                        const imgData = `data:${data.mimeType};base64,${data.image}`;
                        
                        // Save to Storage
                        const webpData = await convertToWebP(imgData, 0.8);
                        await saveGeneration({
                            id: crypto.randomUUID(),
                            templateName: template.title,
                            templateId: template.id.toString(),
                            timestamp: Date.now(),
                            imageUrl: webpData
                        });

                        dispatch({ type: 'JOB_UPDATE', payload: { id: job.id, status: 'done', resultUrl: webpData } });
                    }

                } catch (err: any) {
                    console.error("Job failed", err);
                    const isModelError = err.message?.includes("Model not found") || err.message?.includes("404");
                    
                    dispatch({ type: 'JOB_UPDATE', payload: { 
                        id: job.id, 
                        status: 'error', 
                        error: isModelError 
                            ? "Model error. Try 'Flash' mode." 
                            : err.message 
                    } });
                    
                    if (isModelError) {
                        toast.error("Model Generation Failed", { description: "Try switching to Flash model in the top right." });
                    }
                }
            }));
            
            // Minimal Toast if at least one succeeded? Or check queue.
            // toast.success("Pack completed!"); 
        } catch (globalErr) {
             console.error("Pack generation failed", globalErr);
             toast.error("Generation failed to start");
        }
    }

    return (
        <WorkspaceContext.Provider value={{ state, dispatch, generatePack }}>
            {children}
        </WorkspaceContext.Provider>
    )
}

export function useWorkspace() {
    const context = React.useContext(WorkspaceContext)
    if (!context) throw new Error("useWorkspace must be used within WorkspaceProvider")
    return context
}
