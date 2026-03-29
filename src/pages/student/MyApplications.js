import { useState, useEffect } from 'react';
import { Briefcase, Clock, CheckCircle, XCircle, Calendar, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { getMyApplications } from '../../api/internships';

const statusConfig = {
  applied:             { label: 'Applied',             color: 'badge-yellow', icon: Clock },
  under_review:        { label: 'Under Review',        color: 'badge-blue',   icon: Clock },
  shortlisted:         { label: 'Shortlisted',         color: 'badge-purple', icon: CheckCircle },
  interview_scheduled: { label: 'Interview Scheduled', color: 'badge-blue',   icon: Calendar },
  accepted:            { label: 'Accepted',            color: 'badge-green',  icon: CheckCircle },
  rejected:            { label: 'Rejected',            color: 'badge-red',    icon: XCircle },
};

const stages = ['applied', 'under_review', 'shortlisted', 'interview_scheduled', 'accepted'];

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getMyApplications()
      .then(res => setApplications(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all'
    ? applications
    : applications.filter(a => a.status === filter);

  const counts = {
    all: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    under_review: applications.filter(a => a.status === 'under_review').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    interview_scheduled: applications.filter(a => a.status === 'interview_scheduled').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
            My Applications
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track every application in one place
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {[
            { key: 'all', label: 'All' },
            { key: 'applied', label: 'Applied' },
            { key: 'under_review', label: 'Under Review' },
            { key: 'shortlisted', label: 'Shortlisted' },
            { key: 'interview_scheduled', label: 'Interview' },
            { key: 'accepted', label: 'Accepted' },
            { key: 'rejected', label: 'Rejected' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                filter === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === key ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              {filter === 'all' ? 'No applications yet' : `No ${filter.replace('_', ' ')} applications`}
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              {filter === 'all' ? 'Start applying to internships to see them here' : 'Try a different filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app, i) => {
              const s = statusConfig[app.status] || { label: app.status, color: 'badge-blue', icon: Clock };
              const StatusIcon = s.icon;
              const currentStageIdx = stages.indexOf(app.status);

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* Left: Company + Role */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {app.companyName?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{app.internshipTitle}</h3>
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
                          <Building2 className="w-3.5 h-3.5" />
                          {app.companyName}
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Applied {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Right: Status */}
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <span className={`${s.color} badge flex items-center gap-1.5`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {s.label}
                      </span>
                      {app.interviewDate && (
                        <div className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 font-medium">
                          <Calendar className="w-4 h-4" />
                          Interview: {new Date(app.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress pipeline */}
                  {app.status !== 'rejected' && (
                    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1">
                        {stages.map((stage, idx) => {
                          const isCompleted = idx <= currentStageIdx;
                          const isCurrent = idx === currentStageIdx;
                          return (
                            <div key={stage} className="flex items-center flex-1">
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isCompleted
                                  ? isCurrent
                                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/50'
                                    : 'bg-blue-600 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                              }`}>
                                {isCompleted && !isCurrent ? '✓' : idx + 1}
                              </div>
                              {idx < stages.length - 1 && (
                                <div className={`flex-1 h-1 mx-1 rounded-full transition-all ${
                                  idx < currentStageIdx ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                                }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-1.5">
                        {stages.map((stage) => (
                          <span key={stage} className="text-xs text-gray-400 dark:text-gray-500 capitalize" style={{ fontSize: '10px' }}>
                            {stage.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {app.status === 'rejected' && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Application was not selected this time. Keep applying!
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}