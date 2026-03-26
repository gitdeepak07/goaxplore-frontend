import { X, Shield, AlertTriangle, Users, Heart, CheckCircle } from 'lucide-react';

interface SafetyGuidelinesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SafetyGuidelines({ isOpen, onClose }: SafetyGuidelinesProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-800 p-6 flex items-center justify-between bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-900/20">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Safety Guidelines</h2>
              <p className="text-sm text-gray-400">Your safety is our top priority</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Heart className="text-green-500" size={20} />
                  Our Safety Commitment
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  At GoaXplore, safety is our highest priority. We partner only with certified providers who maintain the highest safety standards. Our comprehensive safety guidelines ensure that every water sports experience is safe, enjoyable, and memorable.
                </p>
              </section>

              {/* Provider Verification */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={20} />
                  Verified Providers
                </h3>
                <div className="text-gray-300 leading-relaxed space-y-3">
                  <p>
                    All activity providers on GoaXplore undergo rigorous verification and certification processes:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Background checks and criminal record verification</li>
                    <li>Equipment inspection and maintenance certification</li>
                    <li>Emergency response training and certification</li>
                    <li>Insurance coverage verification</li>
                    <li>Regular safety audits and compliance checks</li>
                  </ul>
                </div>
              </section>

              {/* Equipment Standards */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Equipment Standards</h3>
                <div className="text-gray-300 leading-relaxed space-y-3">
                  <p>
                    We ensure all equipment meets international safety standards:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Life Jackets:</strong> Coast Guard approved, properly fitted</li>
                    <li><strong>Watercraft:</strong> Regular maintenance and safety inspections</li>
                    <li><strong>Communication:</strong> VHF radios and emergency signaling devices</li>
                    <li><strong>First Aid:</strong> Fully equipped kits and trained personnel</li>
                    <li><strong>Weather Monitoring:</strong> Real-time weather tracking and safety protocols</li>
                  </ul>
                </div>
              </section>

              {/* Participant Guidelines */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="text-green-500" size={20} />
                  Participant Safety Guidelines
                </h3>
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-yellow-500 mt-1" size={20} />
                    <div>
                      <h4 className="text-yellow-300 font-semibold mb-2">Important Health & Safety Requirements</h4>
                      <ul className="text-yellow-200 text-sm space-y-1">
                        <li>• Must be able to swim 50 meters without assistance</li>
                        <li>• No medical conditions that could be aggravated by water activities</li>
                        <li>• Not under the influence of alcohol or drugs</li>
                        <li>• Comfortable in open water environments</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-gray-300 leading-relaxed space-y-3">
                  <h4 className="text-lg font-semibold text-white">Before Your Activity:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Inform your guide about any medical conditions or concerns</li>
                    <li>Follow all pre-activity briefings and safety instructions</li>
                    <li>Wear appropriate clothing and footwear</li>
                    <li>Stay hydrated and eat appropriately before activities</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-white mt-4">During Your Activity:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Always follow your guide's instructions</li>
                    <li>Stay within designated activity areas</li>
                    <li>Use safety equipment as provided</li>
                    <li>Communicate any discomfort or concerns immediately</li>
                  </ul>
                </div>
              </section>

              {/* Age and Ability Guidelines */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Age and Ability Guidelines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-3">Minimum Age Requirements</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li><strong>Beach Activities:</strong> 8 years</li>
                      <li><strong>Boat Tours:</strong> 12 years</li>
                      <li><strong>Water Sports:</strong> 16 years</li>
                      <li><strong>Advanced Activities:</strong> 18 years</li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-3">Skill Level Requirements</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li><strong>Beginner:</strong> No experience needed</li>
                      <li><strong>Intermediate:</strong> Basic swimming skills</li>
                      <li><strong>Advanced:</strong> Prior water sports experience</li>
                      <li><strong>Expert:</strong> Professional certification</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Weather and Environmental Safety */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Weather and Environmental Safety</h3>
                <div className="text-gray-300 leading-relaxed space-y-3">
                  <p>
                    Activities are weather-dependent and may be cancelled or modified based on conditions:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong>High Winds:</strong> Speed above 20 knots may cancel activities</li>
                    <li><strong>Heavy Rain:</strong> Reduced visibility affects safety</li>
                    <li><strong>Strong Currents:</strong> Ocean conditions are continuously monitored</li>
                    <li><strong>Lightning:</strong> Immediate evacuation to safe areas</li>
                  </ul>
                  <p className="text-yellow-300 font-semibold">
                    All activities include weather monitoring and the right to cancel for safety reasons.
                  </p>
                </div>
              </section>

              {/* Emergency Procedures */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Emergency Procedures</h3>
                <div className="text-gray-300 leading-relaxed space-y-3">
                  <p>
                    Our providers are trained in emergency response and equipped with:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Emergency Communication:</strong> Direct line to coast guard and medical services</li>
                    <li><strong>Medical Training:</strong> CPR and first aid certification for all guides</li>
                    <li><strong>Evacuation Plans:</strong> Multiple emergency exit strategies</li>
                    <li><strong>Medical Facilities:</strong> Access to nearby hospitals and medical centers</li>
                  </ul>
                </div>
              </section>

              {/* Insurance and Liability */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Insurance and Liability</h3>
                <p className="text-gray-300 leading-relaxed">
                  All GoaXplore providers carry comprehensive insurance coverage including participant liability, equipment damage, and medical evacuation. Our platform acts as a facilitator and maintains additional insurance layers to protect all participants.
                </p>
              </section>

              {/* Reporting Safety Concerns */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Reporting Safety Concerns</h3>
                <p className="text-gray-300 leading-relaxed mb-3">
                  Your safety and feedback are important to us. If you experience or witness any safety concerns:
                </p>
                <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                  <p className="text-red-300 font-semibold mb-2">Report Immediately:</p>
                  <ul className="text-red-200 space-y-1">
                    <li>• Contact your activity guide directly</li>
                    <li>• Call our 24/7 safety hotline: +91 98765 43210</li>
                    <li>• Email: safety@goaxplore.com</li>
                    <li>• Use the in-app emergency button during activities</li>
                  </ul>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Safety Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">Emergency Contacts</h4>
                    <p className="text-gray-300 text-sm">
                      <strong>24/7 Safety Hotline:</strong> +91 98765 43210<br />
                      <strong>Coast Guard:</strong> 1554<br />
                      <strong>Medical Emergency:</strong> 108
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-2">General Inquiries</h4>
                    <p className="text-gray-300 text-sm">
                      <strong>Email:</strong> safety@goaxplore.com<br />
                      <strong>Phone:</strong> +91 12345 67890<br />
                      <strong>Address:</strong> GoaXplore HQ, Panaji, Goa
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4 bg-gray-800/30">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}