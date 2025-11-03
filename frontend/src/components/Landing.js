import React, { useState, useEffect } from 'react';
import { Activity, BarChart3, CheckCircle, Sparkles, Menu, X, ChevronRight, Award, Users, TrendingUp } from 'lucide-react';
import './Landing.css';

const Landing = ({ onNavigate = () => {} }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <BarChart3 className="feature-icon" />,
      title: "Dashboard",
      description: "View all your activities, achievements, and progress at a glance with intuitive visualizations"
    },
    {
      icon: <Activity className="feature-icon" />,
      title: "Activity Tracker",
      description: "Log and manage all your co-curricular and extracurricular activities in real-time"
    },
    {
      icon: <CheckCircle className="feature-icon" />,
      title: "Faculty Approval",
      description: "Get instant verification from faculty members for authentic, credible records"
    },
    {
      icon: <Sparkles className="feature-icon" />,
      title: "AI Insights",
      description: "Receive personalized recommendations and insights powered by advanced AI analytics"
    }
  ];

  const stats = [
    { icon: <Users />, value: "10,000+", label: "Active Students" },
    { icon: <Award />, value: "50,000+", label: "Verified Records" },
    { icon: <TrendingUp />, value: "500+", label: "Partner Institutions" }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="logo-section">
            <div className="logo-icon">
              <Activity />
            </div>
            <span className="logo-text">Beyond Records</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="nav-links desktop-nav">
            <a href="#features" className="nav-link">Features</a>
            <a href="#benefits" className="nav-link">Benefits</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>

          <div className="nav-actions desktop-nav">
            <button className="btn-secondary" onClick={() => onNavigate('login')}>Login</button>
            <button className="btn-primary" onClick={() => onNavigate('register')}>Get Started</button>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <a href="#features" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#benefits" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Benefits</a>
            <a href="#contact" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Contact</a>
            <div className="mobile-nav-actions">
              <button className="btn-secondary full-width" onClick={() => onNavigate('login')}>Login</button>
              <button className="btn-primary full-width" onClick={() => onNavigate('register')}>Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles className="badge-icon" />
              <span>Trusted by 10,000+ Students</span>
            </div>
            
            <h1 className="hero-title">
              Your Verified Digital Record,
              <span className="gradient-text"> All in One Place</span>
            </h1>
            
            <p className="hero-subtitle">
              Track, verify, and showcase your academic achievements with Beyond Records. 
              A centralized platform that transforms how students manage their activities and build their portfolios.
            </p>
            
            <div className="hero-actions">
              <button className="btn-hero-primary" onClick={() => onNavigate('register')}>
                Start Free Today
                <ChevronRight className="btn-icon" />
              </button>
              <button className="btn-hero-secondary" onClick={() => onNavigate('dashboard')}>
                View Demo
              </button>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="mockup-content">
                <div className="mockup-card card-1">
                  <div className="card-icon"><BarChart3 /></div>
                  <div className="card-title">Dashboard Overview</div>
                  <div className="card-chart"></div>
                </div>
                <div className="mockup-card card-2">
                  <div className="card-icon"><Activity /></div>
                  <div className="card-title">Activity Timeline</div>
                  <div className="card-list">
                    <div className="list-item"></div>
                    <div className="list-item"></div>
                    <div className="list-item"></div>
                  </div>
                </div>
                <div className="mockup-card card-3">
                  <div className="card-icon"><CheckCircle /></div>
                  <div className="card-title">Verification Status</div>
                  <div className="card-progress"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">Everything you need to manage and showcase your academic journey</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2 className="benefits-title">Why Choose Beyond Records?</h2>
              <div className="benefit-item">
                <CheckCircle className="check-icon" />
                <div>
                  <h4>Verified Credentials</h4>
                  <p>All activities are verified by faculty members ensuring authenticity</p>
                </div>
              </div>
              <div className="benefit-item">
                <CheckCircle className="check-icon" />
                <div>
                  <h4>Comprehensive Portfolio</h4>
                  <p>Generate professional portfolios showcasing all your achievements</p>
                </div>
              </div>
              <div className="benefit-item">
                <CheckCircle className="check-icon" />
                <div>
                  <h4>AI-Powered Insights</h4>
                  <p>Get personalized recommendations to enhance your academic profile</p>
                </div>
              </div>
              <div className="benefit-item">
                <CheckCircle className="check-icon" />
                <div>
                  <h4>Easy Access Anywhere</h4>
                  <p>Access your records from any device, anytime, anywhere</p>
                </div>
              </div>
            </div>
            <div className="benefits-visual">
              <div className="floating-card">
                <Activity className="floating-icon" />
                <span>Real-time Updates</span>
              </div>
              <div className="floating-card">
                <CheckCircle className="floating-icon" />
                <span>Instant Verification</span>
              </div>
              <div className="floating-card">
                <Sparkles className="floating-icon" />
                <span>AI Recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">Join thousands of students already using Beyond Records</p>
            <div className="cta-actions">
              <button className="btn-cta-primary" onClick={() => onNavigate('register')}>
                Create Free Account
                <ChevronRight className="btn-icon" />
              </button>
              <button className="btn-cta-secondary" onClick={() => onNavigate('login')}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-icon">
                  <Activity />
                </div>
                <span className="logo-text">Beyond Records</span>
              </div>
              <p className="footer-description">
                Empowering students to track, verify, and showcase their academic achievements.
              </p>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Product</h4>
              <a href="#features" className="footer-link">Features</a>
              <a href="#benefits" className="footer-link">Benefits</a>
              <a href="#" className="footer-link">Pricing</a>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Company</h4>
              <a href="#" className="footer-link">About Us</a>
              <a href="#contact" className="footer-link">Contact</a>
              <a href="#" className="footer-link">Careers</a>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Legal</h4>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Beyond Records. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;