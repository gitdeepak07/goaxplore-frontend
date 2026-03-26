import { useState, useEffect } from 'react';
import { Target, Users, Award, Heart, Shield, Zap } from 'lucide-react';


export function AboutUs({ onExploreActivities }: { onExploreActivities: () => void }) {
  const [stats, setStats] = useState({ providers: '25+', activities: '50+', users: '10K+' });

  useEffect(() => {
    fetch('${API}/api/dashboard/admin')
      .then(r => r.json())
      .then(data => {
        setStats({
          providers: data.providers ? `${data.providers}+` : '25+',
          activities: data.activities ? `${data.activities}+` : '50+',
          users: data.users ? (data.users >= 1000 ? `${Math.floor(data.users/1000)}K+` : `${data.users}+`) : '10K+',
        });
      })
      .catch(() => {});
  }, []);
  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'We partner only with certified providers who follow strict safety protocols'
    },
    {
      icon: Award,
      title: 'Quality Service',
      description: 'Premium water sports experiences with top-rated equipment and guides'
    },
    {
      icon: Heart,
      title: 'Customer Satisfaction',
      description: 'Happy customers are our first priority'
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Quick and easy booking process with instant confirmation'
    }
  ];


  const team = [
    {
      name: 'Ashvini Dalavai',
      role: 'Founder & CEO',
      image: '/imgs/vini.jpeg',
      bio: '15+ years in adventure tourism'
    },
    {
      name: 'Deepak J',
      role: 'Operations Head',
      image: '/imgs/deepak.jpeg',
      bio: 'Expert in water sports safety'
    },
    {
      name: 'Aayush Pednekar',
      role: 'Customer Success',
      image: '/imgs/aayush.jpeg',
      bio: 'Dedicated to customer happiness'
    },
    {
      name: 'Aditya Vengurlekar',
      role: 'Marketing Director',
      image: '/imgs/aditya.jpeg',
      bio: 'Digital marketing specialist'
    },
    {
      name: 'Atharva Tilve',
      role: 'Technology Lead',
      image: '/imgs/atharv.jpeg',
      bio: 'Building seamless experiences'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-black via-gray-900 to-black" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">About GoaXplore</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your trusted companion for unforgettable water sports adventures in Goa
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-600/30 rounded-lg p-8">
            <div className="flex items-center mb-4">
              <Target size={32} className="text-red-500 mr-3" />
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To make water sports accessible, safe, and enjoyable for everyone visiting Goa. We connect adventure seekers with the best verified providers, ensuring every experience is memorable and secure. Our platform simplifies booking while maintaining the highest safety standards in the industry.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-600/30 rounded-lg p-8">
            <div className="flex items-center mb-4">
              <Users size={32} className="text-blue-500 mr-3" />
              <h3 className="text-2xl font-bold text-white">Our Vision</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To become India's leading water sports booking platform, setting new standards for safety, quality, and customer satisfaction. We envision a future where every beach lover can easily discover and book thrilling water adventures with complete peace of mind.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500 mb-2">{stats.providers}</div>
            <p className="text-gray-400">Verified Providers</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500 mb-2">{stats.activities}</div>
            <p className="text-gray-400">Water Activities</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500 mb-2">15+</div>
            <p className="text-gray-400">Beach Locations</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500 mb-2">{stats.users}</div>
            <p className="text-gray-400">Happy Customers</p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Why Choose Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center hover:border-red-600 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon size={32} className="text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{value.title}</h4>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-lg p-8 mb-16">
          <h3 className="text-3xl font-bold text-white mb-6">Our Story</h3>
          <div className="text-gray-300 space-y-4">
            <p>
              GoaXplore was born from a passion for adventure and a vision to make water sports safe and accessible for everyone. Founded in 2020 by a group of adventure enthusiasts and tech entrepreneurs, we recognized the need for a reliable platform that connects thrill-seekers with certified water sports providers in Goa.
            </p>
            <p>
              What started as a small initiative with just 5 providers has now grown into Goa's most trusted water sports booking platform, partnering with over 25 verified operators across 15+ beach locations. Our commitment to safety, quality, and customer satisfaction has helped thousands of visitors create unforgettable memories on Goa's beautiful coastline.
            </p>
            <p>
              Today, we continue to innovate and expand our services, introducing new activities, partnering with the best providers, and leveraging technology to make your booking experience seamless. Whether you're a first-time visitor or a seasoned water sports enthusiast, GoaXplore is here to make your Goa adventure extraordinary.
            </p>
          </div>
        </div>

        {/* Team */}
        <div>
          <h3 className="text-3xl font-bold text-white text-center mb-12">Meet Our Team</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
                <p className="text-red-600 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-600/50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Adventure?</h3>
            <p className="text-gray-300 mb-6">
              Join thousands of satisfied customers who trust GoaXplore for their water sports experiences
            </p>
            <button
              onClick={onExploreActivities}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md transition-colors font-semibold text-lg"
            >
              Explore Activities
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}