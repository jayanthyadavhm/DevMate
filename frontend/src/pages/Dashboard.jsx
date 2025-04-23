import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CalendarIcon, UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';

// UI Components
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Dashboard = () => {
  const { currentUser, isParticipant, isOrganizer } = useAuth();
  const [hackathons, setHackathons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user's hackathons and teams from API
    // For now, using mock data
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setHackathons([
          {
            id: 1,
            name: 'AI Innovation Challenge',
            date: '2025-04-15',
            status: 'Upcoming',
            description: 'Build innovative AI solutions for real-world problems',
            participants: 120,
          },
          {
            id: 2,
            name: 'Web3 Hackathon',
            date: '2025-05-01',
            status: 'Open for Registration',
            description: 'Create decentralized applications on blockchain',
            participants: 85,
          }
        ]);

        setTeams([
          {
            id: 1,
            name: 'Team Alpha',
            hackathon: 'AI Innovation Challenge',
            members: 4,
            skills: ['AI/ML', 'Python', 'React'],
          },
          {
            id: 2,
            name: 'Web3 Warriors',
            hackathon: 'Web3 Hackathon',
            members: 3,
            skills: ['Solidity', 'JavaScript', 'Node.js'],
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const HackathonCard = ({ hackathon }) => (
    <Link
      to={`/hackathons/${hackathon.id}`}
      className="block px-5 py-5 sm:px-6 hover:bg-gray-50 transition duration-150"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">{hackathon.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{hackathon.description}</p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            {hackathon.date}
            <span className="mx-2">•</span>
            <UserGroupIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            {hackathon.participants} participants
          </div>
        </div>
        <div className="ml-6">
          <Badge
            variant={hackathon.status === 'Upcoming' ? 'success' : 'info'}
          >
            {hackathon.status}
          </Badge>
        </div>
      </div>
    </Link>
  );

  const TeamCard = ({ team }) => (
    <Link
      to={`/teams/${team.id}`}
      className="block px-5 py-5 sm:px-6 hover:bg-gray-50 transition duration-150"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">{team.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{team.hackathon}</p>
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {team.skills.map((skill, index) => (
                <Badge key={index} variant="gray">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="ml-6">
          <Badge variant="info">
            {team.members} members
          </Badge>
        </div>
      </div>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <Card className="mb-6">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Welcome back, {currentUser?.name}!
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    {isParticipant ? 'Here are your hackathons and teams' : 'Manage your hackathons and participants'}
                  </p>
                </div>
                <div className="flex space-x-3">
                  {isOrganizer && (
                    <Button
                      to="/hackathons/create"
                      variant="primary"
                      icon={PlusIcon}
                    >
                      Create Hackathon
                    </Button>
                  )}
                  <Button
                    to="/find-teammates"
                    variant="outline"
                    icon={UserGroupIcon}
                  >
                    Find Teammates
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Hackathons Section */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Your Hackathons</h2>
              </CardHeader>
              <div className="divide-y divide-gray-200">
                {hackathons.length > 0 ? (
                  hackathons.map((hackathon) => (
                    <HackathonCard key={hackathon.id} hackathon={hackathon} />
                  ))
                ) : (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-gray-500">No hackathons found</p>
                    <Button
                      to="/hackathons"
                      variant="primary"
                      className="mt-4"
                    >
                      Browse Hackathons
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Teams Section */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Your Teams</h2>
              </CardHeader>
              <div className="divide-y divide-gray-200">
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <TeamCard key={team.id} team={team} />
                  ))
                ) : (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-gray-500">No teams found</p>
                    <Button
                      to="/find-teammates"
                      variant="primary"
                      className="mt-4"
                    >
                      Find Teammates
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
