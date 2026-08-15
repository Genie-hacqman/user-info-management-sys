import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import userService from '../../services/userService';
export default function UserDirectoryPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadUsers = async () => {
    try {
      const {
        data
      } = await userService.getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to load directory users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadUsers();
    const refreshUsers = () => loadUsers();
    window.addEventListener('sly-user-data-updated', refreshUsers);
    return () => window.removeEventListener('sly-user-data-updated', refreshUsers);
  }, []);
  return <div className="space-y-6">
      <PageHeader pretitle="Directory" title="Users" description="A simple overview of all registered users in the system." />

      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">User list</h2>
          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-sm font-medium text-violet-300">
            {users.length} users
          </span>
        </div>

        {loading ? <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/50 px-6 py-12 text-center text-sm text-slate-400">
            Loading users...
          </div> : users.length > 0 ? <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="min-w-full divide-y divide-slate-700 text-left">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-300">No.</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-300">Name</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-300">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 bg-slate-800/60">
                {users.map((user, index) => <tr key={user.id || `${user.email}-${index}`} className="hover:bg-slate-700/40">
                    <td className="px-4 py-3 text-sm text-slate-200">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-white">{user.name || 'Unknown user'}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{user.phone || 'Not provided'}</td>
                  </tr>)}
              </tbody>
            </table>
          </div> : <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/50 px-6 py-12 text-center text-sm text-slate-400">
            No users found.
          </div>}
      </div>
    </div>;
}
