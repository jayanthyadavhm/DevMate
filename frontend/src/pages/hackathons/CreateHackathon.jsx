import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CreateHackathon = () => {
  const navigate = useNavigate();
  const { currentUser, isOrganizer } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    location: '',
    teamSizeMin: 2,
    teamSizeMax: 4,
    prizePool: '',
    requirements: '',
    image: null,
  });

  // Redirect if not an organizer
  if (!isOrganizer) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement actual API call
      // For now, just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to hackathon list after creation
      navigate('/hackathons');
    } catch (error) {
      console.error('Error creating hackathon:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create a New Hackathon</h1>
            <p className="mt-2 text-sm text-gray-600">
              Fill out the form below to create a new hackathon. All fields are required unless marked optional.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Hackathon Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Cover Image
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100"
                />
              </div>
            </div>

            {/* Dates and Location */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Dates and Location</h2>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    required
                    value={formData.endDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700">
                  Registration Deadline
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  id="registrationDeadline"
                  required
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  placeholder="Virtual or Physical Location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Team and Prize Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Team and Prize Information</h2>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="teamSizeMin" className="block text-sm font-medium text-gray-700">
                    Minimum Team Size
                  </label>
                  <input
                    type="number"
                    name="teamSizeMin"
                    id="teamSizeMin"
                    min="1"
                    required
                    value={formData.teamSizeMin}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="teamSizeMax" className="block text-sm font-medium text-gray-700">
                    Maximum Team Size
                  </label>
                  <input
                    type="number"
                    name="teamSizeMax"
                    id="teamSizeMax"
                    min="1"
                    required
                    value={formData.teamSizeMax}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="prizePool" className="block text-sm font-medium text-gray-700">
                  Prize Pool
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    name="prizePool"
                    id="prizePool"
                    required
                    value={formData.prizePool}
                    onChange={handleChange}
                    className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Requirements</h2>
              
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                  Hackathon Requirements
                </label>
                <textarea
                  name="requirements"
                  id="requirements"
                  rows={4}
                  required
                  value={formData.requirements}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="List the requirements for participation..."
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/hackathons')}
                  className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Hackathon'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateHackathon;
