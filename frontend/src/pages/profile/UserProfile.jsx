import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hackathonTeamsAPI } from '../../services/apiServices';
import { 
  AcademicCapIcon, 
  BriefcaseIcon, 
  TrophyIcon, 
  UserGroupIcon,
  ChatBubbleLeftIcon,
  LinkIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
  CodeBracketIcon,
  ClockIcon,
  FireIcon,
  ChartBarIcon,
  BeakerIcon,
  GlobeAltIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckBadgeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
  TrophyIcon as TrophyIconSolid 
} from '@heroicons/react/24/solid';

const UserProfile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  
  // Use the ID from params, or fallback to current user's ID
  const profileId = id || currentUser?.id || currentUser?._id;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Don't make API call if we don't have a valid ID
      if (!profileId) {
        setError('No user ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const userData = await hackathonTeamsAPI.getUserProfile(profileId);
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [profileId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Profile</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
          >
            Back to Dashboard
          </Link>
        </div>
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

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.username;

  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative px-6 py-8 sm:px-8 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <img
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white object-cover shadow-lg"
                  src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=128&background=6366f1&color=fff`}
                  alt={`${displayName}'s profile`}
                />
                {user.isVerified && (
                  <CheckBadgeIcon className="absolute -bottom-1 -right-1 h-8 w-8 text-green-500 bg-white rounded-full p-1" />
                )}
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{displayName}</h1>
                  {user.role === 'organizer' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-yellow-900">
                      <TrophyIconSolid className="h-3 w-3 mr-1" />
                      Organizer
                    </span>
                  )}
                </div>
                <p className="text-primary-100 text-lg mt-1">{user.major || user.jobTitle || 'Student'}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-primary-100">
                  {user.university && (
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{user.university}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{user.location}</span>
                    </div>
                  )}
                  {user.joinedDate && (
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              {isOwnProfile && (
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center px-4 py-2 border border-white text-white hover:bg-white hover:text-primary-600 font-medium rounded-lg transition-colors duration-200"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Left Column - Profile Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrophyIcon className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-600">Hackathons Won</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user.hackathonsWon || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Teams Joined</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user.teamsJoined || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FireIcon className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-sm text-gray-600">Contribution Score</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user.contributionScore || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Rating</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900 mr-1">{user.rating || '4.5'}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIconSolid 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(user.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
              <div className="space-y-3">
                {user.email && (
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{user.phone}</span>
                  </div>
                )}
                {user.timezone && (
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{user.timezone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Links</h2>
              <div className="space-y-3">
                {user.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg className="h-4 w-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">GitHub</span>
                  </a>
                )}
                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg className="h-4 w-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
                {user.portfolioUrl && (
                  <a
                    href={user.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <GlobeAltIcon className="h-4 w-4 mr-3" />
                    <span className="text-sm">Portfolio</span>
                  </a>
                )}
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <GlobeAltIcon className="h-4 w-4 mr-3" />
                    <span className="text-sm">Website</span>
                  </a>
                )}
              </div>
            </div>

            {!isOwnProfile && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                  Send Team Request
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Skills & Technologies */}
            {user.skills && user.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Skills & Technologies</h2>
                  <CodeBracketIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{skill}</span>
                      <div className="flex items-center">
                        {/* Skill level visualization */}
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-2 w-2 rounded-full ${i < (user.skillLevels?.[skill] || 3) ? 'bg-primary-500' : 'bg-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience & Education */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Experience & Education</h2>
              <div className="space-y-6">
                {/* Experience */}
                {user.experience && user.experience.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-500" />
                      Work Experience
                    </h3>
                    <div className="space-y-4">
                      {user.experience.map((exp, index) => (
                        <div key={index} className="border-l-4 border-primary-200 pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                              <p className="text-primary-600 font-medium">{exp.company}</p>
                              <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                            </div>
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {exp.startDate} - {exp.endDate || 'Present'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {user.education && user.education.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <AcademicCapIcon className="h-5 w-5 mr-2 text-gray-500" />
                      Education
                    </h3>
                    <div className="space-y-4">
                      {user.education.map((edu, index) => (
                        <div key={index} className="border-l-4 border-blue-200 pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                              <p className="text-blue-600 font-medium">{edu.institution}</p>
                              {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                            </div>
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {edu.startYear} - {edu.endYear || 'Present'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Default education info */}
                {(!user.education || user.education.length === 0) && user.university && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <AcademicCapIcon className="h-5 w-5 mr-2 text-gray-500" />
                      Education
                    </h3>
                    <div className="border-l-4 border-blue-200 pl-4">
                      <h4 className="font-semibold text-gray-900">{user.major || 'Student'}</h4>
                      <p className="text-blue-600 font-medium">{user.university}</p>
                      {user.yearOfStudy && <p className="text-gray-600 text-sm">Year: {user.yearOfStudy}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Projects & Achievements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
                  <BeakerIcon className="h-5 w-5 text-gray-400" />
                </div>
                {user.projects && user.projects.length > 0 ? (
                  <div className="space-y-4">
                    {user.projects.slice(0, 3).map((project, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{project.name}</h3>
                          {project.award && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              {project.award}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                            <span key={techIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                        {project.url && (
                          <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View Project →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No projects to display</p>
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
                  <TrophyIcon className="h-5 w-5 text-gray-400" />
                </div>
                {user.achievements && user.achievements.length > 0 ? (
                  <div className="space-y-3">
                    {user.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                        <TrophyIconSolid className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          {achievement.date && (
                            <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No achievements yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Interests */}
            {user.interests && user.interests.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 transition-colors"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Hackathon Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Hackathon Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <TrophyIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Experience Level</h3>
                  <p className="text-sm text-gray-600 mt-1">{user.hackathonExperience || 'Not specified'}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <UserGroupIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Team Size</h3>
                  <p className="text-sm text-gray-600 mt-1">{user.preferredTeamSize ? `${user.preferredTeamSize} members` : 'Flexible'}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Availability</h3>
                  <p className="text-sm text-gray-600 mt-1">{user.availability || 'Not specified'}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <FireIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Commitment</h3>
                  <p className="text-sm text-gray-600 mt-1">{user.commitmentLevel || 'High'}</p>
                </div>
              </div>
            </div>

            {/* Hackathon Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ready Hackathons */}
              {user.readyHackathons && user.readyHackathons.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600">
                    <h2 className="text-lg font-semibold text-white flex items-center">
                      <CheckBadgeIcon className="h-5 w-5 mr-2" />
                      Ready to Join
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {user.readyHackathons.map((hackathon, index) => (
                      <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{hackathon.name}</h3>
                            {hackathon.date && (
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                {new Date(hackathon.date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                            Ready
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hackathon History */}
              {user.joinedHackathons && user.joinedHackathons.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
                    <h2 className="text-lg font-semibold text-white flex items-center">
                      <ChartBarIcon className="h-5 w-5 mr-2" />
                      Hackathon History
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {user.joinedHackathons.map((entry, index) => (
                      <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{entry.hackathon?.name || 'Unknown Hackathon'}</h3>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              Joined: {new Date(entry.joinedAt).toLocaleDateString()}
                            </p>
                            {entry.placement && (
                              <p className="text-sm text-yellow-600 font-medium mt-1">
                                🏆 {entry.placement} Place
                              </p>
                            )}
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            entry.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            entry.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.status === 'completed' ? '✓ Completed' :
                             entry.status === 'active' ? '● Active' : 
                             entry.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                  <UserGroupIcon className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No hackathon activity yet</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {isOwnProfile 
                      ? "Start exploring hackathons to build your profile!" 
                      : `${displayName} hasn't joined any hackathons yet.`
                    }
                  </p>
                  {isOwnProfile && (
                    <Link
                      to="/hackathons"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Explore Hackathons
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
