import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRightIcon, UserGroupIcon, CalendarIcon, TrophyIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      name: 'Find Hackathons',
      description: 'Discover exciting hackathons worldwide, filter by category, location, and more.',
      icon: CalendarIcon,
    },
    {
      name: 'Build Your Dream Team',
      description: 'Connect with talented students based on skills, interests, and availability.',
      icon: UserGroupIcon,
    },
    {
      name: 'Showcase Your Skills',
      description: 'Create a profile highlighting your expertise and past projects to attract teammates.',
      icon: CodeBracketIcon,
    },
    {
      name: 'Win Amazing Prizes',
      description: 'Participate in hackathons with prize pools and gain recognition for your work.',
      icon: TrophyIcon,
    },
  ];

  const testimonials = [
    {
      content: "DevMate helped me find the perfect teammates for my first hackathon. We ended up winning first place!",
      author: {
        name: 'Sarah Johnson',
        role: 'Computer Science Student',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      content: "As a hackathon organizer, DevMate made it incredibly easy to promote our event and connect with talented participants.",
      author: {
        name: 'Michael Chen',
        role: 'Hackathon Organizer',
        imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      content: "I was looking for a developer with specific skills for our hackathon project. DevMate helped me find the perfect match in just minutes!",
      author: {
        name: 'Emily Rodriguez',
        role: 'UI/UX Designer',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
        <div className="absolute inset-0">
          <svg
            className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2"
            width="404"
            height="404"
            fill="none"
            viewBox="0 0 404 404"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="85737c0e-0916-41d7-917f-596dc7edfa27"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" className="text-primary-500" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
          </svg>
          <svg
            className="absolute right-full bottom-0 transform -translate-x-1/2 md:-translate-y-1/2 sm:translate-x-0"
            width="404"
            height="404"
            fill="none"
            viewBox="0 0 404 404"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="85737c0e-0916-41d7-917f-596dc7edfa28"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" className="text-primary-500" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa28)" />
          </svg>
        </div>
        <div className="pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="pt-12 sm:pt-16 lg:pt-20">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Find Hackathons.<br />
                  <span className="text-secondary-400">Build Your Team.</span>
                </h1>
                <p className="mt-6 text-xl text-white max-w-3xl">
                  DevMate connects students with hackathons and teammates to form the perfect group for your next project.
                </p>
                <div className="mt-10 flex space-x-4">
                  {isAuthenticated ? (
                    <Link
                      to="/dashboard"
                      className="btn btn-secondary inline-flex items-center"
                    >
                      Go to Dashboard
                      <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="btn btn-secondary inline-flex items-center"
                      >
                        Get Started
                        <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                      </Link>
                      <Link
                        to="/login"
                        className="btn btn-outline bg-transparent text-white border-white hover:bg-white hover:text-primary-600"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0 lg:relative">
                <div className="max-w-md mx-auto sm:max-w-2xl lg:max-w-none">
                  <img
                    className="w-full rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt="Team collaborating at a hackathon"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need for your next hackathon
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              DevMate provides all the tools you need to find the perfect hackathon and build your dream team.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-md shadow-lg">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                      <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Hear from our users
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              See how DevMate has helped students and organizers connect and collaborate.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="text-gray-600 italic">"{testimonial.content}"</div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={testimonial.author.imageUrl} alt="" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{testimonial.author.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.author.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-secondary-300">Join DevMate today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="btn bg-white text-primary-600 hover:bg-gray-50"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/login"
                className="btn bg-primary-600 text-white hover:bg-primary-500 border border-transparent"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
