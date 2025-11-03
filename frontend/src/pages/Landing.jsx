import Header from "../components/Landingheader"
import HeroSection from "../components/hero-section"
import FeaturesSection from "../components/features-section"
import Footer from "../components/footer"
import '../styles/global.css'
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </main>
  )
}


