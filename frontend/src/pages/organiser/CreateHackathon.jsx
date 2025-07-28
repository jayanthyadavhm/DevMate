import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hackathonsAPI } from '../../services/apiServices';
import {
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UsersIcon,
  TagIcon,
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const CreateHackathon = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    description: '',
    theme: '',
    
    // Date & Time
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    
    // Location & Format
    location: '',
    isVirtual: false,
    venue: '',
    
    // Prize & Participation
    prizePool: '',
    maxParticipants: '',
    teamSizeMin: 2,
    teamSizeMax: 5,
    
    // Rules & Requirements
    rules: '',
    eligibility: '',
    requirements: '',
    
    // Resources & Links
    resources: '',
    websiteUrl: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      discord: ''
    },
    
    // Categories & Tags
    categories: [],
    technologies: [],
    
    // Additional Settings
    status: 'draft',
    isPublic: true,
    allowLateRegistration: false
  });

  const steps = [
    { id: 1, name: 'Basic Info', description: 'Name, description, and theme' },
    { id: 2, name: 'Schedule', description: 'Dates and timeline' },
    { id: 3, name: 'Location', description: 'Venue and format' },
    { id: 4, name: 'Participation', description: 'Teams and prizes' },
    { id: 5, name: 'Rules', description: 'Guidelines and requirements' },
    { id: 6, name: 'Resources', description: 'Links and materials' },
    { id: 7, name: 'Review', description: 'Final review and publish' }
  ];

  const categories = [
    'Web Development', 'Mobile Apps', 'AI/ML', 'Blockchain', 'IoT', 
    'Game Development', 'Cybersecurity', 'Data Science', 'AR/VR', 'DevOps'
  ];

  const technologies = [
    'React', 'Node.js', 'Python', 'JavaScript', 'Java', 'C++', 'Swift',
    'Kotlin', 'Flutter', 'TensorFlow', 'PyTorch', 'Docker', 'AWS', 'Firebase'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayToggle = (arrayName, item) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].includes(item)
        ? prev[arrayName].filter(i => i !== item)
        : [...prev[arrayName], item]
    }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const hackathonData = {
        ...formData,
        organiser: currentUser._id || currentUser.id,
        participantCount: 0,
        createdAt: new Date().toISOString()
      };

      await hackathonsAPI.createHackathon(hackathonData);
      showNotification('Hackathon created successfully!');
      
      setTimeout(() => {
        navigate('/organiser');
      }, 2000);
      
    } catch (error) {
      showNotification('Failed to create hackathon. Please try again.', 'error');
      console.error('Error creating hackathon:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hackathon Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter a catchy name for your hackathon"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe your hackathon, its goals, and what participants can expect"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme/Focus Area
              </label>
              <input
                type="text"
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Sustainability, Healthcare, Education"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Deadline *
              </label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="isVirtual"
                name="isVirtual"
                checked={formData.isVirtual}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isVirtual" className="text-sm font-medium text-gray-700">
                This is a virtual hackathon
              </label>
            </div>

            {!formData.isVirtual && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue/Location *
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter venue name and address"
                  required={!formData.isVirtual}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City/Region
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., San Francisco, CA or Global (Virtual)"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prize Pool
              </label>
              <input
                type="text"
                name="prizePool"
                value={formData.prizePool}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., $10,000 or Prizes worth $5,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Participants
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Team Size
                </label>
                <input
                  type="number"
                  name="teamSizeMin"
                  value={formData.teamSizeMin}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Team Size
                </label>
                <input
                  type="number"
                  name="teamSizeMax"
                  value={formData.teamSizeMax}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rules & Guidelines
              </label>
              <textarea
                name="rules"
                value={formData.rules}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="List the rules and guidelines for participants"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eligibility Criteria
              </label>
              <textarea
                name="eligibility"
                value={formData.eligibility}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Who can participate? Any restrictions or requirements?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technical Requirements
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Any specific technical requirements or restrictions?"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category)}
                      onChange={() => handleArrayToggle('categories', category)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {technologies.map(tech => (
                  <label key={tech} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.technologies.includes(tech)}
                      onChange={() => handleArrayToggle('technologies', tech)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                    />
                    <span className="text-sm text-gray-700">{tech}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://your-hackathon-website.com"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Hackathon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {formData.name}
                </div>
                <div>
                  <span className="font-medium">Theme:</span> {formData.theme || 'None specified'}
                </div>
                <div>
                  <span className="font-medium">Start Date:</span> {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Not set'}
                </div>
                <div>
                  <span className="font-medium">End Date:</span> {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'Not set'}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {formData.isVirtual ? 'Virtual' : formData.venue || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Prize Pool:</span> {formData.prizePool || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Team Size:</span> {formData.teamSizeMin}-{formData.teamSizeMax} members
                </div>
                <div>
                  <span className="font-medium">Max Participants:</span> {formData.maxParticipants || 'Unlimited'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                Make this hackathon public and visible to all users
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${
          notification.type === 'success' ? 'bg-green-50 border-green-200' :
          'bg-red-50 border-red-200'
        } border rounded-lg shadow-lg p-4`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
            ) : (
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
            )}
            <p className={`text-sm font-medium ${
              notification.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/organiser')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Hackathon</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep === step.id
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : currentStep > step.id
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {steps[currentStep - 1].name}
            </h2>
            <p className="text-gray-600 mt-1">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </span>

          {currentStep < steps.length ? (
            <button
              onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <CheckCircleIcon className="h-4 w-4 mr-2" />
              )}
              Create Hackathon
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateHackathon;
