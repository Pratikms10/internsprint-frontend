import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Users, ArrowLeft, Search, GraduationCap, Github, Linkedin, Code, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { getCompanyInternships } from '../../api/internships';
import { findMatchingStudents } from '../../api/internships';
import { useEffect } from 'react';

export default function FindCandidates() {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [customSkills, setCustomSkills] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    getCompanyInternships()
      .then(res => setInternships(res.data.data || []))
      .catch(console.error);
  }, []);

  const handleSearch = async () => {
    const skills = selectedInternship
      ? selectedInternship.skillsRequired
      : customSkills;

    if (!skills) {
      toast.error('Select an internship or enter required skills');
      return;
    }

    setLoading(true);
    try {
      const res = await findMatchingStudents(skills);
      setMatches(res.data.matches || []);
      setSearched(true);
      if (res.data.matches?.length === 0) {
        toast('No students with matching skills found yet', { icon: 'ℹ️' });
      } else {
        toast.success(`Found ${res.data.matches.length} matching candidates!`);
      }
    } catch (err) {
      toast.error('AI service unavailable. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percent) => {
    if (percent >= 70) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (percent >= 40) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
  };

  const getMatchLabel = (percent) => {
    if (percent >= 70) return 'Strong Match';
    if (percent >= 40) return 'Partial Match';
    return 'Low Match';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/company" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-8 h-8 text-blue-600" /> AI Candidate Matching
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Find the most relevant students for your internship role
            </p>
          </div>
        </div>

        {/* Search Panel */}
        <div className="card mb-8">
          <h2 className="font-bold text-gray-900 dark:text-white mb-5 text-lg">
            What role are you hiring for?
          </h2>

          {/* Select from your internships */}
          {internships.length > 0 && (
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Match against one of your internships
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {internships.filter(i => i.status === 'open').map(internship => (
                  <button
                    key={internship.id}
                    onClick={() => { setSelectedInternship(internship); setCustomSkills(''); }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedInternship?.id === internship.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{internship.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{internship.skillsRequired}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm text-gray-400 font-medium">or enter custom skills</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Custom skills input */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Required Skills
            </label>
            <input
              value={selectedInternship ? selectedInternship.skillsRequired : customSkills}
              onChange={e => { setCustomSkills(e.target.value); setSelectedInternship(null); }}
              placeholder="e.g. Python, Machine Learning, TensorFlow, SQL"
              className="input"
            />
          </div>

          <button onClick={handleSearch} disabled={loading}
            className="btn-primary flex items-center gap-2 px-8 py-3">
            {loading
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><Search className="w-5 h-5" /> Find Matching Candidates</>}
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {matches.length > 0 ? `${matches.length} Candidates Found` : 'No candidates found'}
              </h2>
              {matches.length > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Sorted by AI match score
                </span>
              )}
            </div>

            {matches.length === 0 ? (
              <div className="card text-center py-16">
                <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  No matching students yet
                </h3>
                <p className="text-gray-400 dark:text-gray-500 max-w-md mx-auto">
                  No students with matching skills have registered yet. Try broader skill requirements or check back as more students join.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((student, i) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">

                      {/* Avatar + Name */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                          {student.name?.charAt(0) || 'S'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{student.name}</h3>
                            {i === 0 && (
                              <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                                <Star className="w-3 h-3" /> Best Match
                              </span>
                            )}
                          </div>
                          {student.college && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                              <GraduationCap className="w-3.5 h-3.5" />
                              {student.college}{student.degree ? ` — ${student.degree}` : ''}
                              {student.cgpa ? ` • CGPA: ${student.cgpa}` : ''}
                            </div>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                        </div>
                      </div>

                      {/* Match score */}
                      <div className="flex-shrink-0 text-center">
                        <div className={`inline-flex flex-col items-center px-4 py-2 rounded-xl ${getMatchColor(student.matchPercent)}`}>
                          <span className="text-2xl font-extrabold">{student.matchPercent}%</span>
                          <span className="text-xs font-semibold">{getMatchLabel(student.matchPercent)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    {student.skills && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <Code className="w-3 h-3" /> Skills
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {student.skills.split(',').map(skill => {
                            const required = (selectedInternship?.skillsRequired || customSkills).toLowerCase();
                            const isMatch = required.includes(skill.trim().toLowerCase());
                            return (
                              <span key={skill} className={`text-xs px-2.5 py-1 rounded-lg font-medium ${isMatch ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                {isMatch && '✓ '}{skill.trim()}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Bio + Links */}
                    {(student.bio || student.linkedin || student.github) && (
                      <div className="mt-3 flex flex-col md:flex-row md:items-center gap-3">
                        {student.bio && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex-1 line-clamp-2">{student.bio}</p>
                        )}
                        <div className="flex gap-3">
                          {student.linkedin && (
                            <a href={student.linkedin.startsWith('http') ? student.linkedin : `https://${student.linkedin}`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                              <Linkedin className="w-4 h-4" /> LinkedIn
                            </a>
                          )}
                          {student.github && (
                            <a href={student.github.startsWith('http') ? student.github : `https://${student.github}`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 hover:underline">
                              <Github className="w-4 h-4" /> GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
