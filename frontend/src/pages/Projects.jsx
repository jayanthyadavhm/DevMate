import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../services/apiServices';
import { PlusIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline';

// UI Components
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Projects = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError('');
        const userProjects = await projectsAPI.getProjects();
        setProjects(userProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Project Card Component
  const ProjectCard = ({ project }) => (
    <Link
      to={`/projects/${project._id}`}
      className="block group"
    >
      <Card className="h-full group-hover:shadow-lg transition-shadow duration-200">
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-medium text-gray-900 truncate">{project.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {new Date(project.startDate).toLocaleDateString()}
                {project.members && project.members.length > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <UserGroupIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {project.members.length + 1} members
                  </>
                )}
              </div>
            </div>
            <div className="ml-4">
              <Badge
                variant={project.status === 'active' ? 'success' : project.status === 'completed' ? 'info' : 'warning'}
              >
                {project.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error Loading Projects</h2>
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
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Projects</h1>
                <p className="mt-2 text-gray-600">
                  Manage and collaborate on your development projects
                </p>
              </div>
              <Button
                to="/projects/create"
                variant="primary"
                icon={PlusIcon}
              >
                Create Project
              </Button>
            </div>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <UserGroupIcon className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                Get started by creating your first project. Collaborate with team members and track your progress.
              </p>
              <div className="mt-6">
                <Button
                  to="/projects/create"
                  variant="primary"
                  icon={PlusIcon}
                >
                  Create Your First Project
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Projects;
