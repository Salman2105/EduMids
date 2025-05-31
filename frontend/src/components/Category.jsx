import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "../components/ui/button";


export default function Category() {
  return (
    <div>
     <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6 font-accent fade-in">
            Explore Categories
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 fade-in">
            Browse our wide selection of courses across different categories and find the perfect fit for your learning goals
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Category cards go here */}
          </div>
           <div className="text-center mt-10">
            <Button 
              asChild
              className="mt-8 px-8 py-6 text-lg bg-blue-500 hover:bg-primary-light dark:bg-primary dark:hover:bg-primary-light transition-all duration-300 transform hover:scale-105 zoom-in"
            >
              <Link href="/courses">
                View All Categories
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
     
  )
}
