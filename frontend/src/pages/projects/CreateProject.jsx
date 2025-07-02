import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../../services/apiServices';

// UI Components
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Card, { CardHeader, CardContent } from '../../components/ui/Card';
import FormField from '../../components/forms/FormField';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Project name and description are required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const projectData = {
        ...formData,
        startDate: formData.startDate || new Date().toISOString(),
        endDate: formData.endDate || undefined
      };

      const newProject = await projectsAPI.createProject(projectData);
      navigate(`/projects/${newProject._id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
            <p className="mt-2 text-gray-600">
              Start a new project and invite team members to collaborate
            </p>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Project Details</h2>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                  label="Project Name"
                  required
                >
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    required
                  />
                </FormField>

                <FormField
                  label="Description"
                  required
                >
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your project goals, features, and objectives"
                    rows={4}
                    required
                  />
                </FormField>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField label="Start Date">
                    <Input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </FormField>

                  <FormField label="End Date">
                    <Input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </FormField>
                </div>

                <FormField label="Status">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </FormField>

                <div className="flex items-center justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/projects')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Project'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateProject;
