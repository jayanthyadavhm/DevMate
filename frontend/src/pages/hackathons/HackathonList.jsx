import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, UsersIcon, MapPinIcon } from '@heroicons/react/24/outline';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchHackathons = async () => {
      try {
        // Simulated API response
        const mockHackathons = [
          {
            id: 1,
            title: 'AI Innovation Challenge',
            description: 'Build the next generation of AI-powered applications',
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
            },
          },
          {
            id: 2,
            title: 'Web3 Hackathon',
            description: 'Create innovative blockchain solutions',
            startDate: '2025-05-01',
            endDate: '2025-05-03',
            location: 'San Francisco, CA',
            teamSize: '3-5',
            prizePool: '$15,000',
            registrationDeadline: '2025-04-25',
            image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
            organizer: {
              name: 'BlockchainHub',
              logo: 'https://via.placeholder.com/50',
            },
          },
        ];

        setHackathons(mockHackathons);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Upcoming Hackathons
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Find and participate in exciting hackathons from around the world
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {hackathons.map((hackathon) => (
            <div
              key={hackathon.id}
              className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-48 w-full object-cover"
                  src={hackathon.image}
                  alt={hackathon.title}
                />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={hackathon.organizer.logo}
                      alt={hackathon.organizer.name}
                    />
                    <p className="ml-2 text-sm font-medium text-gray-900">
                      {hackathon.organizer.name}
                    </p>
                  </div>
                  <Link to={`/hackathons/${hackathon.id}`} className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900">{hackathon.title}</p>
                    <p className="mt-3 text-base text-gray-500">{hackathon.description}</p>
                  </Link>
                </div>
                <div className="mt-6 flex flex-col space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {hackathon.startDate} to {hackathon.endDate}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {hackathon.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <UsersIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    Team Size: {hackathon.teamSize}
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Prize Pool: {hackathon.prizePool}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/hackathons/${hackathon.id}`}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HackathonList;
