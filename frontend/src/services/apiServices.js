// Hackathon Teams API services
export const hackathonTeamsAPI = {
  // Mark user as ready for a hackathon
  markReady: async (hackathonId) => {
    try {
      const response = await api.post('/hackathon-teams/ready', { hackathonId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark ready');
    }
  },
  // List users ready for a hackathon
  getReadyUsers: async (hackathonId) => {
    try {
      const response = await api.get(`/hackathon-teams/ready/${hackathonId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch ready users');
    }
  },
  // Send join request
  sendJoinRequest: async (toUserId, hackathonId) => {
    try {
      const response = await api.post('/hackathon-teams/join-request', { toUserId, hackathonId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send join request');
    }
  },
  // List join requests for current user
  getJoinRequests: async () => {
    try {
      const response = await api.get('/hackathon-teams/join-requests');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch join requests');
    }
  },

  // Get all ready users (for finding teammates)
  getReadyUsers: async () => {
    try {
      const response = await api.get('/hackathon-teams/ready-users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch ready users');
    }
  },

  // Accept a join request
  acceptRequest: async (requestId) => {
    try {
      const response = await api.post(`/hackathon-teams/accept-request/${requestId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to accept request');
    }
  },

  // Reject a join request
  rejectRequest: async (requestId) => {
    try {
      const response = await api.post(`/hackathon-teams/reject-request/${requestId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reject request');
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.patch('/hackathon-teams/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const response = await api.get(`/hackathon-teams/profile/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },
};
// Hackathons API services
export const hackathonsAPI = {
  // Get all hackathons
  getHackathons: async () => {
    try {
      const response = await api.get('/hackathons');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hackathons');
    }
  },

  // Get hackathon by ID
  getHackathonById: async (id) => {
    try {
      const response = await api.get(`/hackathons/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hackathon');
    }
  },

  // Create new hackathon
  createHackathon: async (hackathonData) => {
    try {
      const response = await api.post('/hackathons', hackathonData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create hackathon');
    }
  },

  // Update hackathon
  updateHackathon: async (id, hackathonData) => {
    try {
      const response = await api.patch(`/hackathons/${id}`, hackathonData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update hackathon');
    }
  },

  // Delete hackathon
  deleteHackathon: async (id) => {
    try {
      const response = await api.delete(`/hackathons/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete hackathon');
    }
  },
};
import api from './api';


// Authentication API services
export const authAPI = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Register user (with role)
  register: async (username, email, password, role = 'user') => {
    try {
      const response = await api.post('/auth/register', { username, email, password, role });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },
};

// Projects API services
export const projectsAPI = {
  // Get all projects for user
  getProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch projects');
    }
  },

  // Create new project
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create project');
    }
  },

  // Get project by ID
  getProject: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch project');
    }
  },

  // Update project
  updateProject: async (id, updates) => {
    try {
      const response = await api.patch(`/projects/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update project');
    }
  },

  // Delete project
  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  },

  // Add member to project
  addMember: async (id, memberId) => {
    try {
      const response = await api.post(`/projects/${id}/members`, { memberId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add member');
    }
  },
};

// Tasks API services
export const tasksAPI = {
  // Get tasks for a project
  getProjectTasks: async (projectId) => {
    try {
      const response = await api.get(`/tasks/project/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },

  // Get user's assigned tasks
  getMyTasks: async () => {
    try {
      const response = await api.get('/tasks/my/tasks');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  },

  // Get task by ID
  getTask: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch task');
    }
  },

  // Update task
  updateTask: async (id, updates) => {
    try {
      const response = await api.patch(`/tasks/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  },
};

export default api;
