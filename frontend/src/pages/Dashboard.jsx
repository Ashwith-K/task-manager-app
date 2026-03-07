import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const StatCard = ({ label, value, color }) => (
  <div className={`bg-slate-900 border ${color} rounded-xl p-6`}>
    <p className="text-slate-400 text-sm">{label}</p>
    <p className="text-3xl font-bold text-white mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksRes = await API.get('/tasks');
        setTasks(tasksRes.data);
        if (user.role === 'ADMIN') {
          const usersRes = await API.get('/users');
          setUsers(usersRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.role]);

  const pending = tasks.filter(t => t.status === 'PENDING').length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, <span className="text-cyan-400">{user.email.split('@')[0]}</span>
          </h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your tasks.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <StatCard label="Total Tasks" value={tasks.length} color="border-slate-700" />
              <StatCard label="Pending" value={pending} color="border-yellow-500/30" />
              <StatCard label="Completed" value={completed} color="border-green-500/30" />
            </div>

            {/* Admin: Users Table */}
            {user.role === 'ADMIN' && (
              <div className="mb-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  All Users
                  <span className="ml-2 text-xs bg-cyan-500 text-slate-900 px-2 py-0.5 rounded-full font-bold">ADMIN</span>
                </h2>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-slate-400">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {users.map(u => (
                        <tr key={u.id} className="text-slate-300 hover:bg-slate-800/50 transition">
                          <td className="px-4 py-3">{u.id}</td>
                          <td className="px-4 py-3">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.role === 'ADMIN' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700 text-slate-300'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recent Tasks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  {user.role === 'ADMIN' ? 'All Tasks' : 'Your Tasks'}
                </h2>
                <Link to="/tasks" className="text-cyan-400 text-sm hover:underline">
                  Manage tasks →
                </Link>
              </div>

              {tasks.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
                  <p className="text-slate-400">No tasks yet.</p>
                  <Link to="/tasks" className="text-cyan-400 text-sm mt-2 inline-block hover:underline">
                    Create your first task →
                  </Link>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-slate-400">
                      <tr>
                        <th className="px-4 py-3 text-left">Title</th>
                        {user.role === 'ADMIN' && <th className="px-4 py-3 text-left">Owner</th>}
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {tasks.slice(0, 5).map(task => (
                        <tr key={task.id} className="text-slate-300 hover:bg-slate-800/50 transition">
                          <td className="px-4 py-3 font-medium">{task.title}</td>
                          {user.role === 'ADMIN' && <td className="px-4 py-3 text-slate-400">{task.user?.email}</td>}
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${task.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400">{new Date(task.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;