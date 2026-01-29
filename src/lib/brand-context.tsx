"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface BrandContextType {
  logoUrl: string | null
  setLogoUrl: (url: string | null) => void
  primaryColor: string
  setPrimaryColor: (color: string) => void
  companyName: string
  setCompanyName: (name: string) => void
}

const BrandContext = createContext<BrandContextType | undefined>(undefined)

const DEFAULT_PRIMARY = "#9286A0" // Accent-500 from your design system
const DEFAULT_COMPANY = "Product Studio"

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY)
  const [companyName, setCompanyName] = useState(DEFAULT_COMPANY)

  // Load from localStorage on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem("brand_logo")
    const savedColor = localStorage.getItem("brand_color")
    const savedName = localStorage.getItem("brand_name")

    if (savedLogo) setLogoUrl(savedLogo)
    if (savedColor) setPrimaryColor(savedColor)
    if (savedName) setCompanyName(savedName)
  }, [])

  // Persist and Apply effects
  useEffect(() => {
    if (logoUrl) localStorage.setItem("brand_logo", logoUrl)
    else localStorage.removeItem("brand_logo")
  }, [logoUrl])

  useEffect(() => {
    localStorage.setItem("brand_name", companyName)
  }, [companyName])

  useEffect(() => {
    localStorage.setItem("brand_color", primaryColor)
    
    // Dynamically update CSS variable for primary accent
    // We update --accent-500 and derive some variations if possible, 
    // or just rely on the user picking a color that works.
    document.documentElement.style.setProperty("--accent-500", primaryColor)
    
    // Ideally we would calculate lighter/darker shades here for 300/400
    // For now, let's just map them to the same or slightly adjusted opacity/mix
    // Simple approach: usage of hexToRgb could facilitate rgba vars
    document.documentElement.style.setProperty("--ring", `0 0 0 3px ${createRingColor(primaryColor)}`)

  }, [primaryColor])

  return (
    <BrandContext.Provider
      value={{
        logoUrl,
        setLogoUrl,
        primaryColor,
        setPrimaryColor,
        companyName,
        setCompanyName,
      }}
    >
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const context = useContext(BrandContext)
  if (context === undefined) {
    throw new Error("useBrand must be used within a BrandProvider")
  }
  return context
}

// Helper to create a transparent ring color from hex
function createRingColor(hex: string) {
    // Basic hex parsing
    let c: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.25)';
    }
    return 'rgba(146, 134, 160, 0.25)'; // fallback
}
