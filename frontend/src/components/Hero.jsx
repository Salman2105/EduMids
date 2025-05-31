import React from 'react'
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const Hero = () => {
  return (
    
      <div className="pb-16 bg-blue-500">
      {/* Hero Section */}
      <section className="relative hero-gradient py-20">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-accent">Your Pathway to Knowledge</h1>
            <p className="text-xl mb-8 opacity-90">Discover courses taught by industry experts and expand your skills with hands-on learning experiences.</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                className="bg-white text-blue-500 hover:bg-gray-100 py-6 shadow-md font-medium transition transform hover:-translate-y-1"
                asChild
              >
                <Link href="/courses">
                  Explore Courses
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-blue/10 py-6 font-medium transition"
                asChild
              >
                <Link href="../../pages/auth/signup">
                  Sign Up Free
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            {/* Students collaborating on a digital learning platform */}
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Students collaborating on digital platform" 
              className="rounded-xl shadow-2xl relative z-10 h-auto w-full"
            />
            <div className="absolute -bottom-4 -right-4 h-full w-full bg-secondary/20 rounded-xl z-0"></div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
