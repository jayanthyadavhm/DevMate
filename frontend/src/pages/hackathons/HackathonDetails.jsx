import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CalendarIcon, MapPinIcon, UsersIcon, TrophyIcon, ClockIcon } from '@heroicons/react/24/outline';

const HackathonDetails = () => {
  const { id } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchHackathonDetails = async () => {
      try {
        // Simulated API response
        const mockHackathon = {
          id: parseInt(id),
          title: 'AI Innovation Challenge',
          description: 'Build the next generation of AI-powered applications that solve real-world problems. This hackathon focuses on leveraging cutting-edge AI technologies to create innovative solutions.',
          startDate: '2025-04-15',
          endDate: '2025-04-17',
          location: 'Virtual',
          teamSize: '2-4',
          prizePool: '$10,000',
          registrationDeadline: '2025-04-10',
          image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
          organizer: {
            name: 'TechCorp',
            logo: 'https://via.placeholder.com/50',
            description: 'Leading technology company focused on AI innovation'
          },
          timeline: [
            { title: 'Registration Opens', date: '2025-03-15' },
            { title: 'Registration Closes', date: '2025-04-10' },
            { title: 'Team Formation Deadline', date: '2025-04-12' },
            { title: 'Hackathon Starts', date: '2025-04-15' },
            { title: 'Hackathon Ends', date: '2025-04-17' },
            { title: 'Winners Announced', date: '2025-04-18' }
          ],
          prizes: [
            { place: '1st Place', amount: '$5,000' },
            { place: '2nd Place', amount: '$3,000' },
            { place: '3rd Place', amount: '$2,000' }
          ],
          requirements: [
            'All team members must be currently enrolled students',
            'Teams must consist of 2-4 members',
            'Projects must be original work created during the hackathon',
            'Solutions must use AI/ML technologies'
          ]
        };

        setHackathon(mockHackathon);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hackathon details:', error);
        setLoading(false);
      }
    };

    fetchHackathonDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Hackathon not found</h2>
          <p className="mt-2 text-gray-600">The hackathon you're looking for doesn't exist.</p>
          <Link to="/hackathons" className="mt-4 inline-block text-primary-600 hover:text-primary-500">
            View all hackathons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img
              className="absolute inset-0 w-full h-full object-cover"
              src={hackathon.image}
              alt={hackathon.title}
            />
            <div className="absolute inset-0 bg-gray-900 bg-opacity-60">
              <div className="h-full flex items-center">
                <div className="px-8">
                  <h1 className="text-4xl font-bold text-white">{hackathon.title}</h1>
                  <p className="mt-4 text-xl text-gray-200">{hackathon.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-8 border-b">
            <div className="flex items-center">
              <CalendarIcon className="h-6 w-6 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-base text-gray-900">{hackathon.startDate} to {hackathon.endDate}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="h-6 w-6 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-base text-gray-900">{hackathon.location}</p>
              </div>
            </div>
            <div className="flex items-center">
              <UsersIcon className="h-6 w-6 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Team Size</p>
                <p className="text-base text-gray-900">{hackathon.teamSize} members</p>
              </div>
            </div>
            <div className="flex items-center">
              <TrophyIcon className="h-6 w-6 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Prize Pool</p>
                <p className="text-base text-gray-900">{hackathon.prizePool}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Timeline */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900">Timeline</h2>
                <div className="mt-4 space-y-4">
                  {hackathon.timeline.map((event, index) => (
                    <div key={index} className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Requirements */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900">Requirements</h2>
                <ul className="mt-4 space-y-2">
                  {hackathon.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-6 w-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                        {index + 1}
                      </span>
                      <span className="ml-3 text-gray-600">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Organizer Info */}
              <section className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900">Organizer</h2>
                <div className="mt-4 flex items-center">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={hackathon.organizer.logo}
                    alt={hackathon.organizer.name}
                  />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{hackathon.organizer.name}</p>
                    <p className="text-sm text-gray-500">{hackathon.organizer.description}</p>
                  </div>
                </div>
              </section>

              {/* Prizes */}
              <section className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900">Prizes</h2>
                <div className="mt-4 space-y-4">
                  {hackathon.prizes.map((prize, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{prize.place}</span>
                      <span className="text-sm text-gray-600">{prize.amount}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Registration Button */}
              {isAuthenticated ? (
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700">
                  Register Now
                </button>
              ) : (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Sign in to Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetails;
