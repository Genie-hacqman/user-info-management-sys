import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import ConfirmDialog from '../../components/ConfirmDialog'
import PageHeader from '../../components/PageHeader'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'
import userService from '../../services/userService'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [pendingAction, setPendingAction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'User', status: 'Active' })
  const [successMessage, setSuccessMessage] = useState('')
  const [formError, setFormError] = useState('')

  const loadUsers = async () => {
    try {
      const { data } = await userService.getUsers()
      setUsers(data || [])
    } catch (error) {
      console.error('Failed to load users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()

    const handleUserDataUpdate = () => loadUsers()
    window.addEventListener('sly-user-data-updated', handleUserDataUpdate)

    return () => window.removeEventListener('sly-user-data-updated', handleUserDataUpdate)
  }, [])

  const rowsPerPage = 5

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = [user.name, user.email, user.phone].some((value) =>
        value.toLowerCase().includes(search.toLowerCase()),
      )
      const matchesRole = roleFilter === 'All' || user.role === roleFilter
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage))
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handleStatusToggle = async (userId) => {
    const targetUser = users.find((user) => user.id === userId)
    if (!targetUser) return

    const nextStatus = targetUser.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await userService.updateUser(userId, { status: nextStatus })
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: nextStatus } : user)))
      window.dispatchEvent(new CustomEvent('sly-user-data-updated'))
    } catch (error) {
      console.error('Failed to update user status:', error)
    }
  }

  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId)
      setUsers((prev) => prev.filter((user) => user.id !== userId))
      window.dispatchEvent(new CustomEvent('sly-user-data-updated'))
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const openAddUserModal = () => {
    setEditingUser(null)
    setFormData({ name: '', email: '', phone: '', role: 'User', status: 'Active', password: 'TempPass123!' })
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditUserModal = (user) => {
    setEditingUser(user)
    setFormData({ ...user, password: '' })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormError('')
  }

  const handleSaveUser = async () => {
    setFormError('')

    if (!formData.name.trim()) {
      setFormError('Full name is required')
      return
    }

    if (!formData.email.trim()) {
      setFormError('Email is required')
      return
    }

    if (!formData.email.includes('@')) {
      setFormError('Please enter a valid email')
      return
    }

    if (!formData.phone.trim()) {
      setFormError('Phone is required')
      return
    }

    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          role: formData.role,
          status: formData.status,
        })
        setSuccessMessage(`User "${formData.name}" updated successfully!`)
      } else {
        const generatedPassword = formData.password || 'TempPass123!'
        const { data } = await userService.createUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          role: formData.role,
          status: formData.status,
          password: generatedPassword,
        })

        if (generatedPassword === 'TempPass123!') {
          window.alert(`User "${data.name}" was created with the temporary password: ${generatedPassword}`)
        }
        setSuccessMessage(`User "${formData.name}" added successfully!`)
      }

      await loadUsers()
      window.dispatchEvent(new CustomEvent('sly-user-data-updated'))
      setIsModalOpen(false)
      setCurrentPage(1)
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch (error) {
      console.error('Failed to save user:', error)
      setFormError(error.message || 'Unable to save user.')
    }
  }

  const openConfirm = (type, user) => {
    setPendingAction({ type, user })
  }

  const executeAction = () => {
    if (!pendingAction) return

    if (pendingAction.type === 'delete') {
      handleDelete(pendingAction.user.id)
      setSuccessMessage(`User "${pendingAction.user.name}" deleted successfully!`)
    }
    if (pendingAction.type === 'status') {
      handleStatusToggle(pendingAction.user.id)
      const newStatus = pendingAction.user.status === 'Active' ? 'Inactive' : 'Active'
      setSuccessMessage(`User "${pendingAction.user.name}" marked as ${newStatus}!`)
    }

    setPendingAction(null)
    setTimeout(() => setSuccessMessage(''), 4000)
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      {successMessage && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 flex items-center gap-3 animate-pulse">
          <span className="text-green-600 text-lg">✓</span>
          <p className="text-sm font-medium text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <PageHeader
          pretitle="Management"
          title="User management"
          description="Add, edit, or remove users from your system."
        />
        <div className="flex gap-3">
          <Button onClick={async () => {
            try {
              const currentUsers = users.slice()
              if (!currentUsers.length) {
                setSuccessMessage('No users to reset.')
                setTimeout(() => setSuccessMessage(''), 4000)
                return
              }
              if (window.confirm('Refresh the current user list from the backend?')) {
                await loadUsers()
                setSuccessMessage('User list refreshed from backend.')
                setTimeout(() => setSuccessMessage(''), 4000)
              }
            } catch (error) {
              console.error('Failed to refresh users:', error)
            }
          }} variant="secondary">
            ↻ Refresh Data
          </Button>
          <Button onClick={openAddUserModal} className="bg-green-600 hover:bg-green-700">
            + Add User
          </Button>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          placeholder="Search users..."
          aria-label="Search users by name, email, or phone"
          className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value)
            setCurrentPage(1)
          }}
          aria-label="Filter users by role"
          className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="All">All roles</option>
          {['Admin', 'Manager', 'Support', 'User'].map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setCurrentPage(1)
          }}
          aria-label="Filter users by status"
          className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
          Loading users from the backend...
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState icon="👤" title="No users found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">User</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Registered</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{user.phone}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{user.role}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          user.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : user.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{user.registeredAt}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/admin/users/${user.id}`} className="font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1">
                          View
                        </Link>
                        <button type="button" onClick={() => openEditUserModal(user)} className="font-medium text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1">
                          Edit
                        </button>
                        <button type="button" onClick={() => openConfirm('status', user)} className="font-medium text-amber-600 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 rounded px-1">
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button type="button" onClick={() => openConfirm('delete', user)} className="font-medium text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing {filteredUsers.length ? (currentPage - 1) * rowsPerPage + 1 : 0}–
              {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </p>

            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                Previous
              </Button>
              <span className="text-sm text-slate-600">Page {currentPage} of {totalPages}</span>
              <Button type="button" variant="secondary" size="sm" onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        onConfirm={executeAction}
        title={pendingAction?.type === 'delete' ? 'Delete user' : 'Update user status'}
        message={
          pendingAction?.type === 'delete'
            ? `Are you sure you want to delete ${pendingAction?.user?.name}? This action cannot be undone.`
            : `Do you want to ${pendingAction?.user?.status === 'Active' ? 'deactivate' : 'activate'} ${pendingAction?.user?.name}?`
        }
        confirmText={pendingAction?.type === 'delete' ? 'Delete' : 'Confirm'}
        destructive={pendingAction?.type === 'delete'}
      />

      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false)
        setFormError('')
      }} title={editingUser ? 'Edit User' : 'Add New User'} size="md">
        <div className="space-y-4">
          {formError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-3">
              <span className="text-red-600 text-lg">✕</span>
              <p className="text-sm font-medium text-red-700">{formError}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="e.g., John Doe"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="e.g., john@example.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              placeholder="e.g., +1 (415) 555-0101"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="User">User</option>
                <option value="Manager">Manager</option>
                <option value="Support">Support</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => {
              setIsModalOpen(false)
              setFormError('')
            }}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveUser} className="bg-blue-600 hover:bg-blue-700">
              {editingUser ? 'Update User' : 'Add User'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
