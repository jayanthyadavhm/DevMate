import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  AcademicCapIcon, 
  BriefcaseIcon, 
  TrophyIcon, 
  UserGroupIcon,
  ChatBubbleLeftIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const UserProfile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchUserProfile = async () => {
      try {
        // Simulated API response
        const mockUser = {
          id: parseInt(id),
          name: 'Alex Thompson',
          role: 'Full Stack Developer',
          university: 'MIT',
          graduationYear: '2024',
          location: 'Cambridge, MA',
          bio: 'Passionate about building innovative solutions that make a difference. Always excited to learn new technologies and collaborate with fellow developers.',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
          skills: [
            'React',
            'Node.js',
            'Python',
            'AWS',
            'MongoDB',
            'TypeScript',
            'Docker'
          ],
          experience: [
            {
              title: 'Software Engineering Intern',
              company: 'Tech Corp',
              period: 'Summer 2024',
              description: 'Developed and maintained microservices using Node.js and Docker.'
            },
            {
              title: 'Research Assistant',
              company: 'MIT CSAIL',
              period: '2023 - Present',
              description: 'Working on machine learning applications in healthcare.'
            }
          ],
          hackathons: [
            {
              name: 'Global Tech Hackathon',
              date: 'March 2024',
              achievement: '1st Place',
              project: 'AI-powered education platform'
            },
            {
              name: 'Health Innovation Hackathon',
              date: 'January 2024',
              achievement: '2nd Place',
              project: 'Remote patient monitoring system'
            }
          ],
          projects: [
            {
              name: 'StudyMate',
              description: 'AI-powered study group matching platform',
              technologies: ['React', 'Python', 'TensorFlow'],
              link: 'https://github.com/alexthompson/studymate'
            },
            {
              name: 'HealthTrack',
              description: 'Patient monitoring dashboard for healthcare providers',
              technologies: ['Vue.js', 'Node.js', 'MongoDB'],
              link: 'https://github.com/alexthompson/healthtrack'
            }
          ],
          socialLinks: {
            github: 'https://github.com/alexthompson',
            linkedin: 'https://linkedin.com/in/alexthompson',
            portfolio: 'https://alexthompson.dev'
          }
        };

        setUser(mockUser);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">User not found</h2>
          <p className="mt-2 text-gray-600">The user profile you're looking for doesn't exist.</p>
          <Link to="/find-teammates" className="mt-4 inline-block text-primary-600 hover:text-primary-500">
            Find teammates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="text-center">
                  <img
                    className="h-32 w-32 rounded-full mx-auto"
                    src={user.avatar}
                    alt={user.name}
                  />
                  <h1 className="mt-4 text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600">{user.role}</p>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="flex items-center text-gray-600 mb-4">
                    <AcademicCapIcon className="h-5 w-5 mr-2" />
                    {user.university}, Class of {user.graduationYear}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <BriefcaseIcon className="h-5 w-5 mr-2" />
                    {user.location}
                  </div>
                </div>

                {currentUser?.id !== parseInt(id) && (
                  <div className="mt-6">
                    <button className="w-full btn btn-primary flex items-center justify-center">
                      <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                      Message
                    </button>
                  </div>
                )}

                <div className="mt-6 flex justify-center space-x-4">
                  {Object.entries(user.socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">{platform}</span>
                      <LinkIcon className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Skills</h2>
              </div>
              <div className="px-6 py-6">
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Experience and Projects */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">About</h2>
              </div>
              <div className="px-6 py-6">
                <p className="text-gray-600">{user.bio}</p>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Experience</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {user.experience.map((exp, index) => (
                  <div key={index} className="px-6 py-6">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{exp.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{exp.company}</p>
                      </div>
                      <p className="text-sm text-gray-500">{exp.period}</p>
                    </div>
                    <p className="mt-3 text-gray-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hackathons */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Hackathon Experience</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {user.hackathons.map((hackathon, index) => (
                  <div key={index} className="px-6 py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{hackathon.name}</h3>
                        <p className="mt-1 text-sm text-gray-600">{hackathon.project}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{hackathon.date}</p>
                        <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {hackathon.achievement}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Projects</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {user.projects.map((project, index) => (
                  <div key={index} className="px-6 py-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                        <p className="mt-1 text-gray-600">{project.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-500"
                      >
                        <LinkIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
