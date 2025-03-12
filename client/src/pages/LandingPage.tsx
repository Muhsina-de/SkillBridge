import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect with Expert Mentors<br />
            <span className="text-blue-600">Accelerate Your Growth</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            SkillBridge connects you with experienced mentors who can help you level up your skills and advance your career.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/mentors"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Find a Mentor
            </Link>
            <Link
              to="/signup"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SkillBridge?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Expert Mentors"
              description="Connect with industry professionals who have proven track records."
              icon="👨‍🏫"
            />
            <FeatureCard
              title="Flexible Sessions"
              description="Book sessions that fit your schedule and learning pace."
              icon="📅"
            />
            <FeatureCard
              title="Verified Reviews"
              description="Make informed decisions with authentic mentor reviews."
              icon="⭐"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <StepCard
              number={1}
              title="Browse Mentors"
              description="Explore our curated list of expert mentors."
            />
            <StepCard
              number={2}
              title="Choose Your Mentor"
              description="Select based on skills, reviews, and availability."
            />
            <StepCard
              number={3}
              title="Book a Session"
              description="Schedule a time that works for both of you."
            />
            <StepCard
              number={4}
              title="Start Learning"
              description="Meet your mentor and accelerate your growth."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">Join SkillBridge today and take the next step in your career.</p>
          <Link
            to="/signup"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition inline-block"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

// Helper Components
const FeatureCard: React.FC<{ title: string; description: string; icon: string }> = ({
  title,
  description,
  icon,
}) => (
  <div className="p-6 bg-gray-50 rounded-xl text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StepCard: React.FC<{ number: number; title: string; description: string }> = ({
  number,
  title,
  description,
}) => (
  <div className="relative">
    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default LandingPage; 