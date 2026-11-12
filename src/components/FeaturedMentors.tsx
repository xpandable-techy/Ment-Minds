import React from 'react';

// Static mentor data — pictures stored in public/mentors/
const MENTORS = [
  {
    id: 'salmabizi',
    name: 'Salma Bizi',
    photo: '/mentors/salma.jpg',
    description: 'Award-winning spoken word artist and coach empowering girls and young leaders through storytelling and confidence-building.',
  },
  {
    id: 'abdulmalik',
    name: 'Abdulmalik Yahya',
    photo: '/mentors/abdulmalik.jpg',
    description: 'Renowned punsmith and storyteller teaching confident communication, humour, and authentic self-expression.',
  },
  {
    id: 'idrisabba',
    name: 'Abba Musa Idris',
    photo: '/mentors/abba.jpg',
    description: 'Media practitioner and youth journalism mentor helping young voices report with integrity and impact.',
  },
  {
    id: 'sajuda',
    name: 'Sajuda Mahmud',
    photo: '/mentors/sajuda.jpg',
    description: 'Youth advocate mentoring young leaders on advocacy, civic engagement, and community storytelling.',
  },
  {
    id: 'sumayya',
    name: 'Sumayya Abdullahi Hussaini',
    photo: '/mentors/sumayya.jpg',
    description: 'Policy advocate guiding young changemakers through governance, civic literacy, and ethical leadership.',
  },
  {
    id: 'ameer',
    name: 'Ameer Saeed',
    photo: '/mentors/ameer.jpg',
    description: 'Youth leadership coach helping young people develop confidence, direction, and impact-driven communication.',
  },
  {
    id: 'hadiza',
    name: 'Dr. Hadiza Shettima',
    photo: '/mentors/hadiza.jpg',
    description: 'Sustainability expert supporting young women in agribusiness, science, and entrepreneurship.',
  },
  {
    id: 'shamsuddeen',
    name: 'Shamsuddeen Jibril',
    photo: '/mentors/shamsuddeen.jpg',
    description: 'Tech founder advising young innovators on robotics, aerospace, and building impact-driven startups.',
  },
];

export const FeaturedMentors: React.FC = () => {
  return (
    <section id="mentors" className="py-20 bg-white border-b-4 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* SECTION HEADER */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-1 bg-[#B87E13]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#B87E13]">
              Meet the Team
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-[#0C1836] tracking-tight mt-1">
            Our Mentors
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2 font-medium max-w-2xl">
            Experienced voices guiding the next generation of youth leaders across Nigeria.
          </p>
        </div>

        {/* MENTORS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {MENTORS.map((mentor) => (
            <div
              key={mentor.id}
              className="flex flex-col items-center text-center group"
            >
              {/* PHOTO */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-[#0B6291]/20 group-hover:ring-[#0B6291] transition-all duration-300 mb-3 shadow-md">
                <img
                  src={mentor.photo}
                  alt={mentor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=0B6291&color=fff&size=128`;
                  }}
                />
              </div>

              {/* NAME */}
              <h3 className="font-black text-sm text-[#0C1836] font-['Outfit'] leading-snug mb-1">
                {mentor.name}
              </h3>

              {/* SHORT DESCRIPTION */}
              <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3 max-w-[180px]">
                {mentor.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
