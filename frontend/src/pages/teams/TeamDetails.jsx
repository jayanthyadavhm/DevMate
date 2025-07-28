import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserCircleIcon, ChatBubbleLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const TeamDetails = () => {
  const { id } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchTeamDetails = async () => {
      try {
        // Simulated API response
        const mockTeam = {
          id: parseInt(id),
          name: 'Team Alpha',
          hackathon: {
            id: 1,
            name: 'AI Innovation Challenge',
            startDate: '2025-04-15',
            endDate: '2025-04-17',
          },
          description: 'We building an AI-powered solution to help students find and connect with study groups based on their learning style and schedule.',
          lookingFor: ['Frontend Developer', 'Machine Learning Engineer'],
          members: [
            {
              id: 1,
              name: 'Alex Thompson',
              role: 'Team Leader',
              skills: ['React', 'Node.js', 'Python'],
              university: 'MIT',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
            },
            {
              id: 2,
              name: 'Sarah Chen',
              role: 'UI/UX Designer',
              skills: ['Figma', 'Adobe XD', 'React'],
              university: 'Stanford University',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
            }
          ],
          techStack: ['React', 'Node.js', 'Python', 'TensorFlow', 'MongoDB'],
          projectIdea: {
            problem: 'Students often struggle to find study groups that match their learning style and schedule.',
            solution: 'An AI-powered platform that analyzes learning patterns and schedules to suggest optimal study group matches.',
            impact: 'Help students improve their academic performance through more effective collaborative learning.'
          }
        };

        setTeam(mockTeam);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team details:', error);
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Team not found</h2>
          <p className="mt-2 text-gray-600">The team you're looking for doesn't exist.</p>
          <Link to="/find-teammates" className="mt-4 inline-block text-primary-600 hover:text-primary-500">
            Find other teams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Team Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Participating in{' '}
                  <Link to={`/hackathons/${team.hackathon.id}`} className="text-primary-600 hover:text-primary-500">
                    {team.hackathon.name}
                  </Link>
                </p>
              </div>
              {isAuthenticated && (
                <button className="btn btn-primary flex items-center">
                  <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                  Contact Team
                </button>
              )}
            </div>
            <p className="mt-4 text-gray-600">{team.description}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Team Members */}
          <div className="lg:col-span-2 space-y-8">
            {/* Team Members */}
            <section className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {team.members.map((member) => (
                  <div key={member.id} className="px-6 py-6">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={member.avatar}
                        alt={member.name}
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {member.id ? (
                            <Link to={`/profile/${member.id}`} className="hover:text-primary-600">
                              {member.name}
                            </Link>
                          ) : (
                            <span>{member.name}</span>
                          )}
                        </h3>
                        <div className="mt-1 flex items-center">
                          <span className="text-sm text-gray-500">{member.role}</span>
                          <span className="mx-2 text-gray-300">·</span>
                          <span className="flex items-center text-sm text-gray-500">
                            <AcademicCapIcon className="h-4 w-4 mr-1" />
                            {member.university}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Project Idea */}
            <section className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Project Idea</h2>
              </div>
              <div className="px-6 py-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Problem</h3>
                  <p className="mt-2 text-gray-600">{team.projectIdea.problem}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Solution</h3>
                  <p className="mt-2 text-gray-600">{team.projectIdea.solution}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Impact</h3>
                  <p className="mt-2 text-gray-600">{team.projectIdea.impact}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Team Info */}
          <div className="space-y-8">
            {/* Looking For */}
            <section className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Looking For</h2>
              </div>
              <div className="px-6 py-6">
                <ul className="space-y-3">
                  {team.lookingFor.map((role, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <UserCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
                      {role}
                    </li>
                  ))}
                </ul>
                {isAuthenticated && (
                  <button className="mt-6 w-full btn btn-primary">
                    Apply to Join
                  </button>
                )}
              </div>
            </section>

            {/* Tech Stack */}
            <section className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Tech Stack</h2>
              </div>
              <div className="px-6 py-6">
                <div className="flex flex-wrap gap-2">
                  {team.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Hackathon Timeline */}
            <section className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Hackathon Timeline</h2>
              </div>
              <div className="px-6 py-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                    <p className="mt-1 text-gray-900">{team.hackathon.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">End Date</p>
                    <p className="mt-1 text-gray-900">{team.hackathon.endDate}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
