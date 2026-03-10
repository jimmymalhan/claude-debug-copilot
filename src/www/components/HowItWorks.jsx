import React, { useEffect, useRef } from 'react';
import '../styles/how-it-works.css';

export default function HowItWorks() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe section heading
    const heading = sectionRef.current?.querySelector('h2');
    if (heading) observer.observe(heading);

    // Observe cards
    const cards = sectionRef.current?.querySelectorAll('.step-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: 1,
      title: 'Paste Your Incident',
      description: 'Describe what happened - any details help. Include logs, timestamps, or error messages.',
      icon: '📋',
    },
    {
      number: 2,
      title: 'AI Analyzes Evidence',
      description: 'Our 4-agent pipeline classifies the failure, gathers evidence, and generates competing theories.',
      icon: '🔍',
    },
    {
      number: 3,
      title: 'Get Root Cause',
      description: 'Receive evidence-backed diagnosis with confidence score, proof citations, and verified fix.',
      icon: '✅',
    },
    {
      number: 4,
      title: 'Execute Fix & Verify',
      description: 'Deploy fix with test plan. Verify recovery and document for future learning.',
      icon: '🚀',
    },
  ];

  return (
    <section className="how-it-works" id="how-it-works" ref={sectionRef} role="region" aria-label="How it works">
      <div className="container">
        <h2 className="section-heading">How It Works</h2>
        <p className="section-subheading">
          Four simple steps from problem to solution
        </p>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="step-card"
              style={{ animationDelay: `${index * 0.1}s` }}
              role="region"
              aria-label={`Step ${step.number}: ${step.title}`}
            >
              {/* Step icon */}
              <div className="step-icon" aria-hidden="true">
                {step.icon}
              </div>

              {/* Step number and connector line */}
              <div className="step-number">{step.number}</div>
              {index < steps.length - 1 && <div className="step-connector" aria-hidden="true"></div>}

              {/* Step content */}
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Feature highlights */}
        <div className="highlights">
          <div className="highlight-item">
            <span className="highlight-icon">⚡</span>
            <span className="highlight-text">Fast: 16-30 seconds end-to-end</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">🎯</span>
            <span className="highlight-text">Accurate: 94% confidence scoring</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">🔒</span>
            <span className="highlight-text">Reliable: Production-grade with retries</span>
          </div>
        </div>
      </div>
    </section>
  );
}
