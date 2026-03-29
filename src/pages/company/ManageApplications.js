import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, CheckCircle, XCircle, Calendar, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { getInternshipApplications, updateApplicationStatus } from '../../api/internships';

const statusConfig = {
  applied:             { label: 'Applied',             color: 'badge-yellow' },
  under_review:        { label: 'Under Review',        color: 'badge-blue' },
  shortlisted:         { label: 'Shortlisted',         color: 'badge-purple' },
  interview_scheduled: { label: 'Interview Scheduled', color: 'badge-blue' },
  accepted:            { label: 'Accepted',            color: 'badge-green' },
  rejected:            { label: 'Rejected',            color: 'badge-red' },
};

const nextActions = {
  applied:             [{ status: 'under_review', label: 'Move to Review', color: 'btn-primary' }, { status: 'rejected', label: 'Reject', color: 'btn-secondary text-red-500' }],
  under_review:        [{ status: 'shortlisted', label: 'Shortlist', color: 'btn-primary' }, { status: 'rejected', label: 'Reject', color: 'btn-secondary text-red-500' }],
  shortlisted:         [{ status: 'interview_scheduled', label: 'Schedule Interview', color: 'btn-primary' }, { status: 'rejected', label: 'Reject', color: 'btn-secondary text-red-500' }],
  interview_scheduled: [{ status: 'accepted', label: 'Accept', color: 'btn-primary' }, { status: 'rejected', label: 'Reject', color: 'btn-secondary text-red-500' }],
  accepted:            [],
  rejected:            [],
};

export default function ManageApplications() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getInternshipApplications(id)
      .then(res => setApplications(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdating(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications(prev =>
        prev.map(a => a.id === applicationId ? { ...a, status: newStatus } : a)
      );
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
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

        <div className="flex items-center gap-4 mb-8">
          <Link to="/company" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Applications</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{applications.length} total applicants</p>
          </div>
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {Object.entries(statusConfig).map(([key, val]) => {
            const count = applications.filter(a => a.status === key).length;
            return (
              <div key={key} className="card text-center py-3 px-2">
                <div className="text-xl font-extrabold text-gray-900 dark:text-white">{count}</div>
                <span className={`${val.color} badge text-xs mt-1`}>{val.label}</span>
              </div>
            );
          })}
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 card">
            <User className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No applications yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Applications will appear here when students apply</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app, i) => {
              const s = statusConfig[app.status] || { label: app.status, color: 'badge-blue' };
              const actions = nextActions[app.status] || [];
              const isExpanded = expandedId === app.id;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {app.studentName?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{app.studentName || `Applicant #${app.id}`}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{app.studentEmail || ''}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Applied {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`${s.color} badge`}>{s.label}</span>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : app.id)}
                        className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> {isExpanded ? 'Hide' : 'View'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded view */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
                    >
                      {app.coverLetter && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Cover Letter</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl leading-relaxed">
                            {app.coverLetter}
                          </p>
                        </div>
                      )}

                      {actions.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          <p className="w-full text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Update Status</p>
                          {actions.map(action => (
                            <button
                              key={action.status}
                              onClick={() => handleStatusUpdate(app.id, action.status)}
                              disabled={updating === app.id}
                              className={`${action.color} text-sm py-2 px-4 flex items-center gap-1.5`}
                            >
                              {updating === app.id ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : action.status === 'accepted' ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : action.status === 'rejected' ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                <Calendar className="w-4 h-4" />
                              )}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
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