import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  PlusIcon, 
  XMarkIcon, 
  UserCircleIcon,
  AcademicCapIcon,
  MapPinIcon,
  CodeBracketIcon,
  LinkIcon,
  ArrowLeftIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const EditProfile = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    university: '',
    graduationYear: '',
    location: '',
    bio: '',
    avatar: null,
    skills: [],
    github: '',
    linkedin: '',
    portfolio: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        role: currentUser.role || '',
        university: currentUser.university || '',
        graduationYear: currentUser.graduationYear || '',
        location: currentUser.location || '',
        bio: currentUser.bio || '',
        avatar: currentUser.avatar || null,
        skills: currentUser.skills || [],
        github: currentUser.socialLinks?.github || '',
        linkedin: currentUser.socialLinks?.linkedin || '',
        portfolio: currentUser.socialLinks?.portfolio || ''
      });
      
      // Set image preview if avatar exists
      if (currentUser.avatar) {
        setImagePreview(currentUser.avatar);
      }
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Create image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillAdd = (e) => {
    e.preventDefault();
    const skillInput = document.getElementById('skill-input');
    const skill = skillInput.value.trim();
    
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      skillInput.value = '';
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Handle avatar upload
      const userData = {
        ...formData,
        socialLinks: {
          github: formData.github,
          linkedin: formData.linkedin,
          portfolio: formData.portfolio
        }
      };

      await updateProfile(userData);
      const userId = currentUser?.id || currentUser?._id;
      if (userId) {
        navigate(`/profile/${userId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => {
                  const userId = currentUser?.id || currentUser?._id;
                  if (userId) {
                    navigate(`/profile/${userId}`);
                  } else {
                    navigate('/dashboard');
                  }
                }}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Profile
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
                  <p className="text-sm text-gray-500">Update your information</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Progress Steps */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center space-x-8">
              <div className="flex items-center text-white">
                <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-full mr-3">
                  <UserCircleIcon className="h-5 w-5" />
                </div>
                <span className="font-medium">Personal Info</span>
              </div>
              <div className="flex items-center text-white opacity-75">
                <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-10 rounded-full mr-3">
                  <AcademicCapIcon className="h-5 w-5" />
                </div>
                <span className="font-medium">Education</span>
              </div>
              <div className="flex items-center text-white opacity-75">
                <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-10 rounded-full mr-3">
                  <CodeBracketIcon className="h-5 w-5" />
                </div>
                <span className="font-medium">Skills</span>
              </div>
              <div className="flex items-center text-white opacity-75">
                <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-10 rounded-full mr-3">
                  <LinkIcon className="h-5 w-5" />
                </div>
                <span className="font-medium">Social Links</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                  <UserCircleIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                  <p className="text-gray-600">Tell us about yourself</p>
                </div>
              </div>

              {/* Profile Picture Upload */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="h-16 w-16 text-white" />
                      </div>
                    )}
                    {formData.avatar && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block">
                      <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="cursor-pointer inline-flex items-center px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        {imagePreview ? 'Change Photo' : 'Choose New Photo'}
                      </div>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, avatar: null }));
                        }}
                        className="text-sm text-red-600 hover:text-red-700 mt-2"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
                    Professional Role *
                  </label>
                  <input
                    type="text"
                    name="role"
                    id="role"
                    required
                    placeholder="e.g., Full Stack Developer, UI/UX Designer"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm font-semibold text-gray-700">
                  Bio *
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  rows={4}
                  required
                  value={formData.bio}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Tell others about yourself, your interests, and what you're passionate about..."
                />
                <p className="text-sm text-gray-500">{formData.bio.length}/500 characters</p>
              </div>
            </div>

            {/* Education and Location Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                  <AcademicCapIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Education & Location</h2>
                  <p className="text-gray-600">Your academic background and location</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="university" className="block text-sm font-semibold text-gray-700">
                    University *
                  </label>
                  <input
                    type="text"
                    name="university"
                    id="university"
                    required
                    value={formData.university}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="Your university name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="graduationYear" className="block text-sm font-semibold text-gray-700">
                    Graduation Year *
                  </label>
                  <input
                    type="text"
                    name="graduationYear"
                    id="graduationYear"
                    required
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    Location *
                  </div>
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  placeholder="City, State, Country"
                  value={formData.location}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                  <CodeBracketIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Skills & Expertise</h2>
                  <p className="text-gray-600">What technologies and skills do you work with?</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    id="skill-input"
                    placeholder="Add a skill (e.g., React, Python, UI/UX Design)..."
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSkillAdd(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSkillAdd}
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                  >
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 shadow-sm hover:shadow-md transition-all"
                    >
                      <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-2"></span>
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillRemove(skill)}
                        className="ml-2 inline-flex items-center p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 focus:outline-none transition-all"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                  {formData.skills.length === 0 && (
                    <p className="text-gray-500 italic">No skills added yet. Add your first skill above!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
                  <LinkIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Social Links</h2>
                  <p className="text-gray-600">Connect your professional profiles</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="github" className="block text-sm font-semibold text-gray-700">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub Profile
                    </div>
                  </label>
                  <input
                    type="url"
                    name="github"
                    id="github"
                    placeholder="https://github.com/username"
                    value={formData.github}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="linkedin" className="block text-sm font-semibold text-gray-700">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn Profile
                    </div>
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    id="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="portfolio" className="block text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Portfolio Website
                  </div>
                </label>
                <input
                  type="url"
                  name="portfolio"
                  id="portfolio"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    const userId = currentUser?.id || currentUser?._id;
                    if (userId) {
                      navigate(`/profile/${userId}`);
                    } else {
                      navigate('/dashboard');
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all font-medium"
                >
                  Cancel Changes
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Changes...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckIcon className="h-5 w-5 mr-2" />
                      Save Profile
                    </div>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
