/**
 * Claude Debug Copilot - Marketing Website
 * Main landing page with Hero, How It Works, Features, and Footer
 * Phase C React Implementation
 */

import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { UIStateProvider } from './contexts/UIStateContext';
import Layout from './components/Layout';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Footer from './components/Footer';
import './styles/layout.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/how-it-works.css';
import './styles/features.css';
import './styles/footer.css';

export default function WebsiteApp() {
  return (
    <ThemeProvider>
      <UIStateProvider>
        <Layout>
          <a href="#main" className="skip-link">
            Skip to main content
          </a>

          <Header />

          <main id="main">
            <Hero />
            <HowItWorks />
            <Features />
          </main>

          <Footer />
        </Layout>
      </UIStateProvider>
    </ThemeProvider>
  );
}
