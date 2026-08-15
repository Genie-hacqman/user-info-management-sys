import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Modal from '@/components/Modal';
import userService from '@/services/userService';
import { Plus, RefreshCw, Search, Users as UsersIcon } from 'lucide-react';
const initialFormData = {
  name: '',
  email: '',
  phone: '',
  role: 'User',
  status: 'Active',
  password: 'TempPass123!'
};
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const loadUsers = async () => {
    try {
      const {
        data
      } = await userService.getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const {
          data
        } = await userService.getUsers();
        if (isMounted) setUsers(data || []);
      } catch (error) {
        console.error('Failed to load users:', error);
        if (isMounted) setUsers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void fetchUsers();
    const handleUserDataUpdate = () => {
      void fetchUsers();
    };
    window.addEventListener('sly-user-data-updated', handleUserDataUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('sly-user-data-updated', handleUserDataUpdate);
    };
  }, []);
  const openAddUserModal = () => {
    setModalMode('add');
    setEditingUserId(null);
    setFormData(initialFormData);
    setFormError('');
    setIsModalOpen(true);
  };
  const openEditUserModal = user => {
    setModalMode('edit');
    setEditingUserId(user.id);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'User',
      status: user.status || 'Active',
      password: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };
  const handleFormChange = event => {
    const {
      name,
      value
    } = event.target;
    setFormData(previous => ({
      ...previous,
      [name]: value
    }));
    setFormError('');
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setFormError('');
    setEditingUserId(null);
    setFormData(initialFormData);
  };
  const handleSaveUser = async () => {
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    if (!trimmedName) {
      setFormError('Full name is required.');
      return;
    }
    if (!trimmedEmail) {
      setFormError('Email is required.');
      return;
    }
    if (!trimmedEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!trimmedPhone) {
      setFormError('Phone number is required.');
      return;
    }
    try {
      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        role: formData.role,
        status: formData.status
      };
      if (modalMode === 'add') {
        await userService.createUser({
          ...payload,
          password: formData.password || 'TempPass123!'
        });
        setNotice(`User "${trimmedName}" was added successfully.`);
      } else {
        await userService.updateUser(editingUserId, payload);
        setNotice(`User "${trimmedName}" was updated successfully.`);
      }
      closeModal();
      setCurrentPage(1);
      await loadUsers();
      window.dispatchEvent(new CustomEvent('sly-user-data-updated'));
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Unable to save user.';
      setFormError(message);
    }
  };
  const handleDeleteUser = async user => {
    const confirmed = window.confirm(`Delete user "${user.name}"? This action cannot be undone.`);
    if (!confirmed) return;
    try {
      await userService.deleteUser(user.id);
      setNotice(`User "${user.name}" was deleted successfully.`);
      await loadUsers();
      window.dispatchEvent(new CustomEvent('sly-user-data-updated'));
    } catch (error) {
      console.error('Failed to delete user:', error);
      setNotice('Failed to delete user.');
    }
  };
  const rowsPerPage = 5;
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = [user.name, user.email, user.phone].some(value => value.toLowerCase().includes(search.toLowerCase()));
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  return <div className="space-y-6">
      {}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">User Management</h1>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">Add, edit, or remove users from your system</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={async () => {
          await loadUsers();
          setNotice('User list refreshed.');
        }} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={openAddUserModal} className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {notice && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>}

      {}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, email, or phone..." value={search} onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }} className="pl-9" />
            </div>
            <select value={roleFilter} onChange={e => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Support">Support</option>
              <option value="User">User</option>
            </select>
            <select value={statusFilter} onChange={e => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <div className="text-center py-12 text-muted-foreground">Loading users...</div> : filteredUsers.length === 0 ? <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No users found</p>
            </div> : <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="w-25">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map(user => <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Active' ? 'default' : user.status === 'Pending' ? 'secondary' : 'outline'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.registeredAt || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:flex-wrap">
                            <Link to={`/admin/users/${user.id}`}>
                              <Button variant="ghost" size="sm" className="w-full min-[420px]:w-auto">
                                View
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={() => openEditUserModal(user)} className="w-full min-[420px]:w-auto">
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user)} className="w-full min-[420px]:w-auto">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>

              {}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredUsers.length ? (currentPage - 1) * rowsPerPage + 1 : 0}–
                  {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-full sm:w-auto">
                    Previous
                  </Button>
                  <span className="text-center text-sm text-muted-foreground sm:text-left">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-full sm:w-auto">
                    Next
                  </Button>
                </div>
              </div>
            </>}
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'edit' ? 'Edit User' : 'Add User'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleFormChange} placeholder="Jane Doe" required />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleFormChange} placeholder="jane@example.com" required />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="(555) 123-4567" required />
            <div>
              <label className="mb-2.5 block text-sm font-semibold text-slate-200">Role</label>
              <select name="role" value={formData.role} onChange={handleFormChange} className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30">
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Support">Support</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-sm font-semibold text-slate-200">Status</label>
              <select name="status" value={formData.status} onChange={handleFormChange} className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {modalMode === 'add' && <Input label="Temporary Password" name="password" type="text" value={formData.password} onChange={handleFormChange} placeholder="TempPass123!" />}
          </div>

          {formError && <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {formError}
            </div>}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={closeModal} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveUser} className="w-full sm:w-auto">
              {modalMode === 'edit' ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>;
}
