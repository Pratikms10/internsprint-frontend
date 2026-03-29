import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Users, Building2, Star, Rocket, Shield, TrendingUp, Code, Palette, BarChart3 } from 'lucide-react';
import Navbar from '../components/Navbar';

const stats = [
  { label: 'Students Placed', value: '10,000+', icon: Users },
  { label: 'Partner Companies', value: '500+', icon: Building2 },
  { label: 'Internships Posted', value: '2,000+', icon: Rocket },
  { label: 'Success Rate', value: '94%', icon: TrendingUp },
];

const features = [
  { icon: Shield, title: 'Verified Companies', desc: 'Every company is manually verified by our admin team. No fake listings, ever.', color: 'bg-blue-500' },
  { icon: Zap, title: 'AI-Powered Matching', desc: 'Our ML model matches your skills to the best internship opportunities automatically.', color: 'bg-purple-500' },
  { icon: TrendingUp, title: 'Track Everything', desc: 'Real-time application tracker shows you exactly where you stand at every stage.', color: 'bg-green-500' },
  { icon: Star, title: 'Skill Builder', desc: 'Get personalized skill gap analysis and course recommendations to level up faster.', color: 'bg-orange-500' },
];

const domains = [
  { icon: Code, label: 'Software Development', count: '400+' },
  { icon: Palette, label: 'UI/UX Design', count: '150+' },
  { icon: BarChart3, label: 'Data Science', count: '200+' },
  { icon: TrendingUp, label: 'Digital Marketing', count: '180+' },
];

const steps = [
  { step: '01', title: 'Create Your Profile', desc: 'Add your skills, education, and upload your resume in minutes.' },
  { step: '02', title: 'Browse & Apply', desc: 'Search verified internships by domain, location, or skills. Apply with one click.' },
  { step: '03', title: 'Track Progress', desc: 'Follow your application through every stage — from review to offer.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6 border border-blue-100 dark:border-blue-800">
              <Zap className="w-4 h-4" /> The Smarter Way to Find Internships
            </span>

            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Land Your Dream{' '}
              <span className="gradient-text">Internship</span>{' '}
              Faster
            </h1>

            <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              InternSprint connects students with verified companies through AI-powered matching, real-time tracking, and skill-based recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg py-4 px-8 flex items-center gap-2 justify-center">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/internships/search" className="btn-secondary text-lg py-4 px-8">
                Browse Internships
              </Link>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16"
          >
            <div className="relative max-w-3xl mx-auto">
              <div className="card shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg ml-2" />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {['Applied', 'Under Review', 'Interview'].map((status, i) => (
                    <div key={status} className={`p-4 rounded-xl text-center ${i === 1 ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-gray-700'}`}>
                      <div className={`text-2xl font-bold ${i === 1 ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>{[3, 8, 2][i]}</div>
                      <div className={`text-xs mt-1 ${i === 1 ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>{status}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {['Software Developer Intern — TechCorp', 'UI/UX Designer — DesignHub', 'Data Analyst Intern — DataWorks'].map((item, i) => (
                    <div key={item} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{item}</span>
                      <span className={`badge ${['badge-green', 'badge-blue', 'badge-yellow'][i]}`}>
                        {['Accepted', 'Interview', 'Applied'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Everything you need to <span className="gradient-text">succeed</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Built specifically for students and companies in India's growing tech ecosystem.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="card hover:shadow-md transition-shadow duration-300 flex gap-5"
              >
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              How it <span className="gradient-text">works</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-extrabold text-lg">{s.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Domains */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Explore <span className="gradient-text">domains</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-12">Find internships across the most in-demand fields</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {domains.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center"
              >
                <d.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{d.label}</div>
                <div className="text-xs text-gray-400">{d.count} internships</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card bg-gradient-to-br from-blue-600 to-cyan-500 border-0 p-12">
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Ready to sprint ahead?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Join thousands of students who found their perfect internship on InternSprint.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center">
                Start For Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white/10 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="gradient-text">InternSprint</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 InternSprint. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
}