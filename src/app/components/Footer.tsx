import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

interface FooterProps {
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
  onSafetyClick?: () => void;
  onNavigate?: (section: string) => void;
  onBecomeProvider?: () => void;
  onListActivity?: () => void;
  onAffiliateProgram?: () => void;
}

export function Footer({ onTermsClick, onPrivacyClick, onSafetyClick, onNavigate, onBecomeProvider, onListActivity, onAffiliateProgram }: FooterProps) {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Goa<span className="text-red-600">Xplore</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Your trusted platform for sports adventures in Goa. Safe, verified, and unforgettable experiences.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate?.('services')}
                  className="text-gray-400 hover:text-red-600 text-sm transition-colors text-left"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('providers')}
                  className="text-gray-400 hover:text-red-600 text-sm transition-colors text-left"
                >
                  Providers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('about')}
                  className="text-gray-400 hover:text-red-600 text-sm transition-colors text-left"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Partner With Us</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onBecomeProvider}
                  className="text-gray-400 hover:text-red-600 text-sm transition-colors text-left"
                >
                  Become a Provider
                </button>
              </li>
              <li>
                <button
                  onClick={onListActivity}
                  className="text-gray-400 hover:text-red-600 text-sm transition-colors text-left"
                >
                  List Your Activity
                </button>
              </li>
              <li>
                <button
                  onClick={onAffiliateProgram}
                  className="text-gray-400 hover:text-red-600 text-sm transition-colors text-left"
                >
                  Affiliate Program
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Terms & Privacy</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onTermsClick}
                  className="text-gray-400 hover:text-red-600 text-sm transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={onPrivacyClick}
                  className="text-gray-400 hover:text-red-600 text-sm transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onSafetyClick}
                  className="text-gray-400 hover:text-red-600 text-sm transition-colors text-left"
                >
                  Safety Guidelines
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2026 GoaXplore. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
