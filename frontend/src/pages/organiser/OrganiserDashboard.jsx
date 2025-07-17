import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hackathonsAPI } from '../../services/apiServices';


const OrganiserDashboard = () => {
  const [hackathon, setHackathon] = useState({
    name: '',
    description: '',
    date: '',
  });
  const [message, setMessage] = useState('');
  const [myHackathons, setMyHackathons] = useState([]);
  const { currentUser } = useAuth();

  const fetchMyHackathons = async () => {
    try {
      const all = await hackathonsAPI.getHackathons();
      setMyHackathons(all.filter(h => {
        if (!h.organiser) return false;
        const orgId = h.organiser._id || h.organiser.id || h.organiser;
        const userId = currentUser.id || currentUser._id;
        return orgId === userId;
      }));
    } catch {
      setMyHackathons([]);
    }
  };

  useEffect(() => {
    fetchMyHackathons();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setHackathon({ ...hackathon, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await hackathonsAPI.createHackathon(hackathon);
      setMessage('Hackathon added successfully!');
      setHackathon({ name: '', description: '', date: '' });
      fetchMyHackathons();
    } catch (err) {
      setMessage('Error adding hackathon.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Organiser: Add Hackathon</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={hackathon.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={hackathon.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={hackathon.date}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="bg-primary-500 text-white px-4 py-2 rounded">Add Hackathon</button>
      </form>
      {message && <div className="mt-4 text-center">{message}</div>}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">My Organised Hackathons</h3>
        {myHackathons.length === 0 ? (
          <div>No hackathons organised yet.</div>
        ) : (
          <ul className="space-y-3">
            {myHackathons.map(h => (
              <li key={h._id || h.id} className="p-3 bg-gray-50 rounded border">
                <div className="font-bold">{h.name}</div>
                <div>{h.description}</div>
                <div className="text-sm text-gray-500">Date: {h.date}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrganiserDashboard;
