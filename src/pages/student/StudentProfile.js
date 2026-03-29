import { useState, useEffect } from 'react';
import { User, BookOpen, Code, Link, Save, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { getStudentProfile, updateStudentProfile } from '../../api/internships';

const skillSuggestions = ['Java', 'Python', 'React', 'Node.js', 'MySQL', 'MongoDB', 'Spring Boot', 'Machine Learning', 'TensorFlow', 'Figma', 'Adobe XD', 'SEO', 'Git', 'Docker', 'AWS'];

export default function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    college: '', degree: '', year: '', cgpa: '',
    skills: '', bio: '', linkedin: '', github: '', resumeUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skillList, setSkillList] = useState([]);

  useEffect(() => {
    getStudentProfile()
      .then(res => {
        const data = res.data.data;
        setProfile(data);
        setSkillList(data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !skillList.includes(s)) {
      setSkillList([...skillList, s]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setSkillList(skillList.filter(s => s !== skill));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateStudentProfile({ ...profile, skills: skillList.join(',') });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const completionScore = () => {
    const fields = [profile.college, profile.degree, profile.bio, profile.resumeUrl, skillList.length > 0];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const score = completionScore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">My Profile</h1>
            <p className="text-gray-500 dark:text-gray-400">Keep your profile updated to get better matches</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left — Avatar + Completion */}
          <div className="space-y-4">
            <div className="card text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                {user?.name?.charAt(0)}
              </div>
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">{user?.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
              <span className="badge-blue badge mt-2">Student</span>
            </div>

            {/* Profile completion */}
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Profile Strength</h3>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-extrabold text-blue-600">{score}%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {score < 50 ? 'Beginner' : score < 80 ? 'Intermediate' : 'Strong'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'College', done: !!profile.college },
                  { label: 'Degree', done: !!profile.degree },
                  { label: 'Bio', done: !!profile.bio },
                  { label: 'Skills', done: skillList.length > 0 },
                  { label: 'Resume', done: !!profile.resumeUrl },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${done ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      {done && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={done ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-2 space-y-4">

            {/* Basic Info */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">Basic Information</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">College</label>
                  <input value={profile.college || ''} onChange={e => setProfile({ ...profile, college: e.target.value })} placeholder="Bharati Vidyapeeth..." className="input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Degree</label>
                  <input value={profile.degree || ''} onChange={e => setProfile({ ...profile, degree: e.target.value })} placeholder="B.E. Computer Engineering" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Year of Study</label>
                  <select value={profile.year || ''} onChange={e => setProfile({ ...profile, year: e.target.value })} className="input">
                    <option value="">Select year</option>
                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">CGPA</label>
                  <input type="number" step="0.01" min="0" max="10" value={profile.cgpa || ''} onChange={e => setProfile({ ...profile, cgpa: e.target.value })} placeholder="8.5" className="input" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                <textarea value={profile.bio || ''} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell companies about yourself..." rows={3} className="input resize-none" />
              </div>
            </div>

            {/* Skills */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">Skills</h3>
              </div>

              <div className="flex gap-2 mb-3">
                <input
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                  placeholder="Type a skill and press Enter..."
                  className="input flex-1"
                />
                <button onClick={() => addSkill(skillInput)} className="btn-primary px-4">Add</button>
              </div>

              {/* Current skills */}
              {skillList.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {skillList.map(skill => (
                    <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="text-blue-400 hover:text-red-500 transition-colors text-lg leading-none">×</button>
                    </span>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {skillSuggestions.filter(s => !skillList.includes(s)).slice(0, 8).map(skill => (
                    <button key={skill} onClick={() => addSkill(skill)} className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Link className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">Links & Resume</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">LinkedIn URL</label>
                  <input value={profile.linkedin || ''} onChange={e => setProfile({ ...profile, linkedin: e.target.value })} placeholder="https://linkedin.com/in/yourname" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">GitHub URL</label>
                  <input value={profile.github || ''} onChange={e => setProfile({ ...profile, github: e.target.value })} placeholder="https://github.com/yourname" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Resume URL</label>
                  <input value={profile.resumeUrl || ''} onChange={e => setProfile({ ...profile, resumeUrl: e.target.value })} placeholder="https://drive.google.com/..." className="input" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}