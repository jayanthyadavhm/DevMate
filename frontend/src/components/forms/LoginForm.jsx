import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// UI Components
import Button from '../ui/Button';
import Input from '../ui/Input';
import FormField from './FormField';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        form: error.message || 'Failed to login. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {errors.form}
              </h3>
            </div>
          </div>
        </div>
      )}

      <FormField
        label="Email"
        required
        error={errors.email}
      >
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
      </FormField>

      <FormField
        label="Password"
        required
        error={errors.password}
      >
        <Input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
      </FormField>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Button
            to="/forgot-password"
            variant="outline"
            className="!p-0 !border-0 !shadow-none hover:text-primary-500"
          >
            Forgot your password?
          </Button>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          Sign in
        </Button>
      </div>

      <div className="text-center text-sm">
        <span className="text-gray-500">Don't have an account?</span>{' '}
        <Button
          to="/register"
          variant="outline"
          className="!p-0 !border-0 !shadow-none hover:text-primary-500"
        >
          Sign up
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
