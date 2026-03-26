import { X, FileText, Shield, Users, CreditCard, AlertTriangle } from 'lucide-react';

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsOfService({ isOpen, onClose }: TermsOfServiceProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-800 p-6 flex items-center justify-between bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20">
              <FileText size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Terms of Service</h2>
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
                  <Shield className="text-red-500" size={20} />
                  Agreement to Terms
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  By accessing and using GoaXplore ("we," "us," or "our"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              {/* User Accounts */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="text-red-500" size={20} />
                  User Accounts
                </h3>
                <div className="text-gray-300 leading-relaxed space-y-3">
                  <p>
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
                  </p>
                  <p>
                    You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                  </p>
                </div>
              </section>

              {/* Booking and Payments */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="text-red-500" size={20} />
                  Booking and Payment Terms
                </h3>
                <div className="text-gray-300 leading-relaxed space-y-3">
                  <p>
                    All bookings are subject to availability and confirmation. Prices are subject to change without notice. Payment must be made in full at the time of booking unless otherwise specified.
                  </p>
                  <p>
                    Cancellations and refunds are subject to the specific activity provider's cancellation policy. GoaXplore acts as a platform and is not responsible for provider-specific policies.
                  </p>
                  <p>
                    You agree to pay all charges associated with your account, including applicable taxes, at the prices in effect when such charges are incurred.
                  </p>
                </div>
              </section>

              {/* Prohibited Uses */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-red-500" size={20} />
                  Prohibited Uses
                </h3>
                <div className="text-gray-300 leading-relaxed">
                  <p>You may not use our service:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                    <li>To upload or transmit viruses or any other type of malicious code</li>
                    <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  </ul>
                </div>
              </section>

              {/* Service Availability */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Service Availability</h3>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to withdraw or amend our service, and any service or material we provide on the service, in our sole discretion without notice. We will not be liable if for any reason all or any part of the service is unavailable at any time or for any period.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Limitation of Liability</h3>
                <p className="text-gray-300 leading-relaxed">
                  In no event shall GoaXplore, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
                </p>
              </section>

              {/* Termination */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Termination</h3>
                <p className="text-gray-300 leading-relaxed">
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will cease immediately.
                </p>
              </section>

              {/* Changes to Terms */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Changes to Terms</h3>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
                <p className="text-gray-300 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-3 p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-300">
                    <strong>Email:</strong> legal@goaxplore.com<br />
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
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}