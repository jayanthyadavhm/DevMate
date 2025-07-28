import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hackathonTeamsAPI, hackathonsAPI } from '../../services/apiServices';
import { 
  UserCircleIcon, 
  AcademicCapIcon, 
  CodeBracketIcon, 
  MagnifyingGlassIcon,
  EnvelopeIcon,
  UserPlusIcon,
  FunnelIcon,
  StarIcon,
  MapPinIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const FindTeammates = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sendingRequest, setSendingRequest] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const allSkills = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 
    'Docker', 'MongoDB', 'PostgreSQL', 'GraphQL', 'Vue.js', 'Angular',
    'Java', 'C++', 'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native',
    'UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch',
    'Blockchain', 'Solidity', 'Web3', 'Smart Contracts', 'DeFi'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch hackathons and ready users in parallel
        const [hackathonsRes, readyUsersRes] = await Promise.all([
          hackathonsAPI.getHackathons(),
          hackathonTeamsAPI.getReadyUsers()
        ]);
        
        setHackathons([{ _id: 'all', name: 'All Hackathons' }, ...hackathonsRes]);
        
        // Enhance user data for better UI
        const enhancedUsers = readyUsersRes.map(user => ({
          ...user,
          id: user._id,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username,
          role: 'Student Developer',
          university: user.university || 'University',
          skills: user.skills && user.skills.length > 0 ? user.skills : getRandomSkills(),
          experience: user.hackathonExperience || `${Math.floor(Math.random() * 5) + 1} hackathons`,
          availability: user.availability || ['Weekends', 'Evenings', 'Flexible'][Math.floor(Math.random() * 3)],
          avatar: user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`,
          bio: user.bio || 'Passionate developer looking for amazing teammates to build innovative solutions.',
          rating: (4.0 + Math.random()).toFixed(1),
          location: user.location || 'Remote',
          interestedHackathons: user.readyHackathons?.map(h => h._id) || []
        }));
        
        setUsers(enhancedUsers);
        setFilteredUsers(enhancedUsers);
      } catch (err) {
        setError('Failed to load teammates. Please try again.');
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const getRandomSkills = () => {
    const shuffled = allSkills.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 5) + 3);
  };

  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by selected skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(user =>
        selectedSkills.some(skill => user.skills.includes(skill))
      );
    }

    // Filter by hackathon
    if (selectedHackathon !== 'all') {
      filtered = filtered.filter(user =>
        user.interestedHackathons.includes(selectedHackathon)
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedSkills, selectedHackathon]);

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSendRequest = async (toUserId) => {
    if (!selectedHackathon || selectedHackathon === 'all') {
      setNotification({
        show: true,
        message: 'Please select a specific hackathon to send team requests.',
        type: 'warning'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      return;
    }

    try {
      setSendingRequest(prev => ({ ...prev, [toUserId]: true }));
      await hackathonTeamsAPI.sendJoinRequest(toUserId, selectedHackathon);
      
      setNotification({
        show: true,
        message: 'Team request sent successfully!',
        type: 'success'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      setNotification({
        show: true,
        message: err.message || 'Failed to send team request',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } finally {
      setSendingRequest(prev => ({ ...prev, [toUserId]: false }));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSkills([]);
    setSelectedHackathon('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Finding amazing teammates for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${
          notification.type === 'success' ? 'bg-green-50 border-green-200' :
          notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'
        } border rounded-lg shadow-lg p-4`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
            ) : notification.type === 'warning' ? (
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3" />
            ) : (
              <XMarkIcon className="h-6 w-6 text-red-600 mr-3" />
            )}
            <p className={`text-sm font-medium ${
              notification.type === 'success' ? 'text-green-800' :
              notification.type === 'warning' ? 'text-yellow-800' :
              'text-red-800'
            }`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Find Your Perfect Teammates
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Connect with talented students who share your passion for innovation
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name, role, or skills..."
                  className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Hackathon Filter */}
            <div>
              <label htmlFor="hackathon" className="block text-sm font-medium text-gray-700 mb-2">
                Hackathon
              </label>
              <select
                id="hackathon"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={selectedHackathon}
                onChange={(e) => setSelectedHackathon(e.target.value)}
              >
                {hackathons.map((hackathon) => (
                  <option key={hackathon._id} value={hackathon._id}>
                    {hackathon.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills ({selectedSkills.length} selected)
              </label>
              <div className="relative">
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onChange={(e) => {
                    if (e.target.value && !selectedSkills.includes(e.target.value)) {
                      handleSkillToggle(e.target.value);
                    }
                    e.target.value = '';
                  }}
                >
                  <option value="">Add skill filter...</option>
                  {allSkills.filter(skill => !selectedSkills.includes(skill)).map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
              {selectedSkills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {skill}
                      <button
                        onClick={() => handleSkillToggle(skill)}
                        className="ml-1 h-4 w-4 text-primary-600 hover:text-primary-800"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredUsers.length} teammate{filteredUsers.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {filteredUsers.length === 0 && !loading && !error ? (
          <div className="text-center py-12">
            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No teammates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={user.avatar}
                      alt={user.name}
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.role}</p>
                      <div className="flex items-center mt-1">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{user.rating}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-gray-600 line-clamp-2">{user.bio}</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      <span>{user.university}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CodeBracketIcon className="h-4 w-4 mr-2" />
                      <span>{user.experience}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {user.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {user.skills.length > 4 && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          +{user.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    {user.id ? (
                      <Link
                        to={`/profile/${user.id}`}
                        className="text-primary-600 hover:text-primary-500 font-medium text-sm"
                      >
                        View Profile
                      </Link>
                    ) : (
                      <span className="text-gray-400 text-sm">Profile unavailable</span>
                    )}
                    <button
                      onClick={() => handleSendRequest(user.id)}
                      disabled={sendingRequest[user.id]}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {sendingRequest[user.id] ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <UserPlusIcon className="h-4 w-4 mr-2" />
                      )}
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindTeammates;
