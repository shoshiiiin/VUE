import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "secondary" | "icon" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles rely on global .btn class if not icon
          variant === "icon" ? "btn-icon" : "btn",
          // Variants mapped to new global classes
          {
            "btn-primary": variant === "default",
            "btn-secondary": variant === "outline" || variant === "secondary",
            "bg-red-500 hover:bg-red-600 text-white border-transparent": variant === "destructive",
            "bg-transparent hover:bg-[var(--surface-1)] text-[var(--text-strong)]": variant === "ghost",
            "text-accent-500 underline-offset-4 hover:underline btn bg-transparent border-none shadow-none hover:shadow-none hover:transform-none": variant === "link",
            
            // Sizes (override defaults from .btn if needed)
            "h-10 px-5 text-sm": size === "default" && variant !== "icon",
            "h-8 px-4 text-xs": size === "sm" && variant !== "icon",
            "h-12 px-8 text-base": size === "lg" && variant !== "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
