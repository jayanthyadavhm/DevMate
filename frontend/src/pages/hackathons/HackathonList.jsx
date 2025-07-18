import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, UsersIcon, MapPinIcon, TrophyIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { hackathonsAPI } from '../../services/apiServices';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [filteredHackathons, setFilteredHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setLoading(true);
        const response = await hackathonsAPI.getHackathons();
        setHackathons(response);
        setFilteredHackathons(response);
      } catch (err) {
        setError('Failed to load hackathons. Please try again.');
        setHackathons([]);
        setFilteredHackathons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  useEffect(() => {
    let filtered = hackathons;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(hackathon =>
        hackathon.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hackathon.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(hackathon =>
        hackathon.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredHackathons(filtered);
  }, [hackathons, searchTerm, selectedCategory]);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hackathons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Hackathons
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join exciting hackathons, build innovative solutions, and connect with talented developers worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search hackathons..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="ai">AI & Machine Learning</option>
                <option value="web">Web Development</option>
                <option value="mobile">Mobile Apps</option>
                <option value="blockchain">Blockchain</option>
                <option value="sustainability">Sustainability</option>
                <option value="fintech">FinTech</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredHackathons.length} of {hackathons.length} hackathons
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Hackathons Grid */}
        {filteredHackathons.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <CalendarIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {hackathons.length === 0 ? 'No hackathons available' : 'No hackathons match your search'}
            </h3>
            <p className="text-gray-600 mb-6">
              {hackathons.length === 0 
                ? 'Check back later for new opportunities!' 
                : 'Try adjusting your search terms or filters.'
              }
            </p>
            {searchTerm || selectedCategory !== 'all' ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredHackathons.map((hackathon) => (
              <div
                key={hackathon._id || hackathon.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {hackathon.name || hackathon.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {hackathon.description}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2 ${getStatusColor(hackathon.status || 'upcoming')}`}>
                      {hackathon.status || 'Upcoming'}
                    </span>
                  </div>

                  {/* Organizer */}
                  {hackathon.organiser && (
                    <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-600 text-sm font-medium">
                          {hackathon.organiser.username?.[0]?.toUpperCase() || 'O'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {hackathon.organiser.username || 'Organizer'}
                        </p>
                        <p className="text-xs text-gray-500">Event Host</p>
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-3 text-gray-400" />
                      <span>{formatDate(hackathon.date || hackathon.startDate)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-3 text-gray-400" />
                      <span>{hackathon.location || 'Virtual'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <UsersIcon className="h-4 w-4 mr-3 text-gray-400" />
                      <span>Team Size: {hackathon.teamSize || '2-4 members'}</span>
                    </div>
                    {hackathon.prizePool && (
                      <div className="flex items-center text-sm text-gray-600">
                        <TrophyIcon className="h-4 w-4 mr-3 text-gray-400" />
                        <span className="font-medium text-green-600">{hackathon.prizePool}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/hackathons/${hackathon._id || hackathon.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Learn More →
                    </Link>
                    <Link
                      to={`/hackathons/${hackathon._id || hackathon.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {hackathons.length > 0 && (
          <div className="mt-16 text-center bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Join our community of innovators and build the future. Connect with teammates, learn new skills, and win amazing prizes.
            </p>
            <Link
              to="/find-teammates"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Find Teammates
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HackathonList;
