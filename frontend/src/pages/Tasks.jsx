import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleCreate = async (data) => {
    try {
      await API.post('/tasks', data);
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleEdit = async (data) => {
    try {
      await API.put(`/tasks/${editingTask.id}`, data);
      setEditingTask(null);
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const openEdit = (task) => { setEditingTask(task); setModalOpen(true); };
  const openCreate = () => { setEditingTask(null); setModalOpen(true); };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Tasks</h1>
            <p className="text-slate-400 mt-1">
              {user.role === 'ADMIN' ? 'Managing all tasks' : 'Your personal tasks'}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-5 py-2.5 rounded-lg text-sm transition"
          >
            + New Task
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-16 text-center">
            <p className="text-2xl mb-2">📋</p>
            <p className="text-slate-300 font-medium">No tasks yet</p>
            <p className="text-slate-500 text-sm mt-1">Click "New Task" to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map(task => (
              <div
                key={task.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start justify-between hover:border-slate-700 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-white">{task.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${task.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {task.status}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-slate-400 text-sm mt-1 truncate">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                    {user.role === 'ADMIN' && task.user && (
                      <span className="text-cyan-600">by {task.user.email}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4 shrink-0">
                  <button
                    onClick={() => openEdit(task)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleEdit : handleCreate}
        task={editingTask}
      />
    </div>
  );
};

export default Tasks;