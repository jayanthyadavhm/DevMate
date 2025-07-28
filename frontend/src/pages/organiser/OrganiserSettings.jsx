import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  DocumentTextIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CameraIcon,
  ClockIcon,
  BanknotesIcon,
  TrophyIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const OrganiserSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { currentUser, updateUser } = useAuth();

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    bio: '',
    organization: '',
    website: '',
    location: '',
    avatar: null,
    linkedIn: '',
    twitter: '',
    github: ''
  });

  // Initialize image preview from current user avatar
  useEffect(() => {
    if (currentUser?.avatar) {
      setImagePreview(currentUser.avatar);
    }
  }, [currentUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({ ...profileData, avatar: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newRegistrations: true,
    deadlineReminders: true,
    submissionAlerts: true,
    teamUpdates: true,
    marketingEmails: false,
    weeklyReports: true,
    eventUpdates: true
  });

  // Security settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: '24'
  });

  // Organization settings
  const [organizationData, setOrganizationData] = useState({
    name: '',
    description: '',
    website: '',
    logo: null,
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    contactEmail: '',
    address: '',
    taxId: '',
    bankingInfo: ''
  });

  // Event settings
  const [eventSettings, setEventSettings] = useState({
    defaultDuration: '48',
    defaultTeamSize: '4',
    defaultPrizes: ['$1000', '$500', '$250'],
    defaultCategories: ['Web Development', 'Mobile Apps', 'AI/ML', 'Blockchain'],
    autoApproval: false,
    requireTeamInfo: true,
    allowLateSubmissions: false,
    enableChat: true,
    enableMentorship: true
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create FormData for file upload if avatar exists
      const formData = new FormData();
      
      // Append all profile data
      Object.keys(profileData).forEach(key => {
        if (key === 'avatar' && profileData.avatar instanceof File) {
          formData.append('avatar', profileData.avatar);
        } else if (key !== 'avatar') {
          formData.append(key, profileData[key] || '');
        }
      });

      // TODO: API call to update profile with formData
      // await updateUserProfile(formData);
      
      showNotification('Profile updated successfully!');
    } catch (error) {
      showNotification('Failed to update profile.', 'error');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call to update notification settings
      showNotification('Notification preferences updated!');
    } catch (error) {
      showNotification('Failed to update notifications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      showNotification('Passwords do not match.', 'error');
      return;
    }
    setLoading(true);
    try {
      // API call to update security settings
      showNotification('Security settings updated!');
      setSecurityData({ ...securityData, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showNotification('Failed to update security settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call to update organization settings
      showNotification('Organization settings updated!');
    } catch (error) {
      showNotification('Failed to update organization settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEventSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call to update event settings
      showNotification('Event settings updated!');
    } catch (error) {
      showNotification('Failed to update event settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700 border-blue-200'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      {label}
    </button>
  );

  const FormSection = ({ title, description, children }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and organizer preferences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              <TabButton
                id="profile"
                label="Profile"
                icon={UserIcon}
                isActive={activeTab === 'profile'}
                onClick={setActiveTab}
              />
              <TabButton
                id="notifications"
                label="Notifications"
                icon={BellIcon}
                isActive={activeTab === 'notifications'}
                onClick={setActiveTab}
              />
              <TabButton
                id="security"
                label="Security"
                icon={ShieldCheckIcon}
                isActive={activeTab === 'security'}
                onClick={setActiveTab}
              />
              <TabButton
                id="organization"
                label="Organization"
                icon={BuildingOfficeIcon}
                isActive={activeTab === 'organization'}
                onClick={setActiveTab}
              />
              <TabButton
                id="events"
                label="Event Defaults"
                icon={TrophyIcon}
                isActive={activeTab === 'events'}
                onClick={setActiveTab}
              />
              <TabButton
                id="billing"
                label="Billing"
                icon={CreditCardIcon}
                isActive={activeTab === 'billing'}
                onClick={setActiveTab}
              />
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit}>
                <FormSection 
                  title="Personal Information"
                  description="Update your personal details and contact information"
                >
                  {/* Profile Picture Section */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Profile Picture</h4>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                            <UserIcon className="h-12 w-12 text-white" />
                          </div>
                        )}
                        {profileData.avatar && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                            <CheckCircleIcon className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                          <div className="cursor-pointer inline-flex items-center px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all">
                            <CameraIcon className="h-5 w-5 mr-2" />
                            {imagePreview ? 'Change Photo' : 'Upload Photo'}
                          </div>
                        </label>
                        <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB. Recommended: 400x400px</p>
                        {imagePreview && (
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setProfileData({ ...profileData, avatar: null });
                            }}
                            className="text-sm text-red-600 hover:text-red-700 mt-2"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        placeholder="City, Country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={4}
                      placeholder="Tell us about yourself and your experience organizing hackathons..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </FormSection>

                <FormSection 
                  title="Social Links"
                  description="Connect your social media profiles"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={profileData.linkedIn}
                        onChange={(e) => setProfileData({ ...profileData, linkedIn: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter Profile
                      </label>
                      <input
                        type="url"
                        value={profileData.twitter}
                        onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                        placeholder="https://twitter.com/username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        value={profileData.github}
                        onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                        placeholder="https://github.com/username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </FormSection>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <form onSubmit={handleNotificationSubmit}>
                <FormSection 
                  title="Notification Preferences"
                  description="Choose how you want to be notified about important events"
                >
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Communication Methods</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', icon: EnvelopeIcon },
                          { key: 'pushNotifications', label: 'Push Notifications', icon: BellIcon },
                          { key: 'smsNotifications', label: 'SMS Notifications', icon: PhoneIcon }
                        ].map(({ key, label, icon: Icon }) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings[key]}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [key]: e.target.checked
                              })}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <Icon className="h-5 w-5 text-gray-400 ml-3 mr-2" />
                            <span className="text-sm text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Event Notifications</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'newRegistrations', label: 'New participant registrations' },
                          { key: 'deadlineReminders', label: 'Deadline reminders' },
                          { key: 'submissionAlerts', label: 'Project submission alerts' },
                          { key: 'teamUpdates', label: 'Team formation updates' },
                          { key: 'eventUpdates', label: 'Event status changes' }
                        ].map(({ key, label }) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings[key]}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [key]: e.target.checked
                              })}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Reports & Marketing</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'weeklyReports', label: 'Weekly analytics reports' },
                          { key: 'marketingEmails', label: 'Marketing and promotional emails' }
                        ].map(({ key, label }) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings[key]}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [key]: e.target.checked
                              })}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </FormSection>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <form onSubmit={handleSecuritySubmit}>
                <FormSection 
                  title="Change Password"
                  description="Update your password to keep your account secure"
                >
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={securityData.newPassword}
                          onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 px-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </FormSection>

                <FormSection 
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Enable Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Secure your account with 2FA via authenticator app</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securityData.twoFactorEnabled}
                        onChange={(e) => setSecurityData({ ...securityData, twoFactorEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </FormSection>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Update Security'}
                  </button>
                </div>
              </form>
            )}

            {/* Event Defaults Tab */}
            {activeTab === 'events' && (
              <form onSubmit={handleEventSettingsSubmit}>
                <FormSection 
                  title="Default Event Settings"
                  description="Set default values for new hackathons you create"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Duration (hours)
                      </label>
                      <select
                        value={eventSettings.defaultDuration}
                        onChange={(e) => setEventSettings({ ...eventSettings, defaultDuration: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="24">24 hours</option>
                        <option value="48">48 hours</option>
                        <option value="72">72 hours</option>
                        <option value="168">1 week</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Team Size
                      </label>
                      <select
                        value={eventSettings.defaultTeamSize}
                        onChange={(e) => setEventSettings({ ...eventSettings, defaultTeamSize: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="1">Solo</option>
                        <option value="2">2 members</option>
                        <option value="3">3 members</option>
                        <option value="4">4 members</option>
                        <option value="5">5 members</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {eventSettings.defaultCategories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => {
                              const newCategories = eventSettings.defaultCategories.filter((_, i) => i !== index);
                              setEventSettings({ ...eventSettings, defaultCategories: newCategories });
                            }}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Event Features</h4>
                    {[
                      { key: 'autoApproval', label: 'Auto-approve participant registrations' },
                      { key: 'requireTeamInfo', label: 'Require team information during registration' },
                      { key: 'allowLateSubmissions', label: 'Allow late project submissions' },
                      { key: 'enableChat', label: 'Enable participant chat' },
                      { key: 'enableMentorship', label: 'Enable mentorship program' }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={eventSettings[key]}
                          onChange={(e) => setEventSettings({
                            ...eventSettings,
                            [key]: e.target.checked
                          })}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </FormSection>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Defaults'}
                  </button>
                </div>
              </form>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div>
                <FormSection 
                  title="Current Plan"
                  description="Manage your subscription and billing information"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Pro Organizer Plan</h3>
                        <p className="text-blue-100">Unlimited hackathons, advanced analytics, priority support</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">$49</p>
                        <p className="text-blue-100">per month</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Upgrade Plan
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      View Billing History
                    </button>
                  </div>
                </FormSection>

                <FormSection 
                  title="Payment Method"
                  description="Update your payment information"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <CreditCardIcon className="h-6 w-6 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                          <p className="text-xs text-gray-600">Expires 12/25</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Update
                      </button>
                    </div>
                    
                    <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </button>
                  </div>
                </FormSection>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganiserSettings;
