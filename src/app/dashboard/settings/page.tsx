"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2, Globe, Copy, User, Lock, ShieldCheck } from "lucide-react"
import { useUserStore } from "@/lib/store/user"

export default function SettingsPage() {
    const { user, profile, fetchUser, updateProfile } = useUserStore()
    const [isSaving, setIsSaving] = useState(false)
    const [isSavingPassword, setIsSavingPassword] = useState(false)

    // Profile State
    const [fullName, setFullName] = useState("")
    const [username, setUsername] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [usernameError, setUsernameError] = useState("")

    // Password State
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [host, setHost] = useState("cadence.app")

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setHost(window.location.host)
        }
        fetchUser()
    }, [])

    // Sync state with store profile
    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || "")
            setUsername(profile.username || "")
            setIsPublic(profile.is_public || false)
        }
    }, [profile])

    const handleSaveProfile = async () => {
        setUsernameError("")

        if (isPublic && username.length < 3) {
            setUsernameError("Username must be at least 3 characters")
            return
        }

        setIsSaving(true)
        const supabase = createClient()

        const updates: any = {
            is_public: isPublic,
            full_name: fullName,
            updated_at: new Date().toISOString()
        }

        if (username.length >= 3) {
            updates.username = username.toLowerCase()
        }

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user?.id)

        setIsSaving(false)

        if (error) {
            if (error.code === '23505') {
                setUsernameError("Username is already taken")
                toast.error("Failed to save settings")
            } else {
                toast.error("Failed to update profile")
            }
        } else {
            // Update global store
            updateProfile({
                full_name: fullName,
                username: username,
                is_public: isPublic
            })
            toast.success("Profile updated successfully")
        }
    }

    const handleUpdatePassword = async () => {
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        setIsSavingPassword(true)
        const supabase = createClient()

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        setIsSavingPassword(false)

        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Password updated successfully")
            setNewPassword("")
            setConfirmPassword("")
        }
    }

    const publicUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/u/${username}`
        : `cadence.app/u/${username}`

    const copyUrl = () => {
        navigator.clipboard.writeText(publicUrl)
        toast.success("URL copied")
    }

    if (!user) {
        return <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    }

    return (
        <div className="space-y-8 p-6 lg:p-10 max-w-[1200px] mx-auto pb-20">
            <div>
                <h1 className="h1-hero tracking-tight text-foreground/90">Settings</h1>
                <p className="text-muted-foreground mt-2 body-comfortable">Manage your profile and security</p>
            </div>

            {/* Public Profile Card */}
            <Card className="saas-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-purple-400" />
                        Public Profile
                    </CardTitle>
                    <CardDescription>
                        Control your public &quot;High Impact&quot; showcase.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4">
                        <div className="space-y-0.5">
                            <label className="text-base font-medium">Enable Public Access</label>
                            <p className="text-sm text-muted-foreground">
                                Only &quot;High Impact&quot; entries are visible.
                            </p>
                        </div>
                        <Switch
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Username</label>
                        <div className="flex flex-col sm:flex-row rounded-md border border-input bg-transparent overflow-hidden focus-within:ring-1 focus-within:ring-ring">
                            <div className="flex items-center pl-3 pr-1 py-2 sm:py-0 bg-muted/30 border-b sm:border-b-0 sm:border-r border-border/50">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">{host}/u/</span>
                            </div>
                            <Input
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none pl-3 sm:pl-2 h-10 w-full"
                                placeholder="username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))
                                    setUsernameError("")
                                }}
                            />
                        </div>
                        {usernameError && (
                            <p className="text-xs text-red-500 font-medium ml-1">{usernameError}</p>
                        )}
                        {username && username.length >= 3 && !usernameError && isPublic && (
                            <div className="flex items-center gap-2 text-sm text-green-400 mt-2 bg-green-400/10 p-2 rounded-md border border-green-400/20">
                                <Globe className="h-3 w-3" />
                                <span className="truncate flex-1 hover:underline cursor-pointer" onClick={() => window.open(`/u/${username}`, '_blank')}>
                                    {publicUrl}
                                </span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyUrl}>
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Personal Info Card */}
            <Card className="saas-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-400" />
                        Personal Information
                    </CardTitle>
                    <CardDescription>
                        Update your identity across Cadence.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                            placeholder="Your Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="bg-transparent"
                        />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider pl-1">
                            Visible in Sidebar & Emails
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isSaving} variant="default" className="glow-hover w-full sm:w-auto">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Profile Changes
                </Button>
            </div>

            {/* Security Card */}
            <Card className="saas-card border-red-500/10 bg-red-950/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-red-400" />
                        Security
                    </CardTitle>
                    <CardDescription>
                        Manage your password and authentication.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-9 bg-transparent"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-9 bg-transparent"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={handleUpdatePassword}
                            disabled={isSavingPassword || !newPassword}
                            variant="destructive"
                            className="w-full sm:w-auto hover:bg-red-500/90"
                        >
                            {isSavingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
