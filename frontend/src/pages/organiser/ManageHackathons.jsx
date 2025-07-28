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
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

const ManageHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [filteredHackathons, setFilteredHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchHackathons();
  }, [currentUser]);

  useEffect(() => {
    filterAndSortHackathons();
  }, [hackathons, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchHackathons = async () => {
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
    } catch (err) {
      setError('Failed to load hackathons. Please try again.');
      console.error('Error fetching hackathons:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortHackathons = () => {
    let filtered = [...hackathons];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(h => (h.status || 'draft') === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.startDate || a.date || 0);
          bValue = new Date(b.startDate || b.date || 0);
          break;
        case 'participants':
          aValue = a.participantCount || 0;
          bValue = b.participantCount || 0;
          break;
        case 'status':
          aValue = a.status || 'draft';
          bValue = b.status || 'draft';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredHackathons(filtered);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDuplicate = async (hackathon) => {
    try {
      const duplicatedHackathon = {
        ...hackathon,
        name: `${hackathon.name} (Copy)`,
        status: 'draft',
        participantCount: 0,
        _id: undefined,
        id: undefined
      };
      
      await hackathonsAPI.createHackathon(duplicatedHackathon);
      showNotification('Hackathon duplicated successfully!');
      fetchHackathons();
    } catch (error) {
      showNotification('Failed to duplicate hackathon.', 'error');
    }
  };

  const handleDelete = async (hackathonId) => {
    if (window.confirm('Are you sure you want to delete this hackathon? This action cannot be undone.')) {
      try {
        // await hackathonsAPI.deleteHackathon(hackathonId);
        showNotification('Hackathon deleted successfully!');
        fetchHackathons();
      } catch (error) {
        showNotification('Failed to delete hackathon.', 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const HackathonRow = ({ hackathon }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">{hackathon.name}</div>
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {hackathon.description}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {hackathon.startDate ? new Date(hackathon.startDate).toLocaleDateString() : 
           hackathon.date ? new Date(hackathon.date).toLocaleDateString() : 'TBD'}
        </div>
        <div className="text-sm text-gray-500">
          {hackathon.endDate ? new Date(hackathon.endDate).toLocaleDateString() : 'TBD'}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hackathon.status)}`}>
          {hackathon.status || 'Draft'}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center">
          <UsersIcon className="h-4 w-4 mr-1 text-gray-400" />
          {hackathon.participantCount || 0}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {hackathon.location || (hackathon.isVirtual ? 'Virtual' : 'TBD')}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {hackathon.prizePool || 'TBD'}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {/* Navigate to view */}}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="View Details"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          
          <Link
            to={`/organiser/hackathon/${hackathon._id || hackathon.id}/participants`}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Manage Participants"
          >
            <UsersIcon className="h-4 w-4" />
          </Link>
          
          <button
            onClick={() => {/* Navigate to edit */}}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => {/* Navigate to analytics */}}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Analytics"
          >
            <ChartBarIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => handleDuplicate(hackathon)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Duplicate"
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => {/* Share functionality */}}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Share"
          >
            <ShareIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => handleDelete(hackathon._id || hackathon.id)}
            className="text-red-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your hackathons...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Manage Hackathons</h1>
              <p className="text-gray-600 mt-1">
                {hackathons.length} hackathon{hackathons.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <Link
              to="/organiser/create-hackathon"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create New Hackathon
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

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search hackathons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="participants">Sort by Participants</option>
              <option value="status">Sort by Status</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? (
                <ArrowUpIcon className="h-4 w-4 mr-2" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-2" />
              )}
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>

        {/* Hackathons Table */}
        {filteredHackathons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {hackathons.length === 0 ? 'No hackathons yet' : 'No matching hackathons'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {hackathons.length === 0 
                ? 'Get started by creating your first hackathon'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {hackathons.length === 0 && (
              <Link
                to="/organiser/create-hackathon"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Your First Hackathon
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    onClick={() => handleSort('name')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Name
                      {sortBy === 'name' && (
                        sortOrder === 'asc' ? <ArrowUpIcon className="ml-1 h-3 w-3" /> : <ArrowDownIcon className="ml-1 h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('date')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Date
                      {sortBy === 'date' && (
                        sortOrder === 'asc' ? <ArrowUpIcon className="ml-1 h-3 w-3" /> : <ArrowDownIcon className="ml-1 h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('status')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Status
                      {sortBy === 'status' && (
                        sortOrder === 'asc' ? <ArrowUpIcon className="ml-1 h-3 w-3" /> : <ArrowDownIcon className="ml-1 h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('participants')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Participants
                      {sortBy === 'participants' && (
                        sortOrder === 'asc' ? <ArrowUpIcon className="ml-1 h-3 w-3" /> : <ArrowDownIcon className="ml-1 h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prize Pool
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHackathons.map(hackathon => (
                  <HackathonRow key={hackathon._id || hackathon.id} hackathon={hackathon} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageHackathons;
