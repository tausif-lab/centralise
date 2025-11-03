"use client"

import { Button } from "./ui/button"

export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              BR
            </div>
            <span className="text-xl font-bold text-foreground">Beyond Records</span>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-foreground hover:bg-muted">
              Login
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Register</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
