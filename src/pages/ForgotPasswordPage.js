import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent!');
    } catch (err) {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="gradient-text">InternSprint</span>
        </Link>

        {!sent ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                Forgot password?
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input pl-12"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {loading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>
          </>
        ) : (
          <div className="card text-center py-10">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              Check your email
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              We sent a password reset link to <span className="font-semibold text-gray-700 dark:text-gray-200">{email}</span>
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Didn't receive it? Check your spam folder or try again.
            </p>
            <button onClick={() => setSent(false)} className="btn-secondary text-sm">
              Try again
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
