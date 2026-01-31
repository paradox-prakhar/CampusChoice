import { cn } from "../../lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "outline" | "secondary" | "destructive" | "success" | "warning"
  className?: string
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "border-transparent bg-indigo-600 text-white hover:bg-indigo-700",
        secondary: "border-transparent bg-slate-800 text-slate-100 hover:bg-slate-700",
        destructive: "border-transparent bg-red-500/10 text-red-500 border border-red-500/20",
        outline: "text-slate-100 border border-slate-700",
        success: "border-transparent bg-green-500/10 text-green-400 border border-green-500/20",
        warning: "border-transparent bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    }

  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props} />
  )
}
