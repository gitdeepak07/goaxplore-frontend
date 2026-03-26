import { Waves, Users, Calendar, Shield } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Waves,
      number: 1,
      title: 'Choose Activity',
      description: 'Browse and select your favorite water sport'
    },
    {
      icon: Users,
      number: 2,
      title: 'Select Provider',
      description: 'Pick from verified and trusted providers'
    },
    {
      icon: Calendar,
      number: 3,
      title: 'Pick Your Date',
      description: 'Choose a convenient time slot'
    },
    {
      icon: Shield,
      number: 4,
      title: 'Pay Securely',
      description: 'Complete booking with safe payment'
    }
  ];

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center relative">
              <div className="mb-6 relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto">
                  <step.icon size={40} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-600 font-bold">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-red-600 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
