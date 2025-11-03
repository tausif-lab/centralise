"use client"

import { Button } from "./ui/button"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted py-20 sm:py-32 lg:py-40">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance text-foreground leading-tight">
                Your Verified Digital Record,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  All in One Place
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Centralized student activity tracking platform that brings clarity, verification, and insights to your
                academic journey.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5 rounded-full px-8 bg-transparent"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <p className="text-3xl font-bold text-primary">10K+</p>
                <p className="text-sm text-muted-foreground">Active Students</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Institutions</p>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative h-96 sm:h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-2xl" />
            <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl max-w-sm w-full">
              <div className="space-y-4">
                <div className="h-3 bg-primary/20 rounded w-24" />
                <div className="space-y-2">
                  <div className="h-2 bg-muted rounded" />
                  <div className="h-2 bg-muted rounded w-5/6" />
                </div>
                <div className="pt-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-2 bg-muted rounded w-24" />
                      <div className="h-2 bg-muted rounded w-16" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-2 bg-muted rounded w-32" />
                      <div className="h-2 bg-muted rounded w-20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
