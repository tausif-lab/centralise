"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

const features = [
  {
    title: "Dashboard",
    description: "Comprehensive overview of all your activities, achievements, and progress in real-time.",
    icon: "📊",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Activity Tracker",
    description: "Automatically log and categorize all academic and co-curricular activities with timestamps.",
    icon: "✓",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    title: "Faculty Approval",
    description: "Get your activities verified and approved by faculty members for authentic records.",
    icon: "✍️",
    gradient: "from-primary/20 to-accent/10",
  },
  {
    title: "AI Insights",
    description: "Receive personalized recommendations and insights to enhance your academic profile.",
    icon: "🧠",
    gradient: "from-accent/20 to-primary/10",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Powerful Features for Your Success
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage, track, and verify your academic journey in one unified platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-border bg-card hover:shadow-lg transition-shadow duration-300 group"
            >
              <CardHeader className="space-y-4">
                <div
                  className={`h-14 w-14 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-6">Ready to transform your academic record?</p>
          <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold">
            Start Your Journey
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  )
}
