import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hackathonsAPI } from '../../services/apiServices';
import {
  ChartBarIcon,
  UserGroupIcon,
  TrophyIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  GlobeAltIcon,
  MapPinIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const OrganiserAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedHackathon, setSelectedHackathon] = useState('all');
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedHackathon, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulated analytics data - replace with actual API call
      const data = {
        overview: {
          totalHackathons: 12,
          totalParticipants: 1547,
          totalTeams: 432,
          totalProjects: 389,
          avgRating: 4.7,
          completionRate: 89.2
        },
        participation: {
          trend: 'up',
          change: 15.3,
          byTimeOfDay: [
            { hour: '00', participants: 45 },
            { hour: '06', participants: 23 },
            { hour: '12', participants: 187 },
            { hour: '18', participants: 156 },
            { hour: '24', participants: 89 }
          ],
          byDay: [
            { day: 'Mon', participants: 234 },
            { day: 'Tue', participants: 198 },
            { day: 'Wed', participants: 267 },
            { day: 'Thu', participants: 301 },
            { day: 'Fri', participants: 389 },
            { day: 'Sat', participants: 156 },
            { day: 'Sun', participants: 123 }
          ]
        },
        demographics: {
          countries: [
            { name: 'United States', count: 456, percentage: 29.5 },
            { name: 'India', count: 389, percentage: 25.1 },
            { name: 'United Kingdom', count: 234, percentage: 15.1 },
            { name: 'Germany', count: 178, percentage: 11.5 },
            { name: 'Canada', count: 156, percentage: 10.1 },
            { name: 'Others', count: 134, percentage: 8.7 }
          ],
          skillLevels: [
            { level: 'Beginner', count: 456, percentage: 29.5 },
            { level: 'Intermediate', count: 623, percentage: 40.3 },
            { level: 'Advanced', count: 312, percentage: 20.2 },
            { level: 'Expert', count: 156, percentage: 10.0 }
          ],
          technologies: [
            { name: 'JavaScript', count: 789 },
            { name: 'Python', count: 567 },
            { name: 'React', count: 445 },
            { name: 'Node.js', count: 334 },
            { name: 'Machine Learning', count: 278 }
          ]
        },
        engagement: {
          views: 15467,
          likes: 3421,
          shares: 892,
          registrations: 1547,
          conversionRate: 10.0,
          devices: {
            desktop: 67.8,
            mobile: 28.9,
            tablet: 3.3
          }
        },
        topPerformers: [
          { name: 'AI Innovation Challenge', participants: 456, rating: 4.9 },
          { name: 'Web3 Hackathon', participants: 389, rating: 4.8 },
          { name: 'Mobile App Contest', participants: 334, rating: 4.7 },
          { name: 'Green Tech Challenge', participants: 278, rating: 4.6 }
        ]
      };
      
      setAnalyticsData(data);
    } catch (err) {
      setError('Failed to load analytics data. Please try again.');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Unavailable</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { overview, participation, demographics, engagement, topPerformers } = analyticsData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Insights and performance metrics for your hackathons
              </p>
            </div>
            <div className="flex space-x-4">
              <select
                value={selectedHackathon}
                onChange={(e) => setSelectedHackathon(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Hackathons</option>
                <option value="recent">Recent Events</option>
                <option value="active">Active Events</option>
              </select>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Hackathons</p>
                <p className="text-2xl font-bold text-gray-900">{overview.totalHackathons}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900">{overview.totalParticipants.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Teams</p>
                <p className="text-2xl font-bold text-gray-900">{overview.totalTeams}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <TrophyIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{overview.totalProjects}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <HeartIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">{overview.avgRating}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{overview.completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Participation Trend */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Participation Trend</h3>
              <div className="flex items-center text-green-600">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+{participation.change}%</span>
              </div>
            </div>
            <div className="space-y-4">
              {participation.byDay.map(day => (
                <div key={day.day} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">{day.day}</div>
                  <div className="flex-1 ml-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 rounded-full h-2"
                        style={{ width: `${(day.participants / 400) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm text-gray-900">{day.participants}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Hackathons */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Hackathons</h3>
            <div className="space-y-4">
              {topPerformers.map((hackathon, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{hackathon.name}</h4>
                    <p className="text-sm text-gray-600">{hackathon.participants} participants</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-yellow-600">
                      <span className="text-sm font-medium">{hackathon.rating}</span>
                      <HeartIcon className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Geographic Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
            <div className="space-y-3">
              {demographics.countries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{country.name}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-500 rounded-full h-2"
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{country.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Level Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Level Distribution</h3>
            <div className="space-y-3">
              {demographics.skillLevels.map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{skill.level}</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 rounded-full h-2"
                        style={{ width: `${skill.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{skill.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Technologies */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Technologies</h3>
            <div className="space-y-3">
              {demographics.technologies.map((tech, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{tech.name}</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-purple-500 rounded-full h-2"
                        style={{ width: `${(tech.count / 789) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{tech.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <EyeIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{engagement.views.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <HeartIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{engagement.likes.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Likes</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <ShareIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{engagement.shares}</p>
                <p className="text-sm text-gray-600">Shares</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <UserGroupIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{engagement.conversionRate}%</p>
                <p className="text-sm text-gray-600">Conversion Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Usage</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ComputerDesktopIcon className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-sm text-gray-900">Desktop</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-500 rounded-full h-2"
                      style={{ width: `${engagement.devices.desktop}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{engagement.devices.desktop}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DevicePhoneMobileIcon className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-sm text-gray-900">Mobile</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-500 rounded-full h-2"
                      style={{ width: `${engagement.devices.mobile}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{engagement.devices.mobile}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ComputerDesktopIcon className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-sm text-gray-900">Tablet</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-purple-500 rounded-full h-2"
                      style={{ width: `${engagement.devices.tablet}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{engagement.devices.tablet}%</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex">
                <InformationCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Tip:</strong> Consider optimizing for mobile users as they represent a significant portion of your audience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganiserAnalytics;
