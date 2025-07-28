import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hackathonsAPI } from '../../services/apiServices';
import {
  CalendarIcon,
  UserGroupIcon,
  TrophyIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ChartBarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  FireIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import {
  ChartBarIcon as ChartBarIconSolid,
  CalendarIcon as CalendarIconSolid,
  TrophyIcon as TrophyIconSolid,
  UserGroupIcon as UserGroupIconSolid
} from '@heroicons/react/24/solid';

const OrganiserDashboard = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalHackathons: 0,
    activeHackathons: 0,
    totalParticipants: 0,
    totalPrizePool: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const allHackathons = await hackathonsAPI.getHackathons();
      const myHackathons = allHackathons.filter(h => {
        if (!h.organiser) return false;
        const orgId = h.organiser._id || h.organiser.id || h.organiser;
        const userId = currentUser.id || currentUser._id;
        return orgId === userId;
      });

      setHackathons(myHackathons);
      
      // Calculate stats
      const activeCount = myHackathons.filter(h => h.status === 'active' || h.status === 'upcoming').length;
      const totalParticipants = myHackathons.reduce((sum, h) => sum + (h.participantCount || 0), 0);
      const totalPrizePool = myHackathons.reduce((sum, h) => {
        const prize = h.prizePool ? parseInt(h.prizePool.replace(/[^0-9]/g, '')) : 0;
        return sum + prize;
      }, 0);

      setStats({
        totalHackathons: myHackathons.length,
        activeHackathons: activeCount,
        totalParticipants,
        totalPrizePool
      });

      // Mock recent activity (in real app, this would come from API)
      setRecentActivity([
        { id: 1, type: 'registration', message: 'New team registered for "AI Innovation Challenge"', time: '2 hours ago' },
        { id: 2, type: 'submission', message: '15 projects submitted for "Web Dev Hackathon"', time: '4 hours ago' },
        { id: 3, type: 'winner', message: 'Winners announced for "Mobile App Challenge"', time: '1 day ago' }
      ]);

    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
  };

  const StatCard = ({ icon: Icon, solidIcon: SolidIcon, title, value, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-gradient-to-br ${color}`}>
          <SolidIcon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const HackathonCard = ({ hackathon }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{hackathon.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{hackathon.description}</p>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{hackathon.date || 'TBD'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                <span>{hackathon.participantCount || 0} participants</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <TrophyIcon className="h-4 w-4 mr-1" />
                <span>{hackathon.prizePool || 'TBD'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className={`px-2 py-1 text-xs font-medium rounded-full mb-2 ${
              hackathon.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
              hackathon.status === 'active' ? 'bg-green-100 text-green-800' :
              hackathon.status === 'completed' ? 'bg-gray-100 text-gray-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {hackathon.status || 'Draft'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <EyeIcon className="h-4 w-4 mr-1" />
              View
            </button>
            <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <ChartBarIcon className="h-4 w-4 mr-1" />
              Analytics
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-1">
              {/* Avatar placeholders for recent participants */}
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
              ))}
            </div>
            <span className="text-xs text-gray-500">+{hackathon.participantCount || 0}</span>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
              <h1 className="text-2xl font-bold text-gray-900">Organiser Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your hackathons and track performance</p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Cog6ToothIcon className="h-4 w-4 mr-2" />
                Settings
              </button>
              <Link
                to="/organiser/create-hackathon"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Hackathon
              </Link>
            </div>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={CalendarIcon}
            solidIcon={CalendarIconSolid}
            title="Total Hackathons"
            value={stats.totalHackathons}
            color="from-blue-500 to-blue-600"
            subtitle="All time"
          />
          <StatCard
            icon={FireIcon}
            solidIcon={TrophyIconSolid}
            title="Active Events"
            value={stats.activeHackathons}
            color="from-green-500 to-green-600"
            subtitle="Currently running"
          />
          <StatCard
            icon={UserGroupIcon}
            solidIcon={UserGroupIconSolid}
            title="Total Participants"
            value={stats.totalParticipants}
            color="from-teal-500 to-teal-600"
            subtitle="Across all events"
          />
          <StatCard
            icon={CurrencyDollarIcon}
            solidIcon={ChartBarIconSolid}
            title="Prize Pool"
            value={`$${stats.totalPrizePool.toLocaleString()}`}
            color="from-yellow-500 to-yellow-600"
            subtitle="Total distributed"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hackathons List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Your Hackathons</h2>
              <Link
                to="/organiser/hackathons"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            
            {hackathons.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hackathons yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first hackathon</p>
                <Link
                  to="/organiser/create-hackathon"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Your First Hackathon
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {hackathons.slice(0, 3).map(hackathon => (
                  <HackathonCard key={hackathon._id || hackathon.id} hackathon={hackathon} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <BellIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'registration' ? 'bg-blue-400' :
                      activity.type === 'submission' ? 'bg-green-400' :
                      'bg-yellow-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/organiser/create-hackathon"
                  className="flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-3 text-gray-400" />
                  Create New Hackathon
                </Link>
                <Link
                  to="/organiser/participants"
                  className="flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <UsersIcon className="h-4 w-4 mr-3 text-gray-400" />
                  Manage Participants
                </Link>
                <Link
                  to="/organiser/analytics"
                  className="flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ChartBarIcon className="h-4 w-4 mr-3 text-gray-400" />
                  View Analytics
                </Link>
                <Link
                  to="/organiser/settings"
                  className="flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Cog6ToothIcon className="h-4 w-4 mr-3 text-gray-400" />
                  Account Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganiserDashboard;
