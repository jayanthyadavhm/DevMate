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

  // Register user
  register: async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
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
