import React from 'react'

export default function Team() {
    const teamMembers = [
    {
      name: 'SALMAN AHMED',
      position: 'CEO & Founder',
      bio: 'With over 1 years of experience in education and technology, SALMAN founded EduMinds with a vision to make quality education accessible to everyone.',
      imageUrl: '/assets/2.jpg'
    },
    {
      name: 'Michael Chen',
      position: 'Chief Academic Officer',
      bio: 'Previously a university professor, Michael oversees course quality and academic standards at EduMinds.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'
    }

  ];
  return (
    <div>
      <div className="mb-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
                <div className="h-60 overflow-hidden">
                  <img 
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-4">{member.position}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}
