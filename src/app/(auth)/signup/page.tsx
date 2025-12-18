import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"

export default function SignupPage() {
    return (
        <div className="w-full max-w-md space-y-6">
            <div className="flex flex-col items-center space-y-2 text-center">
                <h1 className="h1-hero tracking-tighter text-primary neon-text mb-4">Cadence</h1>
                <p className="text-muted-foreground">Join the movement</p>
            </div>
            <SignupForm />
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline hover:text-primary transition-colors">
                    Sign in
                </Link>
            </p>
        </div>
    )
}
