import React from 'react'
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
function Cta() {
  return (
    <div>
      <section className="py-20 hero-gradient bg-blue-500 mb-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-accent fade-in">
            Start Your Learning Journey Today
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 fade-in">
            Join thousands of students from around the world and transform your career with our expert-led courses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 slide-up">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 py-6 shadow-lg font-medium text-lg transition transform hover:-translate-y-1 hover:shadow-xl"
              asChild
            >
              <Link href="/auth/register">
                Get Started
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 py-6 font-medium text-lg transition hover:scale-105"
              asChild
            >
              <Link href="/courses">
                Explore Courses
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Cta
