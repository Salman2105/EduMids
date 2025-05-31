import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from "../components/ui/card";
import { Link } from "react-router-dom";
import Header from './Header';
import Team from '../components/Team';
import Impact from '../components/Impact';
import Footer from './Footer';
import Cta from '../components/Cta';

export default function AboutPage() {

  return (
    <>
      <Header />
      <Helmet>
        <title>About Us | EduMinds Learning Platform</title>
        <meta name="description" content="Learn about EduMinds - our mission, team, and vision for transforming online education with innovative learning experiences." />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">About EduMinds</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Transforming education through technology and innovation
          </p>
        </div>

        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Founded in 2020, EduMinds began with a simple mission: to make high-quality education accessible to everyone, regardless of location or background.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              What started as a small collection of courses has grown into a comprehensive learning platform with thousands of instructors and students from over 150 countries.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Today, we continue to innovate and expand our platform, always keeping our core mission at the heart of everything we do.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1516397281156-ca07cf9746fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500" 
              alt="Students learning online" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 md:p-12 mb-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              "To empower individuals worldwide through transformative education that breaks barriers and opens new opportunities."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <Card>
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">Accessibility</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-center">
                    Making quality education available to everyone, regardless of location or background.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">Innovation</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-center">
                    Continuously improving our platform and teaching methods to enhance learning outcomes.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">Community</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-center">
                    Building a supportive global community of learners and instructors who help each other grow.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Team />
        <Impact />
        <Cta/>
      </div>
      <Footer />
    </>
  );
}