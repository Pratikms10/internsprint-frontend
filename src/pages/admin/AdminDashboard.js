import { useState, useEffect } from 'react';
import { Users, Building2, Briefcase, Trash2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { getAllUsers, getAllCompanies, getAllInternshipsAdmin, verifyCompany, unverifyCompany, deleteInternshipAdmin, deactivateUser } from '../../api/internships';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('companies');

  useEffect(() => {
    Promise.all([getAllUsers(), getAllCompanies(), getAllInternshipsAdmin()])
      .then(([uRes, cRes, iRes]) => {
        setUsers(uRes.data.data || []);
        setCompanies(cRes.data.data || []);
        setInternships(iRes.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleVerify = async (id, verify) => {
    try {
      const fn = verify ? verifyCompany : unverifyCompany;
      const res = await fn(id);
      setCompanies(prev => prev.map(c => c.id === id ? res.data.data : c));
      toast.success(verify ? 'Company verified!' : 'Verification revoked');
    } catch (err) {
      toast.error('Failed to update company');
    }
  };

  const handleDeleteInternship = async (id) => {
    if (!window.confirm('Delete this internship? This cannot be undone.')) return;
    try {
      await deleteInternshipAdmin(id);
      setInternships(prev => prev.filter(i => i.id !== id));
      toast.success('Internship deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this user?')) return;
    try {
      await deactivateUser(id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: false } : u));
      toast.success('User deactivated');
    } catch (err) {
      toast.error('Failed to deactivate user');
    }
  };

  const stats = [
    { label: 'Total Users',      value: users.length,                                      icon: Users,     color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Companies',        value: companies.length,                                  icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Verified',         value: companies.filter(c => c.isVerified).length,        icon: Shield,    color: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Internships',      value: internships.length,                                icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" /> Admin Panel
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor and manage the entire platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="card flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 w-fit">
          {[
            { key: 'companies', label: 'Companies', count: companies.length },
            { key: 'internships', label: 'Internships', count: internships.length },
            { key: 'users', label: 'Users', count: users.length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === key
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {label} <span className="ml-1 text-xs opacity-60">({count})</span>
            </button>
          ))}
        </div>

        {/* Companies Tab */}
        {tab === 'companies' && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Company Verification</h2>
            <div className="space-y-3">
              {companies.map((company, i) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                      {company.companyName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{company.companyName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{company.industry} • {company.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${company.isVerified ? 'badge-green' : 'badge-yellow'}`}>
                      {company.isVerified ? '✓ Verified' : '⏳ Pending'}
                    </span>
                    <button
                      onClick={() => handleVerify(company.id, !company.isVerified)}
                      className={`text-sm font-semibold py-1.5 px-4 rounded-xl transition-all ${
                        company.isVerified
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100'
                          : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100'
                      }`}
                    >
                      {company.isVerified ? 'Revoke' : 'Verify'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Internships Tab */}
        {tab === 'internships' && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All Internships</h2>
            <div className="space-y-3">
              {internships.map((internship, i) => (
                <motion.div
                  key={internship.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{internship.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{internship.companyName}</span>
                      {internship.domain && <span className="badge-blue badge text-xs">{internship.domain}</span>}
                      <span className={`badge text-xs ${internship.status === 'open' ? 'badge-green' : 'badge-red'}`}>{internship.status}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteInternship(internship.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    title="Delete internship"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All Users</h2>
            <div className="space-y-3">
              {users.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 ${
                      user.role === 'admin' ? 'bg-red-500' : user.role === 'company' ? 'bg-purple-500' : 'bg-blue-500'
                    }`}>
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge text-xs ${
                      user.role === 'admin' ? 'badge-red' : user.role === 'company' ? 'badge-purple' : 'badge-blue'
                    }`}>{user.role}</span>
                    <span className={`badge text-xs ${user.isActive ? 'badge-green' : 'badge-red'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {user.isActive && user.role !== 'admin' && (
                      <button
                        onClick={() => handleDeactivate(user.id)}
                        className="text-xs font-semibold py-1.5 px-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 transition-colors"
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}