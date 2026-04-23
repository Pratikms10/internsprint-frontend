import { useState, useEffect } from 'react';
import { Users, Building2, Briefcase, CheckCircle,Trash2, Shield, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, Legend
} from 'recharts';
import Navbar from '../../components/Navbar';
import { getAllUsers, getAllCompanies, getAllInternshipsAdmin, verifyCompany, unverifyCompany, deleteInternshipAdmin, deactivateUser} from '../../api/internships';

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

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
    } catch { toast.error('Failed to update company'); }
  };

  const handleDeleteInternship = async (id) => {
    if (!window.confirm('Delete this internship?')) return;
    try {
      await deleteInternshipAdmin(id);
      setInternships(prev => prev.filter(i => i.id !== id));
      toast.success('Internship deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this user?')) return;
    try {
      await deactivateUser(id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: false } : u));
      toast.success('User deactivated');
    } catch { toast.error('Failed to deactivate user'); }
  };

  // Analytics data
  const roleData = [
    { name: 'Students', value: users.filter(u => u.role === 'student').length },
    { name: 'Companies', value: users.filter(u => u.role === 'company').length },
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length },
  ].filter(d => d.value > 0);

  const domainData = internships.reduce((acc, i) => {
    const domain = i.domain || 'Other';
    const existing = acc.find(d => d.name === domain);
    if (existing) existing.count++;
    else acc.push({ name: domain, count: 1 });
    return acc;
  }, []).sort((a, b) => b.count - a.count).slice(0, 6);

  const companyStatusData = [
    { name: 'Verified', value: companies.filter(c => c.isVerified).length },
    { name: 'Pending', value: companies.filter(c => !c.isVerified).length },
  ].filter(d => d.value > 0);

  const internshipStatusData = [
    { name: 'Open', value: internships.filter(i => i.status === 'open').length },
    { name: 'Closed', value: internships.filter(i => i.status === 'closed').length },
  ].filter(d => d.value > 0);

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Companies', value: companies.length, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Verified', value: companies.filter(c => c.isVerified).length, icon: Shield, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Internships', value: internships.length, icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'Open Roles', value: internships.filter(i => i.status === 'open').length, icon: TrendingUp, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
    { label: 'Active Users', value: users.filter(u => u.isActive).length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
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

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card flex flex-col items-center text-center py-4">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-2`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 w-fit overflow-x-auto">
          {[
            { key: 'overview', label: 'Analytics', icon: BarChart3 },
            { key: 'companies', label: 'Companies', count: companies.length },
            { key: 'internships', label: 'Internships', count: internships.length },
            { key: 'users', label: 'Users', count: users.length },
          ].map(({ key, label, count, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${tab === key ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
              {Icon && <Icon className="w-4 h-4" />}
              {label}
              {count !== undefined && <span className="text-xs opacity-60">({count})</span>}
            </button>
          ))}
        </div>

        {/* Analytics Tab */}
        {tab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">

            {/* Domain distribution */}
            <div className="card">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" /> Internships by Domain
              </h3>
              {domainData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={domainData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">No data yet</div>
              )}
            </div>

            {/* User roles pie */}
            <div className="card">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" /> User Distribution
              </h3>
              {roleData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPie>
                    <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`}>
                      {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">No data yet</div>
              )}
            </div>

            {/* Company verification */}
            <div className="card">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Company Status</h3>
              {companyStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <RechartsPie>
                    <Pie data={companyStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name, value }) => `${name}: ${value}`}>
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400">No companies yet</div>
              )}
            </div>

            {/* Internship status */}
            <div className="card">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Internship Status</h3>
              {internshipStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <RechartsPie>
                    <Pie data={internshipStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name, value }) => `${name}: ${value}`}>
                      <Cell fill="#3b82f6" />
                      <Cell fill="#6b7280" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400">No internships yet</div>
              )}
            </div>

            {/* Platform summary */}
            <div className="card md:col-span-2 bg-gradient-to-br from-blue-600 to-cyan-500 border-0">
              <h3 className="font-bold text-white mb-4 text-lg">Platform Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users', value: users.length },
                  { label: 'Active Students', value: users.filter(u => u.role === 'student' && u.isActive).length },
                  { label: 'Verified Companies', value: companies.filter(c => c.isVerified).length },
                  { label: 'Open Internships', value: internships.filter(i => i.status === 'open').length },
                ].map((item) => (
                  <div key={item.label} className="text-center bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-extrabold text-white">{item.value}</div>
                    <div className="text-blue-100 text-sm mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Companies Tab */}
        {tab === 'companies' && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Company Verification</h2>
            <div className="space-y-3">
              {companies.map((company, i) => (
                <motion.div key={company.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
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
                    <button onClick={() => handleVerify(company.id, !company.isVerified)}
                      className={`text-sm font-semibold py-1.5 px-4 rounded-xl transition-all ${company.isVerified ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100'}`}>
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
                <motion.div key={internship.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{internship.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{internship.companyName}</span>
                      {internship.domain && <span className="badge-blue badge text-xs">{internship.domain}</span>}
                      <span className={`badge text-xs ${internship.status === 'open' ? 'badge-green' : 'badge-red'}`}>{internship.status}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteInternship(internship.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
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
                <motion.div key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 ${user.role === 'admin' ? 'bg-red-500' : user.role === 'company' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge text-xs ${user.role === 'admin' ? 'badge-red' : user.role === 'company' ? 'badge-purple' : 'badge-blue'}`}>{user.role}</span>
                    <span className={`badge text-xs ${user.isActive ? 'badge-green' : 'badge-red'}`}>{user.isActive ? 'Active' : 'Inactive'}</span>
                    {user.isActive && user.role !== 'admin' && (
                      <button onClick={() => handleDeactivate(user.id)}
                        className="text-xs font-semibold py-1.5 px-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 transition-colors">
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