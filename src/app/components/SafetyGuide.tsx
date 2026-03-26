import { AlertTriangle, CheckCircle } from 'lucide-react';

export function SafetyGuide() {
  const safeLocations = [
    'Baga Beach - Ideal for jet skiing and parasailing',
    'Calangute Beach - Perfect for beginners',
    'Anjuna Beach - Great for kayaking and windsurfing',
    'Palolem Beach - Safe shallow waters for scuba diving',
    'Candolim Beach - Professional operators and equipment'
  ];

  const avoidLocations = [
    'Rocky coastlines during monsoon season',
    'Areas marked with red flags',
    'Unguarded beaches after sunset',
    'Locations without certified operators',
    'Rough waters during high tide warnings'
  ];

  return (
    <section className="py-16 bg-black" id="locations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-4 text-center">Water Sports Safety Guide</h2>
        <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto">
          Your safety is our priority. Know where to explore and where to avoid for the best water sports experience in Goa.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Safe Locations */}
          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-600/30 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <CheckCircle size={32} className="text-green-500 mr-3" />
              <h3 className="text-2xl font-bold text-white">Where to Explore</h3>
            </div>
            <ul className="space-y-4">
              {safeLocations.map((location, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">{location}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations to Avoid */}
          <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-600/30 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <AlertTriangle size={32} className="text-red-500 mr-3" />
              <h3 className="text-2xl font-bold text-white">Where NOT to Explore</h3>
            </div>
            <ul className="space-y-4">
              {avoidLocations.map((location, index) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle size={20} className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">{location}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6">
          <p className="text-yellow-200 text-center">
            <strong>Pro Tip:</strong> Always book with verified providers, check weather conditions, and ensure you have proper safety gear before any water sport activity.
          </p>
        </div>
      </div>
    </section>
  );
}
