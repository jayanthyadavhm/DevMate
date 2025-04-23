import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserCircleIcon, AcademicCapIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

const FindTeammates = () => {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    skills: '',
    hackathon: 'all',
    availability: 'all'
  });

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchUsers = async () => {
      try {
        // Simulated API response
        const mockUsers = [
          {
            id: 1,
            name: 'Alex Thompson',
            role: 'Full Stack Developer',
            university: 'MIT',
            skills: ['React', 'Node.js', 'Python', 'AWS'],
            experience: '3 hackathons',
            availability: 'Weekends',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
            bio: 'Passionate about building innovative solutions. Looking for teammates for upcoming hackathons.'
          },
          {
            id: 2,
            name: 'Sarah Chen',
            role: 'UI/UX Designer',
            university: 'Stanford University',
            skills: ['Figma', 'Adobe XD', 'React', 'HTML/CSS'],
            experience: '5 hackathons',
            availability: 'Flexible',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
            bio: 'Creative designer with a focus on user-centered design. Excited to collaborate on impactful projects.'
          },
          {
            id: 3,
            name: 'Michael Rodriguez',
            role: 'Backend Developer',
            university: 'UC Berkeley',
            skills: ['Java', 'Spring Boot', 'MongoDB', 'Docker'],
            experience: '2 hackathons',
            availability: 'Weekends',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
            bio: 'Backend specialist with experience in scalable systems. Looking for frontend developers to team up with.'
          }
        ];

        setUsers(mockUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to Find Teammates</h2>
        <p className="text-gray-600 mb-8">You need to be signed in to view and connect with potential teammates.</p>
        <Link
          to="/login"
          className="btn btn-primary"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Find Your Perfect Teammates
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Connect with talented students who share your passion for innovation
          </p>
        </div>

        {/* Filters */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Skills
              </label>
              <input
                type="text"
                name="skills"
                id="skills"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="e.g., React, Python"
                value={filters.skills}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <label htmlFor="hackathon" className="block text-sm font-medium text-gray-700">
                Hackathon
              </label>
              <select
                name="hackathon"
                id="hackathon"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={filters.hackathon}
                onChange={handleFilterChange}
              >
                <option value="all">All Hackathons</option>
                <option value="ai">AI Innovation Challenge</option>
                <option value="web3">Web3 Hackathon</option>
              </select>
            </div>

            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                Availability
              </label>
              <select
                name="availability"
                id="availability"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={filters.availability}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="weekends">Weekends</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Cards */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <img
                    className="h-16 w-16 rounded-full"
                    src={user.avatar}
                    alt={user.name}
                  />
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                    <p className="text-sm text-gray-500">{user.role}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-600">{user.university}</span>
                  </div>
                  <div className="flex items-center">
                    <CodeBracketIcon className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-600">{user.experience}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600">{user.bio}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">Skills</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
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

                <div className="mt-6 flex justify-end">
                  <Link
                    to={`/profile/${user.id}`}
                    className="text-primary-600 hover:text-primary-500 font-medium text-sm mr-4"
                  >
                    View Profile
                  </Link>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindTeammates;
