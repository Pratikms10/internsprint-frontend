import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Clock, DollarSign, Code, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { postInternship } from '../../api/internships';

const domains = ['Web Development', 'Machine Learning', 'UI/UX Design', 'Data Science', 'Digital Marketing', 'Mobile Development', 'DevOps', 'Cybersecurity', 'Blockchain', 'Other'];

export default function PostInternship() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', domain: '', location: '', skillsRequired: '',
    description: '', stipend: '', duration: '', deadline: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postInternship(form);
      toast.success('Internship posted successfully!');
      navigate('/company');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post internship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Post an Internship</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in the details to attract the right candidates</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-900 dark:text-white">Basic Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Internship Title <span className="text-red-500">*</span>
                </label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Software Developer Intern" className="input" required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Domain</label>
                  <select name="domain" value={form.domain} onChange={handleChange} className="input">
                    <option value="">Select domain</option>
                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Location
                  </label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Pune / Remote / Mumbai" className="input" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the role, responsibilities, and what the intern will learn..." rows={5} className="input resize-none" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-900 dark:text-white">Duration & Compensation</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Duration
                </label>
                <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 months" className="input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Stipend
                </label>
                <input name="stipend" value={form.stipend} onChange={handleChange} placeholder="e.g. 15000/month" className="input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Application Deadline</label>
                <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="input" />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <Code className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-900 dark:text-white">Required Skills</h2>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Skills (comma-separated)
              </label>
              <input name="skillsRequired" value={form.skillsRequired} onChange={handleChange} placeholder="e.g. Java, React, MySQL, Spring Boot" className="input" />
              <p className="text-xs text-gray-400 mt-2">Separate each skill with a comma. These help students find your internship.</p>
            </div>
          </div>

          {/* Preview of skill tags */}
          {form.skillsRequired && (
            <div className="flex flex-wrap gap-2 px-1">
              {form.skillsRequired.split(',').map(s => s.trim()).filter(Boolean).map(skill => (
                <span key={skill} className="badge-blue badge">{skill}</span>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/company')} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <> Post Internship <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}