import { X, Shield, Eye, Database, Lock, Users } from 'lucide-react';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicy({ isOpen, onClose }: PrivacyPolicyProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-800 p-6 flex items-center justify-between bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
              <p className="text-sm text-gray-400">Last updated: March 2026</p>
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
                  <Eye className="text-blue-500" size={20} />
                  Our Commitment to Privacy
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  At GoaXplore, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Database className="text-blue-500" size={20} />
                  Information We Collect
                </h3>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Personal Information</h4>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Name, email address, and phone number</li>
                      <li>Billing and payment information</li>
                      <li>Profile pictures and preferences</li>
                      <li>Communication history with our support team</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Usage Information</h4>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Booking history and preferences</li>
                      <li>Device information and IP address</li>
                      <li>Browser type and version</li>
                      <li>Pages visited and time spent on our platform</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">How We Use Your Information</h3>
                <div className="text-gray-300 leading-relaxed">
                  <p className="mb-3">We use the information we collect to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Process and manage your bookings</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Send important updates about your bookings</li>
                    <li>Improve our services and develop new features</li>
                    <li>Ensure platform security and prevent fraud</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              {/* Information Sharing */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="text-blue-500" size={20} />
                  Information Sharing and Disclosure
                </h3>
                <p className="text-gray-300 leading-relaxed mb-3">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 text-gray-300">
                  <li><strong>Service Providers:</strong> With verified activity providers to fulfill your bookings</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> With your explicit permission</li>
                </ul>
              </section>

              {/* Data Security */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Lock className="text-blue-500" size={20} />
                  Data Security
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, secure server infrastructure, and regular security audits.
                </p>
              </section>

              {/* Your Rights */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Your Rights and Choices</h3>
                <p className="text-gray-300 leading-relaxed mb-3">You have the right to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2 text-gray-300">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Receive your data in a structured format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
              </section>

              {/* Cookies */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Cookies and Tracking</h3>
                <p className="text-gray-300 leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences, though disabling cookies may affect platform functionality.
                </p>
              </section>

              {/* Third-Party Services */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Third-Party Services</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our platform may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external services. We encourage you to review their privacy policies before providing any personal information.
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Children's Privacy</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
                </p>
              </section>

              {/* Changes to Privacy Policy */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Changes to This Privacy Policy</h3>
                <p className="text-gray-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the updated policy.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
                <p className="text-gray-300 leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-3 p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-300">
                    <strong>Email:</strong> privacy@goaxplore.com<br />
                    <strong>Phone:</strong> +91 12345 67890<br />
                    <strong>Address:</strong> GoaXplore HQ, Panaji, Goa, India
                  </p>
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
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}