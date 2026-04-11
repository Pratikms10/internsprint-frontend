import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle, XCircle, Bell, ArrowRight, Search, TrendingUp, Award, Zap, Bookmark } from 'lucide-react';import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications, getNotifications} from '../../api/internships';

const statusConfig = {
  applied:              { label: 'Applied',            color: 'badge-yellow' },
  under_review:         { label: 'Under Review',       color: 'badge-blue' },
  shortlisted:          { label: 'Shortlisted',        color: 'badge-purple' },
  interview_scheduled:  { label: 'Interview Scheduled',color: 'badge-blue' },
  accepted:             { label: 'Accepted',           color: 'badge-green' },
  rejected:             { label: 'Rejected',           color: 'badge-red' },
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, notifRes] = await Promise.all([
          getMyApplications(),
          getNotifications(),
        ]);
        setApplications(appRes.data.data || []);
        setNotifications(notifRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Applied',    value: applications.length,                                                              icon: Briefcase,    color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Under Review',     value: applications.filter(a => a.status === 'under_review').length,                     icon: Clock,        color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: 'Interviews',       value: applications.filter(a => a.status === 'interview_scheduled').length,              icon: TrendingUp,   color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Accepted',         value: applications.filter(a => a.status === 'accepted').length,                         icon: CheckCircle,  color: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-900/20' },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const recentApps = applications.slice(0, 5);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track your applications and discover new opportunities
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/student/browse" className="btn-primary flex items-center gap-2">
              <Search className="w-4 h-4" /> Browse Internships
            </Link>
          </div>
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
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Applications</h2>
                <Link to="/student/applications" className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 hover:underline">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {recentApps.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No applications yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Start applying to internships to track them here</p>
                  <Link to="/student/browse" className="btn-primary text-sm">
                    Browse Internships
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentApps.map((app) => {
                    const s = statusConfig[app.status] || { label: app.status, color: 'badge-blue' };
                    return (
                      <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {app.companyName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{app.internshipTitle}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{app.companyName}</p>
                          </div>
                        </div>
                        <span className={s.color + ' badge'}>{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">

            {/* Notifications */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </h2>
              </div>

              {notifications.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No notifications yet</p>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 4).map((n) => (
                    <div key={n.id} className={`p-3 rounded-xl text-sm ${!n.isRead ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { to: '/student/browse',       icon: Search,      label: 'Find Internships',    color: 'text-blue-600' },
                  { to: '/student/applications', icon: Briefcase,   label: 'My Applications',     color: 'text-purple-600' },
                  { to: '/student/profile',      icon: Award,       label: 'Update Profile',      color: 'text-green-600' },
                ].map((action) => (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                  >
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {action.label}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-auto text-gray-300 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile completion */}
            <div className="card bg-gradient-to-br from-blue-600 to-cyan-500 border-0">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-white" />
                <h3 className="font-bold text-white">Complete Your Profile</h3>
              </div>
              <p className="text-blue-100 text-sm mb-4">
                A complete profile gets 3x more views from companies.
              </p>
              <Link to="/student/profile" className="block text-center bg-white text-blue-600 font-semibold py-2 rounded-xl text-sm hover:bg-blue-50 transition-colors">
                Update Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}