import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase,  Eye, XCircle, Plus, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { getCompanyInternships, closeInternship } from '../../api/internships';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompanyInternships()
      .then(res => setInternships(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleClose = async (id) => {
    try {
      await closeInternship(id);
      setInternships(prev => prev.map(i => i.id === id ? { ...i, status: 'closed' } : i));
      toast.success('Internship closed');
    } catch (err) {
      toast.error('Failed to close internship');
    }
  };


  const openCount = internships.filter(i => i.status === 'open').length;
  const closedCount = internships.filter(i => i.status === 'closed').length;

  const stats = [
    { label: 'Total Listings',    value: internships.length, icon: Briefcase,    color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Open Listings',     value: openCount,           icon: TrendingUp,   color: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Closed Listings',   value: closedCount,         icon: XCircle,      color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/20' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Welcome, <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your internship postings and applicants</p>
          </div>
          <Link to="/company/post" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Post New Internship
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="card flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Verification warning */}
        <div className="card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
              Note: Only verified companies can post internships
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-0.5">
              Contact the admin to verify your company account if you can't post.
            </p>
          </div>
        </div>

        {/* Internship listings */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Internship Listings</h2>
            <Link to="/company/post" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> New Listing
            </Link>
          </div>

          {internships.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">No internships posted yet</p>
              <Link to="/company/post" className="btn-primary text-sm">Post Your First Internship</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Position</th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Domain</th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Location</th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Deadline</th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {internships.map((internship, i) => (
                    <motion.tr
                      key={internship.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{internship.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{internship.stipend}</p>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="badge-blue badge text-xs">{internship.domain || '—'}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{internship.location || '—'}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`badge ${internship.status === 'open' ? 'badge-green' : 'badge-red'}`}>
                          {internship.status === 'open' ? '● Open' : '● Closed'}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {internship.deadline ? new Date(internship.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/company/applications/${internship.id}`}
                            className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                          {internship.status === 'open' && (
                            <button
                              onClick={() => handleClose(internship.id)}
                              className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Close
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}