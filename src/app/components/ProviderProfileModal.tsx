import { X, MapPin, Star, Shield, Phone, Mail, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import API from "../config/api";

const API_BASE = `${API}/api`;

interface ProviderProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: any | null;
  onBookActivity?: (activityName: string, provider: any) => void;
}

export function ProviderProfileModal({ isOpen, onClose, provider, onBookActivity }: ProviderProfileModalProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<{ average_rating: number; review_count: number } | null>(null);
  const [providerDetails, setProviderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !provider) return;

    const providerId = provider.provider_id || provider.id;
    if (!providerId) return;

    setLoading(true);

    Promise.all([
      fetch(`${API_BASE}/providers/${providerId}`).then(r => r.json()),
      fetch(`${API_BASE}/reviews/provider/${providerId}/rating`).then(r => r.json()),
      fetch(`${API_BASE}/reviews/provider/${providerId}`).then(r => r.json()),
    ])
      .then(([details, ratingData, reviewsData]) => {
        setProviderDetails(details);
        setRating(ratingData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      })
      .catch(() => {
        setProviderDetails(null);
        setRating(null);
        setReviews([]);
      })
      .finally(() => setLoading(false));
  }, [isOpen, provider]);

  if (!isOpen || !provider) return null;

  const avgRating = rating?.average_rating || 0;
  const reviewCount = rating?.review_count || 0;
  const activities = providerDetails?.activities || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
              {provider.logo}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{provider.name}</h2>
              <div className="flex items-center text-gray-400 mt-1">
                <MapPin size={16} className="mr-1" />
                {provider.location}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Rating + Verified */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full">
              <Star size={20} className="text-yellow-400 fill-yellow-400 mr-2" />
              {avgRating > 0 ? (
                <>
                  <span className="text-white font-bold">{Number(avgRating).toFixed(1)}</span>
                  <span className="text-gray-400 ml-1">({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
                </>
              ) : (
                <span className="text-gray-400">No reviews yet</span>
              )}
            </div>
            {provider.verified && (
              <div className="flex items-center bg-green-900/30 px-4 py-2 rounded-full">
                <Shield size={20} className="text-green-400 mr-2" />
                <span className="text-green-400 font-semibold">Verified Provider</span>
              </div>
            )}
          </div>

          {/* Activities Offered */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Activities Offered</h3>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-800 animate-pulse rounded-lg" />)}
              </div>
            ) : activities.length === 0 ? (
              <p className="text-gray-400 text-sm">No active activities listed.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {activities.map((activity: any) => (
                  <button
                    key={activity.activity_id}
                    onClick={() => onBookActivity?.(activity.title, provider)}
                    className="bg-gray-800 hover:bg-red-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left"
                  >
                    <div className="font-semibold mb-1">{activity.title}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {activity.duration_minutes} min
                      </span>
                      <span>₹{Number(activity.price_per_person).toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contact Information */}
          {providerDetails && (
            <div className="bg-gray-800 rounded-lg p-5">
              <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
              <div className="space-y-3">
                {providerDetails.phone && (
                  <div className="flex items-center text-gray-300">
                    <Phone size={18} className="text-red-500 mr-3 shrink-0" />
                    <a href={`tel:${providerDetails.phone}`} className="hover:text-red-400 transition-colors">
                      {providerDetails.phone}
                    </a>
                  </div>
                )}
                {providerDetails.email && (
                  <div className="flex items-center text-gray-300">
                    <Mail size={18} className="text-red-500 mr-3 shrink-0" />
                    <a href={`mailto:${providerDetails.email}`} className="hover:text-red-400 transition-colors">
                      {providerDetails.email}
                    </a>
                  </div>
                )}
                {providerDetails.address && (
                  <div className="flex items-center text-gray-300">
                    <MapPin size={18} className="text-red-500 mr-3 shrink-0" />
                    <span>{providerDetails.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customer Reviews */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Customer Reviews
              {reviewCount > 0 && (
                <span className="text-gray-400 text-sm font-normal ml-2">({reviewCount} total)</span>
              )}
            </h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse h-20" />)}
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <Star size={32} className="mx-auto text-gray-600 mb-2" />
                <p className="text-gray-400">No reviews yet.</p>
                <p className="text-gray-500 text-sm mt-1">Book an activity and be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.review_id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {review.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium leading-tight">{review.full_name}</p>
                          <p className="text-gray-500 text-xs">{review.activity_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13}
                            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-1">{review.comment}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(review.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Book Button */}
          <button
            onClick={() => {
              if (activities.length > 0) {
                onBookActivity?.(activities[0].title, provider);
              }
              onClose();
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Book with {provider.name}
          </button>

        </div>
      </div>
    </div>
  );
}
