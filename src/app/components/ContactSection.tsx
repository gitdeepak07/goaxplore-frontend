import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    try {
      const res = await fetch('${API}/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">Contact Us</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about our water sports activities? Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-400 text-sm">
                  Message sent! We'll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
                  Failed to send. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Send size={18} />
                {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Get in touch</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Phone</h4>
                    <p className="text-gray-400">+91 98765 43210</p>
                    <p className="text-gray-400">+91 98765 43211</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Email</h4>
                    <p className="text-gray-400">info@goaxplore.com</p>
                    <p className="text-gray-400">support@goaxplore.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Office Address</h4>
                    <p className="text-gray-400">
                      GoaXplore Headquarters<br />
                      Baga Beach Road, Calangute<br />
                      North Goa, Goa - 403516<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Business Hours</h4>
                    <p className="text-gray-400">Monday - Sunday: 8:00 AM - 8:00 PM</p>
                    <p className="text-gray-400">Emergency Support: 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Help */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Quick Help</h3>

              <div className="space-y-4">
                <div className="border-b border-gray-800 pb-4">
                  <h4 className="text-white font-semibold mb-2">Booking Support</h4>
                  <p className="text-gray-400 text-sm">Need help with your booking? Our team is here to assist you.</p>
                </div>

                <div className="border-b border-gray-800 pb-4">
                  <h4 className="text-white font-semibold mb-2">Provider Partnership</h4>
                  <p className="text-gray-400 text-sm">Interested in becoming a water sports provider? Let's talk!</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">General Inquiries</h4>
                  <p className="text-gray-400 text-sm">Have questions about GoaXplore? We're happy to help.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}