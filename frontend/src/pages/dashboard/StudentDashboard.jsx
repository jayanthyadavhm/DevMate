import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { hackathonsAPI, hackathonTeamsAPI } from '../../services/apiServices';
import { useAuth } from '../../context/AuthContext';
import { 
  CalendarIcon, 
  UsersIcon, 
  TrophyIcon, 
  PlusIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  InboxIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joinedHackathons, setJoinedHackathons] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('discover');
  const [joiningHackathon, setJoiningHackathon] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [hackathonsRes, joinRequestsRes] = await Promise.all([
          hackathonsAPI.getHackathons(),
          hackathonTeamsAPI.getJoinRequests()
        ]);
        setHackathons(hackathonsRes);
        setJoinRequests(joinRequestsRes);
        setJoinedHackathons([]); // TODO: Implement joined hackathons API
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        setHackathons([]);
        setJoinRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJoinHackathon = async (hackathonId) => {
    try {
      setJoiningHackathon(prev => ({ ...prev, [hackathonId]: true }));
      await hackathonTeamsAPI.markReady(hackathonId);
      
      setNotification({
        show: true,
        message: 'Successfully joined hackathon! You are now marked as ready to find teammates.',
        type: 'success'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
      
      // Refresh data
      const updatedHackathons = await hackathonsAPI.getHackathons();
      setHackathons(updatedHackathons);
    } catch (err) {
      setNotification({
        show: true,
        message: err.message || 'Failed to join hackathon. Please try again.',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
    } finally {
      setJoiningHackathon(prev => ({ ...prev, [hackathonId]: false }));
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await hackathonTeamsAPI.acceptRequest(requestId);
      setNotification({
        show: true,
        message: 'Team request accepted successfully!',
        type: 'success'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      
      // Refresh join requests
      const updatedRequests = await hackathonTeamsAPI.getJoinRequests();
      setJoinRequests(updatedRequests);
    } catch (err) {
      setNotification({
        show: true,
        message: err.message || 'Failed to accept request',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await hackathonTeamsAPI.rejectRequest(requestId);
      setNotification({
        show: true,
        message: 'Team request rejected.',
        type: 'success'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      
      // Refresh join requests
      const updatedRequests = await hackathonTeamsAPI.getJoinRequests();
      setJoinRequests(updatedRequests);
    } catch (err) {
      setNotification({
        show: true,
        message: err.message || 'Failed to reject request',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600", 
      teal: "bg-teal-100 text-teal-600",
      yellow: "bg-yellow-100 text-yellow-600",
      red: "bg-red-100 text-red-600"
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${colorClasses[color] || colorClasses.blue}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  const HackathonCard = ({ hackathon, isJoined = false }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{hackathon.title || hackathon.name}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hackathon.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>{hackathon.startDate || hackathon.date} - {hackathon.endDate || 'TBD'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPinIcon className="h-4 w-4 mr-2" />
                <span>{hackathon.location || 'Virtual'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <TrophyIcon className="h-4 w-4 mr-2" />
                <span>{hackathon.prizePool || 'TBD'}</span>
              </div>
            </div>
          </div>
          {hackathon.status && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              hackathon.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
              hackathon.status === 'active' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {hackathon.status}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <Link
              to={`/hackathons/${hackathon._id || hackathon.id}`}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View Details
            </Link>
            <Link
              to={"/find-teammates"}
              className="text-gray-600 hover:text-gray-700 text-sm font-medium"
            >
              Find Team
            </Link>
          </div>
          {!isJoined ? (
            <button
              onClick={() => handleJoinHackathon(hackathon._id || hackathon.id)}
              disabled={joiningHackathon[hackathon._id || hackathon.id]}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {joiningHackathon[hackathon._id || hackathon.id] ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
              ) : (
                <PlusIcon className="h-4 w-4 mr-1" />
              )}
              Join
            </button>
          ) : (
            <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Joined
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mt-1">Discover hackathons and build amazing projects</p>
            </div>
            <Link
              to="/hackathons"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Explore All Hackathons
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={CalendarIcon} title="Available Hackathons" value={hackathons.length} color="blue" />
          <StatCard icon={UserGroupIcon} title="Joined Events" value={joinedHackathons.length} color="green" />
          <StatCard icon={InboxIcon} title="Team Requests" value={joinRequests.length} color="purple" />
          <StatCard icon={SparklesIcon} title="Ready to Team Up" value={hackathons.filter(h => currentUser?.readyHackathons?.includes(h._id)).length || 0} color="yellow" />
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'discover', label: 'Discover', count: hackathons.length },
              { key: 'joined', label: 'My Hackathons', count: joinedHackathons.length },
              { key: 'requests', label: 'Team Requests', count: joinRequests.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'discover' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Available Hackathons</h2>
              {hackathons.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hackathons available</h3>
                  <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {hackathons.map(hackathon => (
                    <HackathonCard key={hackathon._id || hackathon.id} hackathon={hackathon} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'joined' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">My Hackathons</h2>
              {joinedHackathons.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No joined hackathons</h3>
                  <p className="mt-1 text-sm text-gray-500">Join a hackathon to get started!</p>
                  <Link
                    to="/hackathons"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Browse Hackathons
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {joinedHackathons.map(hackathon => (
                    <HackathonCard key={hackathon._id || hackathon.id} hackathon={hackathon} isJoined={true} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Team Requests</h2>
              {joinRequests.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No team requests</h3>
                  <p className="mt-1 text-sm text-gray-500">When others want to team up with you, they'll appear here!</p>
                  <Link
                    to="/find-teammates"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Find Teammates
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {joinRequests.map((request, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <UsersIcon className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">
                              Team request from {request.from?.username || 'Unknown'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              For: {request.hackathon?.name || 'Unknown Hackathon'}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleAcceptRequest(request._id || request.id)}
                            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleRejectRequest(request._id || request.id)}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
