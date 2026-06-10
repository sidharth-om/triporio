import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiStar, FiArrowLeft, FiCheck, FiPlus, FiMessageSquare } from 'react-icons/fi';
import { destinationService } from '../services';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function DestinationDetailsPage() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart, removeFromCart, isInCart } = useTrip();
  const { isAuthenticated } = useAuth();

  const fetchReviews = async () => {
    try {
      const { data } = await destinationService.getReviews(id);
      setReviews(data.reviews);
    } catch (error) {
      console.error('Error fetching reviews', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const { data } = await destinationService.getById(id);
        setDestination(data.destination);
      } catch (error) {
        console.error('Error fetching destination details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    setSubmittingReview(true);
    try {
      const { data } = await destinationService.addReview(id, {
        rating: ratingInput,
        comment: commentInput
      });
      toast.success(data.message || 'Review added successfully!');
      setCommentInput('');
      setRatingInput(5);
      fetchReviews();
      setDestination(prev => ({
        ...prev,
        rating: data.avgRating
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!destination) return <div className="min-h-screen pt-32 text-center text-white text-2xl">Destination not found</div>;

  const inCart = isInCart(destination._id);

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580392917481-ce0bd75c5c08?w=1400'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/60 to-transparent" />
        
        <div className="absolute top-6 left-4 md:left-8">
          <Link href="/destinations" className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 text-white transition-colors">
            <FiArrowLeft /> Back to Destinations
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30">
                  {destination.category}
                </span>
                <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full text-sm font-semibold border border-amber-400/20">
                  <FiStar className="fill-current" /> {destination.rating}
                </div>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-4 leading-tight">
                {destination.name}
              </h1>

              <div className="flex items-center gap-6 text-slate-300 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-green-400 text-lg" />
                  {destination.location}
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-amber-400 text-lg" />
                  Best Time: {destination.bestSeason}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-6 md:p-8 rounded-3xl"
            >
              <h2 className="text-2xl font-bold text-white mb-4 font-display">About this place</h2>
              <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                {destination.description}
              </p>
            </motion.div>

            {destination.highlights && destination.highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-6 md:p-8 rounded-3xl"
              >
                <h2 className="text-2xl font-bold text-white mb-6 font-display">Key Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <FiCheck className="text-green-400 text-sm" />
                      </div>
                      <span className="text-slate-300">{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass p-6 md:p-8 rounded-3xl space-y-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
                  <FiMessageSquare className="text-green-400" /> Reviews & Ratings
                </h2>
                <div className="text-slate-400 text-sm">
                  {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </div>
              </div>

              {/* Add Review Form */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 md:p-6 space-y-4">
                <h3 className="text-lg font-bold text-white font-display">Write a Review</h3>
                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Star Selection */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">Your Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRatingInput(star)}
                            className="text-xl transition-transform hover:scale-125 focus:outline-none"
                          >
                            <FiStar
                              className={
                                star <= ratingInput
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-500 hover:text-amber-400'
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment Area */}
                    <div>
                      <textarea
                        rows={3}
                        required
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Share your experience visiting this place..."
                        className="input-dark w-full text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <p className="text-slate-400 text-sm">
                    Please <Link href="/login" className="text-green-400 hover:underline">Log in</Link> to share your experience and leave a rating.
                  </p>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsLoading ? (
                  <div className="text-center py-4 text-slate-500">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 border-2 border-dashed border-white/5 rounded-2xl">
                    No reviews yet. Be the first to share your experience!
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {reviews.map((rev) => (
                      <div key={rev._id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-white text-sm">{rev.userName}</span>
                            <div className="flex gap-0.5 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FiStar
                                  key={star}
                                  className={`text-xs ${
                                    star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-slate-500 text-xs">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-dark p-6 rounded-3xl sticky top-28 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-2 font-display">Add to your trip</h3>
              <p className="text-slate-400 text-sm mb-6">
                Include {destination.name} in your personalized North Kerala itinerary.
              </p>

              <button
                onClick={() => inCart ? removeFromCart(destination._id) : addToCart(destination)}
                className={`w-full py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  inCart 
                    ? 'bg-green-500/20 text-green-400 border-2 border-green-500 hover:bg-green-500/30' 
                    : 'bg-green-600 text-white hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/30'
                }`}
              >
                {inCart ? (
                  <><FiCheck className="text-xl" /> Added to Trip</>
                ) : (
                  <><FiPlus className="text-xl" /> Add to Trip</>
                )}
              </button>

              {!isAuthenticated && (
                <p className="text-center text-xs text-slate-500 mt-4">
                  <Link href="/login" className="text-green-400 hover:underline">Log in</Link> to save your trip plans
                </p>
              )}

              <hr className="border-white/10 my-6" />

              <div className="space-y-4">
                <h4 className="text-white font-semibold mb-2">Need help?</h4>
                <a
                  href="https://wa.me/919746161519"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
