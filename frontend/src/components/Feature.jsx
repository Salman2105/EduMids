import React from 'react'
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Feature() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10 fade-in">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-accent">
            Featured Courses
          </h2>
          <Link to="/courses">
            <Button
              variant="link"
              className="text-primary hover:text-primary-light dark:hover:text-primary-light flex items-center font-medium"
            >
              View All Courses
              <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </Link>
        </div>
        {/* Add featured course cards here */}
      </div>
    </section>
  )
}
