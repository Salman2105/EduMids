import React from 'react'

export default function Impact() {
  return (
    <div>
      {/* bg-primary/5 */}
       <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 md:p-12 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Since our founding, we've made a significant impact on education worldwide.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-primary text-4xl md:text-5xl font-bold mb-2">50K+</p>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Students</p>
            </div>
            <div className="text-center">
              <p className="text-primary text-4xl md:text-5xl font-bold mb-2">200+</p>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Instructors</p>
            </div>
            <div className="text-center">
              <p className="text-primary text-4xl md:text-5xl font-bold mb-2">500+</p>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Courses</p>
            </div>
            <div className="text-center">
              <p className="text-primary text-4xl md:text-5xl font-bold mb-2">150+</p>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Countries</p>
            </div>
          </div>
        </div>
    </div>
  )
}
