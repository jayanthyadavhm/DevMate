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
  MapPinIcon
} from '@heroicons/react/24/outline';

const UserProfile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const userData = await hackathonTeamsAPI.getUserProfile(id);
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id]);

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
                    className="h-32 w-32 rounded-full mx-auto object-cover"
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=128&background=6366f1&color=fff`}
                    alt={`${displayName}'s profile`}
                  />
                  <h1 className="mt-4 text-2xl font-bold text-gray-900">{displayName}</h1>
                  <p className="text-gray-600">{user.major || 'Student'}</p>
                  {user.role === 'organizer' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-2">
                      Organizer
                    </span>
                  )}
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6 space-y-4">
                  {user.university && (
                    <div className="flex items-center text-gray-600">
                      <AcademicCapIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{user.university}</span>
                      {user.yearOfStudy && <span className="ml-2">({user.yearOfStudy})</span>}
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.hackathonExperience && (
                    <div className="flex items-center text-gray-600">
                      <TrophyIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{user.hackathonExperience} Level</span>
                    </div>
                  )}
                </div>

                {user.bio && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">About</h3>
                    <p className="text-gray-600 text-sm">{user.bio}</p>
                  </div>
                )}

                {!isOwnProfile && (
                  <div className="mt-6">
                    <button className="w-full btn btn-primary flex items-center justify-center">
                      <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                      Send Team Request
                    </button>
                  </div>
                )}

                <div className="mt-6 flex justify-center space-x-4">
                  {user.githubUrl && (
                    <a
                      href={user.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-500"
                      title="GitHub"
                    >
                      <span className="sr-only">GitHub</span>
                      <LinkIcon className="h-6 w-6" />
                    </a>
                  )}
                  {user.linkedinUrl && (
                    <a
                      href={user.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-500"
                      title="LinkedIn"
                    >
                      <span className="sr-only">LinkedIn</span>
                      <LinkIcon className="h-6 w-6" />
                    </a>
                  )}
                  {user.portfolioUrl && (
                    <a
                      href={user.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-500"
                      title="Portfolio"
                    >
                      <span className="sr-only">Portfolio</span>
                      <LinkIcon className="h-6 w-6" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
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
            )}

            {/* Interests */}
            {user.interests && user.interests.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Interests</h2>
                </div>
                <div className="px-6 py-6">
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Hackathon Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Preferences */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Hackathon Preferences</h2>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Experience Level</h3>
                    <p className="mt-1 text-sm text-gray-600">{user.hackathonExperience || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Preferred Team Size</h3>
                    <p className="mt-1 text-sm text-gray-600">{user.preferredTeamSize ? `${user.preferredTeamSize} members` : 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Availability</h3>
                    <p className="mt-1 text-sm text-gray-600">{user.availability || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ready Hackathons */}
            {user.readyHackathons && user.readyHackathons.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Ready to Join</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {user.readyHackathons.map((hackathon, index) => (
                    <div key={index} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{hackathon.name}</h3>
                        {hackathon.date && (
                          <p className="text-sm text-gray-500">{new Date(hackathon.date).toLocaleDateString()}</p>
                        )}
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Ready
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Joined Hackathons */}
            {user.joinedHackathons && user.joinedHackathons.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Hackathon History</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {user.joinedHackathons.map((entry, index) => (
                    <div key={index} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{entry.hackathon?.name || 'Unknown Hackathon'}</h3>
                        <p className="text-sm text-gray-500">
                          Joined: {new Date(entry.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        entry.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        entry.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No content message */}
            {(!user.readyHackathons || user.readyHackathons.length === 0) && 
             (!user.joinedHackathons || user.joinedHackathons.length === 0) && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-12 text-center">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hackathon activity yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {isOwnProfile 
                      ? "Start exploring hackathons to build your profile!" 
                      : `${displayName} hasn't joined any hackathons yet.`
                    }
                  </p>
                  {isOwnProfile && (
                    <Link
                      to="/hackathons"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Explore Hackathons
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
