import { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
  image: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  currentUser?: any;
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';

export function Testimonials({ testimonials: fallbackTestimonials, currentUser }: TestimonialsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('${API}/api/reviews/public')
      .then(r => r.json())
      .then(data => {
        const raw = Array.isArray(data) ? data : [];
        if (raw.length > 0) {
          setReviews(raw.map((r: any) => ({
            id: r.review_id || r.id,
            name: r.full_name || r.name || 'Customer',
            rating: r.rating || 5,
            comment: r.comment || r.review_text || '',
            image: r.avatar || DEFAULT_AVATAR,
          })));
        } else {
          setReviews(fallbackTestimonials);
        }
      })
      .catch(() => setReviews(fallbackTestimonials));
  }, []);

  const handleSubmitReview = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const userId = currentUser?.user_id || currentUser?.id;
      if (userId) {
        await fetch('${API}/api/reviews/site', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, rating: newRating, comment: newComment }),
        });
      }
      setReviews(prev => [{
        id: Date.now(),
        name: currentUser?.full_name || currentUser?.name || 'You',
        rating: newRating,
        comment: newComment,
        image: DEFAULT_AVATAR,
      }, ...prev]);
      setNewComment('');
      setNewRating(5);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.warn('Review submit error');
    }
    setSubmitting(false);
  };

  const displayReviews = reviews.length > 0 ? reviews : fallbackTestimonials;

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-12">What Our Customers Say</h2>

        {/* Review Input Box */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-10">
          <p className="text-white font-semibold mb-4 text-lg">What do you think about GoaXplore?</p>
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setNewRating(star)}
              >
                <Star
                  size={24}
                  className={(hoveredStar || newRating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmitReview()}
              placeholder={currentUser ? 'Share your experience with GoaXplore...' : 'Login to share your experience...'}
              disabled={!currentUser}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 disabled:opacity-50"
            />
            <button
              onClick={handleSubmitReview}
              disabled={!currentUser || !newComment.trim() || submitting}
              className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <Send size={18} />
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
          {submitted && <p className="text-green-400 text-sm mt-2">Thanks for your review!</p>}
          {!currentUser && <p className="text-gray-500 text-sm mt-2">Please log in to leave a review.</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayReviews.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={testimonial.image || DEFAULT_AVATAR}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                  </div>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.comment}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}