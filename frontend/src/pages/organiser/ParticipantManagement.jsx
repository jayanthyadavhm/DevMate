import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hackathonsAPI } from '../../services/apiServices';
import {
  UserGroupIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  UserPlusIcon,
  UserMinusIcon,
  ClockIcon,
  CalendarIcon,
  TrophyIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const ParticipantManagement = () => {
  const { hackathonId } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [selectedView, setSelectedView] = useState('participants');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const { currentUser } = useAuth();

  useEffect(() => {
    if (hackathonId) {
      fetchHackathonData();
    }
  }, [hackathonId]);

  useEffect(() => {
    filterParticipants();
  }, [participants, searchTerm, statusFilter, skillFilter]);

  const fetchHackathonData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulated data - replace with actual API calls
      const hackathonData = {
        _id: hackathonId,
        name: 'AI Innovation Challenge 2024',
        description: 'Build the next generation of AI applications',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        maxParticipants: 200,
        registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'upcoming'
      };

      const participantsData = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          university: 'MIT',
          major: 'Computer Science',
          year: 'Junior',
          skills: ['JavaScript', 'React', 'Python'],
          experience: 'Intermediate',
          registrationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'confirmed',
          teamId: 'team1',
          previousHackathons: 3,
          github: 'github.com/johndoe',
          portfolio: 'johndoe.dev'
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1234567891',
          university: 'Stanford',
          major: 'Electrical Engineering',
          year: 'Senior',
          skills: ['Python', 'Machine Learning', 'TensorFlow'],
          experience: 'Advanced',
          registrationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'pending',
          teamId: null,
          previousHackathons: 7,
          github: 'github.com/janesmith',
          portfolio: 'janesmith.io'
        }
        // Add more participants as needed
      ];

      const teamsData = [
        {
          _id: 'team1',
          name: 'AI Innovators',
          members: ['1'],
          captain: '1',
          skills: ['JavaScript', 'React', 'Python'],
          lookingForMembers: true,
          maxMembers: 4
        }
      ];

      setHackathon(hackathonData);
      setParticipants(participantsData);
      setTeams(teamsData);
      
    } catch (err) {
      setError('Failed to load hackathon data. Please try again.');
      console.error('Error fetching hackathon data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterParticipants = () => {
    let filtered = [...participants];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Apply skill filter
    if (skillFilter !== 'all') {
      filtered = filtered.filter(p => p.experience === skillFilter);
    }

    setFilteredParticipants(filtered);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
  };

  const handleApproveParticipant = async (participantId) => {
    try {
      // API call to approve participant
      setParticipants(prev => prev.map(p => 
        p._id === participantId ? { ...p, status: 'confirmed' } : p
      ));
      showNotification('Participant approved successfully!');
    } catch (error) {
      showNotification('Failed to approve participant.', 'error');
    }
  };

  const handleRejectParticipant = async (participantId) => {
    if (window.confirm('Are you sure you want to reject this participant?')) {
      try {
        // API call to reject participant
        setParticipants(prev => prev.map(p => 
          p._id === participantId ? { ...p, status: 'rejected' } : p
        ));
        showNotification('Participant rejected.');
      } catch (error) {
        showNotification('Failed to reject participant.', 'error');
      }
    }
  };

  const exportParticipants = () => {
    // Create CSV data
    const csvData = filteredParticipants.map(p => ({
      Name: p.name,
      Email: p.email,
      University: p.university,
      Major: p.major,
      Year: p.year,
      Skills: p.skills.join('; '),
      Experience: p.experience,
      Status: p.status,
      'Registration Date': p.registrationDate.toLocaleDateString(),
      'Previous Hackathons': p.previousHackathons
    }));

    // Convert to CSV and download
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(csvData[0]).join(",") + "\n"
      + csvData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${hackathon?.name || 'hackathon'}_participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Participant data exported successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceColor = (experience) => {
    switch (experience) {
      case 'Beginner':
        return 'bg-blue-100 text-blue-800';
      case 'Intermediate':
        return 'bg-purple-100 text-purple-800';
      case 'Advanced':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading participant data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchHackathonData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Try Again
          </button>
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
          'bg-red-50 border-red-200'
        } border rounded-lg shadow-lg p-4`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
            ) : (
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
            )}
            <p className={`text-sm font-medium ${
              notification.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <Link to="/organiser" className="hover:text-gray-700">Organiser</Link>
                <span>/</span>
                <Link to="/organiser/manage-hackathons" className="hover:text-gray-700">Manage Hackathons</Link>
                <span>/</span>
                <span className="text-gray-900">Participants</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">{hackathon?.name}</h1>
              <p className="text-gray-600 mt-1">
                {filteredParticipants.length} of {participants.length} participants
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportParticipants}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export Data
              </button>
              <Link
                to={`/organiser/manage-hackathons`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
              >
                Back to Hackathons
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Registered</p>
                <p className="text-2xl font-bold text-gray-900">{participants.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {participants.filter(p => p.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {participants.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <TrophyIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Teams Formed</p>
                <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedView('participants')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedView === 'participants'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserIcon className="h-4 w-4 inline mr-2" />
              Participants
            </button>
            <button
              onClick={() => setSelectedView('teams')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedView === 'teams'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserGroupIcon className="h-4 w-4 inline mr-2" />
              Teams
            </button>
            <button
              onClick={() => setSelectedView('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedView === 'analytics'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ChartBarIcon className="h-4 w-4 inline mr-2" />
              Analytics
            </button>
          </div>
        </div>

        {/* Participants View */}
        {selectedView === 'participants' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search participants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Experience</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <div className="text-sm text-gray-600 flex items-center">
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  {filteredParticipants.length} results
                </div>
              </div>
            </div>

            {/* Participants Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Education
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills & Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParticipants.map(participant => (
                    <tr key={participant._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                            <div className="text-sm text-gray-500">{participant.email}</div>
                            {participant.phone && (
                              <div className="text-xs text-gray-400">{participant.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{participant.university}</div>
                        <div className="text-sm text-gray-500">{participant.major}</div>
                        <div className="text-xs text-gray-400">{participant.year}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {participant.skills.slice(0, 3).map(skill => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800"
                            >
                              {skill}
                            </span>
                          ))}
                          {participant.skills.length > 3 && (
                            <span className="text-xs text-gray-500">+{participant.skills.length - 3} more</span>
                          )}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExperienceColor(participant.experience)}`}>
                          {participant.experience}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(participant.status)}`}>
                          {participant.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{participant.registrationDate.toLocaleDateString()}</div>
                        <div className="text-xs">{participant.previousHackathons} prev. events</div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {participant.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveParticipant(participant._id)}
                                className="text-green-600 hover:text-green-900"
                                title="Approve"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRejectParticipant(participant._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Reject"
                              >
                                <XCircleIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {/* View details */}}
                            className="text-gray-400 hover:text-gray-600"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {/* Contact participant */}}
                            className="text-gray-400 hover:text-gray-600"
                            title="Contact"
                          >
                            <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredParticipants.length === 0 && (
                <div className="text-center py-12">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No participants found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Teams View */}
        {selectedView === 'teams' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map(team => (
                <div key={team._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{team.name}</h4>
                    <span className="text-sm text-gray-500">
                      {team.members.length}/{team.maxMembers} members
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {team.skills.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary-100 text-primary-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {team.lookingForMembers && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Looking for members
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {selectedView === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Timeline</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last 7 days</span>
                    <span className="text-sm font-medium text-gray-900">23 registrations</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Distribution</h3>
                <div className="space-y-2">
                  {['JavaScript', 'Python', 'React', 'Machine Learning'].map((skill, index) => (
                    <div key={skill} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{skill}</span>
                      <span className="text-sm font-medium text-gray-900">{[45, 38, 32, 28][index]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantManagement;
