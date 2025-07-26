import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, tasksAPI } from '../services/apiServices';
import { CalendarIcon, UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';

// UI Components
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Dashboard = () => {
  const { currentUser, isParticipant, isOrganizer } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Fetch user's projects and tasks from the API
        const [userProjects, userTasks] = await Promise.all([
          projectsAPI.getProjects(),
          tasksAPI.getMyTasks()
        ]);

        setProjects(userProjects);
        setTasks(userTasks);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Project Card Component
  const ProjectCard = ({ project }) => (
    <Link
      to={`/projects/${project._id}`}
      className="block px-5 py-5 sm:px-6 hover:bg-gray-50 transition duration-150"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">{project.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            {new Date(project.startDate).toLocaleDateString()}
            {project.members && (
              <>
                <span className="mx-2">•</span>
                <UserGroupIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {project.members.length + 1} members
              </>
            )}
          </div>
        </div>
        <div className="ml-6">
          <Badge
            variant={project.status === 'active' ? 'success' : project.status === 'completed' ? 'info' : 'warning'}
          >
            {project.status}
          </Badge>
        </div>
      </div>
    </Link>
  );

  // Task Card Component
  const TaskCard = ({ task }) => (
    <Link
      to={`/tasks/${task._id}`}
      className="block px-5 py-5 sm:px-6 hover:bg-gray-50 transition duration-150"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">{task.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            Due: {new Date(task.dueDate).toLocaleDateString()}
            <span className="mx-2">•</span>
            Priority: {task.priority}
          </div>
        </div>
        <div className="ml-6">
          <Badge
            variant={
              task.status === 'completed' ? 'success' : 
              task.status === 'in-progress' ? 'info' : 
              task.status === 'review' ? 'warning' : 'gray'
            }
          >
            {task.status}
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
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
                  <p className="mt-1 text-sm text-gray-500">
                    {isParticipant ? 'Here are your projects and tasks' : 'Manage your projects and team members'}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    to="/projects/create"
                    variant="primary"
                    icon={PlusIcon}
                  >
                    Create Project
                  </Button>
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
            {/* Projects Section */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Your Projects</h2>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                    <div className="mt-6">
                      <Button
                        to="/projects/create"
                        variant="primary"
                        icon={PlusIcon}
                      >
                        Create Project
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {projects.slice(0, 3).map((project) => (
                      <ProjectCard key={project._id} project={project} />
                    ))}
                    {projects.length > 3 && (
                      <div className="px-5 py-3">
                        <Link
                          to="/projects"
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                          View all {projects.length} projects →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tasks Section */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Your Tasks</h2>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks assigned</h3>
                    <p className="mt-1 text-sm text-gray-500">Tasks will appear here when they are assigned to you.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {tasks.slice(0, 3).map((task) => (
                      <TaskCard key={task._id} task={task} />
                    ))}
                    {tasks.length > 3 && (
                      <div className="px-5 py-3">
                        <Link
                          to="/tasks"
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                          View all {tasks.length} tasks →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
