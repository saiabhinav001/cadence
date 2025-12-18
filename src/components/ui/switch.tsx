"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
    <label className="relative inline-flex h-6 w-11 items-center rounded-full bg-input transition-colors cursor-pointer">
        <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
            {...props}
        />
        <div className="h-6 w-11 rounded-full bg-muted transition-colors peer-checked:bg-primary" />
        <div className={cn(
            "absolute left-1 h-4 w-4 rounded-full bg-background transition-transform peer-checked:translate-x-5"
        )} />
    </label>
))
Switch.displayName = "Switch"

export { Switch }
