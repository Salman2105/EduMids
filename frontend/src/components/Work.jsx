import React from 'react';

export default function Work() {
  return (
   <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Getting started with EduMinds services is simple. Follow these steps to begin your learning journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Create an Account</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Sign up for a free account to access our platform and explore available options.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Choose a Course</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Browse through our range of Courses and select what best fits your learning needs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Select a Plan</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Choose from our flexible pricing plans - from monthly subscription to one-time purchases.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Start Learning</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Begin your learning journey immediately with instant access to your selected services.
              </p>
            </div>
          </div>
        </div>
  );
}
