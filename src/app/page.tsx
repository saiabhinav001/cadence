import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Trophy, Zap, LayoutGrid } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-border/40 backdrop-blur-xl fixed top-0 w-full z-50">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold text-xl tracking-tighter text-primary neon-text">Cadence</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild variant="ghost">
            <Link href="/login">
              Login
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 pt-20">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex flex-col items-center text-center px-4">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.1),transparent_70%)]"></div>

          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="h1-hero tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Turn your daily wins into generic <span className="text-primary neon-text">momentum</span>.
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  A professional "Brag Document" that tracks your micro-achievements, visualizes your impact, and helps you negotiate your next raise.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-8 text-base glow-hover w-full sm:w-auto group">
                    Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 bg-white/5 border-y border-white/5">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="saas-card rounded-xl p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary ring-1 ring-primary/20">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl">Track Wins</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Log achievements instantly with our linear-style command bar.</p>
              </div>
              <div className="saas-card rounded-xl p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-secondary/10 rounded-full text-secondary-foreground ring-1 ring-white/10">
                  <LayoutGrid className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl">Visualize Growth</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">See your momentum with heatmaps and beautiful bento grids.</p>
              </div>
              <div className="saas-card rounded-xl p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-500 ring-1 ring-yellow-500/20">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl">Export & Impress</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">One-click export for performance reviews or resume updates.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border/40">
        <p className="text-xs text-gray-500">© 2025 Cadence. Built for builders.</p>
      </footer>
    </div>
  )
}
