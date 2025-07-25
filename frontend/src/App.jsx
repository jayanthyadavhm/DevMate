import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import HackathonList from './pages/hackathons/HackathonList';
import HackathonDetails from './pages/hackathons/HackathonDetails';
import CreateHackathon from './pages/hackathons/CreateHackathon';
import FindTeammates from './pages/teams/FindTeammates';
import TeamDetails from './pages/teams/TeamDetails';
import UserProfile from './pages/profile/UserProfile';
import EditProfile from './pages/profile/EditProfile';
import OrganiserDashboard from './pages/organiser/OrganiserDashboard';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/projects/CreateProject';
import NotFound from './pages/NotFound';

// Auth Components
import PrivateRoute from './components/auth/PrivateRoute';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow pt-20">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/hackathons" element={
                <PrivateRoute requiredRole="user">
                  <HackathonList />
                </PrivateRoute>
              } />
              
              {/* Specific routes before dynamic routes */}
              <Route path="/hackathons/create" element={
                <PrivateRoute requiredRole="organizer">
                  <CreateHackathon />
                </PrivateRoute>
              } />
              <Route path="/hackathons/:id" element={
                <PrivateRoute>
                  <HackathonDetails />
                </PrivateRoute>
              } />
              
              {/* Protected routes */}
              {/* Organiser dashboard route */}
              <Route path="/organiser" element={
                <PrivateRoute requiredRole="organizer">
                  <OrganiserDashboard />
                </PrivateRoute>
              } />
              {/* Student dashboard route */}
              <Route path="/dashboard" element={
                <PrivateRoute requiredRole="user">
                  <StudentDashboard />
                </PrivateRoute>
              } />
              <Route path="/projects" element={
                <PrivateRoute requiredRole="user">
                  <Projects />
                </PrivateRoute>
              } />
              <Route path="/projects/create" element={
                <PrivateRoute requiredRole="user">
                  <CreateProject />
                </PrivateRoute>
              } />
              <Route path="/find-teammates" element={
                <PrivateRoute requiredRole="user">
                  <FindTeammates />
                </PrivateRoute>
              } />
              <Route path="/teams/:id" element={
                <PrivateRoute requiredRole="user">
                  <TeamDetails />
                </PrivateRoute>
              } />
              <Route path="/profile/edit" element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              } />
              <Route path="/profile/:id" element={<UserProfile />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
