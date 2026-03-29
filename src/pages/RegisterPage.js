import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight, User, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { registerAPI } from '../api/auth';

export default function RegisterPage() {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    companyName: '', website: '', industry: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, role };
      const res = await registerAPI(payload);
      const { token, role: userRole, userId, name, email } = res.data.data;
      login({ userId, name, email, role: userRole }, token);
      toast.success(`Welcome to InternSprint, ${name}!`);
      navigate(`/${userRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">

      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-cyan-500 flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          InternSprint
        </Link>

        <div>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Start your journey today
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join 10,000+ students who found their dream internship through InternSprint.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Students', value: '10K+' },
              { label: 'Companies', value: '500+' },
              { label: 'Internships', value: '2K+' },
              { label: 'Success Rate', value: '94%' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                <div className="text-blue-100 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-100 text-sm">© 2026 InternSprint</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          <Link to="/" className="lg:hidden flex items-center gap-2 font-bold text-xl mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text">InternSprint</span>
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              Create account
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Role toggle */}
          <div className="flex gap-3 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {[
              { value: 'student', label: 'Student', icon: User },
              { value: 'company', label: 'Company', icon: Building2 },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  role === value
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {role === 'student' ? 'Full Name' : 'Your Name'}
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Mayuri Kamble"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Company-specific fields */}
            {role === 'company' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="TechCorp Pvt. Ltd."
                    className="input"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Industry
                    </label>
                    <input
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      placeholder="Software"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="input"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}