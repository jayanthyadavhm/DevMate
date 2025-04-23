import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const EditProfile = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
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
    }
  }, [currentUser]);

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
      navigate(`/profile/${currentUser.id}`);
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <p className="mt-2 text-sm text-gray-600">
              Update your profile information to help others find and connect with you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    id="role"
                    required
                    placeholder="e.g., Full Stack Developer"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  rows={4}
                  required
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Tell others about yourself..."
                />
              </div>

              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
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

            {/* Education and Location */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Education and Location</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                    University
                  </label>
                  <input
                    type="text"
                    name="university"
                    id="university"
                    required
                    value={formData.university}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    name="graduationYear"
                    id="graduationYear"
                    required
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
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
                  placeholder="City, State"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Skills</h2>

              <div>
                <div className="flex">
                  <input
                    type="text"
                    id="skill-input"
                    placeholder="Add a skill..."
                    className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleSkillAdd}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillRemove(skill)}
                        className="ml-1 inline-flex items-center p-0.5 rounded-full text-primary-800 hover:bg-primary-200 focus:outline-none"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    name="github"
                    id="github"
                    placeholder="https://github.com/username"
                    value={formData.github}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    id="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  name="portfolio"
                  id="portfolio"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/profile/${currentUser.id}`)}
                  className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
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
