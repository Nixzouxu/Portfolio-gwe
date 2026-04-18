import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiUser, HiMail, HiChat, HiClock } from 'react-icons/hi';

// CHANGE THIS to your Railway API URL after deployment
const API_URL = 'https://your-api.railway.app';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/comments.php`);
      const data = await response.json();
      
      if (data.success) {
        setComments(data.data);
      } else {
        setError('Failed to load comments');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/submit.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Comment submitted successfully!');
        setFormData({ name: '', email: '', message: '' });
        // Refresh comments
        fetchComments();
        
        // Clear success message after 3s
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to submit comment');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-display font-bold mb-4">
          Leave a <span className="gradient-text">Comment</span>
        </h2>
        <div className="cyan-divider mx-auto mb-4" />
        <p className="text-[rgba(226,235,240,0.5)]">
          I'd love to hear your thoughts!
        </p>
      </div>

      {/* Comment Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glow-card rounded-lg p-8 mb-12"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Email Row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 section-label mb-2">
                <HiUser size={14} />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-[rgba(7,16,32,0.8)] border border-[rgba(0,255,231,0.2)] rounded text-[rgba(226,235,240,0.8)] placeholder:text-[rgba(226,235,240,0.3)] focus:border-[rgba(0,255,231,0.5)] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 section-label mb-2">
                <HiMail size={14} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-[rgba(7,16,32,0.8)] border border-[rgba(0,255,231,0.2)] rounded text-[rgba(226,235,240,0.8)] placeholder:text-[rgba(226,235,240,0.3)] focus:border-[rgba(0,255,231,0.5)] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="flex items-center gap-2 section-label mb-2">
              <HiChat size={14} />
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={1000}
              rows={4}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 bg-[rgba(7,16,32,0.8)] border border-[rgba(0,255,231,0.2)] rounded text-[rgba(226,235,240,0.8)] placeholder:text-[rgba(226,235,240,0.3)] focus:border-[rgba(0,255,231,0.5)] focus:outline-none transition-all resize-none"
            />
            <p className="text-xs text-[rgba(226,235,240,0.3)] mt-1">
              {formData.message.length}/1000 characters
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-[rgba(0,255,231,0.1)] border border-[rgba(0,255,231,0.3)] rounded px-4 py-3 text-[#00FFE7] text-sm">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>
      </motion.div>

      {/* Comments List */}
      <div>
        <h3 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
          <HiChat className="text-[#00FFE7]" />
          Comments ({comments.length})
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[rgba(0,255,231,0.3)] border-t-[#00FFE7] rounded-full animate-spin" />
            <p className="text-[rgba(226,235,240,0.5)] mt-4">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 glow-card rounded-lg">
            <HiChat size={48} className="text-[rgba(0,255,231,0.3)] mx-auto mb-4" />
            <p className="text-[rgba(226,235,240,0.5)]">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glow-card rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FFE7] to-[#00A8A0] flex items-center justify-center text-white font-bold">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-[rgba(226,235,240,0.9)]">{comment.name}</p>
                      <p className="text-xs text-[rgba(226,235,240,0.4)] flex items-center gap-1">
                        <HiClock size={12} />
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-[rgba(226,235,240,0.7)] leading-relaxed">
                  {comment.message}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
