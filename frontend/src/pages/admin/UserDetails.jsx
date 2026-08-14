import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import userService from '../../services/userService'

export default function UserDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'User',
    status: 'Active',
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await userService.getUserById(id)
        const foundUser = data || null
        setUser(foundUser)
        setFormData(foundUser ? {
          name: foundUser.name || '',
          email: foundUser.email || '',
          phone: foundUser.phone || '',
          role: foundUser.role || 'User',
          status: foundUser.status || 'Active',
        } : {
          name: '',
          email: '',
          phone: '',
          role: 'User',
          status: 'Active',
        })
      } catch (error) {
        console.error('Failed to load user details:', error)
        setUser(null)
        setFormData({
          name: '',
          email: '',
          phone: '',
          role: 'User',
          status: 'Active',
        })
      }
      setIsEditing(false)
    }

    fetchUser()
  }, [id])

  const displayUser = useMemo(() => user || {
    name: 'User not found',
    email: 'N/A',
    phone: 'N/A',
    role: 'User',
    status: 'Active',
    createdAt: 'N/A',
    updatedAt: 'N/A',
  }, [user])

  const persistUserUpdate = async (updatedUser) => {
    try {
      const { data } = await userService.updateUser(updatedUser.id, {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        status: updatedUser.status,
      })

      setUser({ ...updatedUser, ...data, updatedAt: new Date().toISOString() })
      window.dispatchEvent(new CustomEvent('sly-user-data-updated'))
    } catch (error) {
      console.error('Failed to update user record:', error)
      window.alert(error.message || 'Unable to update user record.')
    }
  }

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveChanges = async () => {
    if (!user) return

    const nextUser = {
      ...user,
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      status: formData.status,
      updatedAt: new Date().toISOString(),
    }

    if (!nextUser.name || !nextUser.email) {
      return
    }

    await persistUserUpdate(nextUser)
    setIsEditing(false)
  }

  const handleDeleteUser = async () => {
    if (!user) return

    const confirmed = window.confirm(`Delete ${user.name}? This action cannot be undone.`)
    if (!confirmed) return

    try {
      await userService.deleteUser(user.id)
      window.dispatchEvent(new CustomEvent('sly-user-data-updated'))
      navigate('/admin/users')
    } catch (error) {
      console.error('Failed to delete user:', error)
      window.alert(error.message || 'Unable to delete user record.')
    }
  }

  const handleResetPassword = async () => {
    if (!user) return

    const generatedPassword = `AdminReset-${Math.random().toString(36).slice(-8)}`

    try {
      await userService.updateUser(user.id, {
        password: generatedPassword,
        passwordResetRequired: true,
        lastPasswordResetByAdmin: new Date().toISOString(),
      })
      window.dispatchEvent(new CustomEvent('sly-user-data-updated'))
      window.alert(`Password reset for ${user.name}. New temporary password: ${generatedPassword}`)
    } catch (error) {
      console.error('Failed to reset password:', error)
      window.alert(error.message || 'Unable to reset password.')
    }
  }

  const handleToggleStatus = async () => {
    if (!user) return

    const nextStatus = user.status === 'Active' ? 'Inactive' : 'Active'
    await persistUserUpdate({ ...user, status: nextStatus })
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-600">User profile</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">User not found</h2>
          <p className="mt-3 text-slate-600">The stored user data for this record could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-600">User profile</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">{displayUser.name}</h2>
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="button" onClick={handleSaveChanges}>Save changes</Button>
              </>
            ) : (
              <Button type="button" variant="secondary" onClick={() => setIsEditing(true)}>Edit</Button>
            )}
            <Button type="button" variant="danger" onClick={handleToggleStatus}>{user.status === 'Active' ? 'Deactivate' : 'Activate'}</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Account details</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {isEditing ? (
              <>
                <div className="sm:col-span-2 rounded-lg bg-slate-50 p-4">
                  <label className="text-sm text-slate-500 block mb-2">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleFieldChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="sm:col-span-2 rounded-lg bg-slate-50 p-4">
                  <label className="text-sm text-slate-500 block mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <label className="text-sm text-slate-500 block mb-2">Phone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleFieldChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <label className="text-sm text-slate-500 block mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleFieldChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="User">User</option>
                    <option value="Manager">Manager</option>
                    <option value="Support">Support</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <label className="text-sm text-slate-500 block mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFieldChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 sm:col-span-2">
                  <p className="text-sm text-slate-500">Account creation</p>
                  <p className="mt-1 font-semibold text-slate-900">{displayUser.registeredAt || displayUser.createdAt || 'N/A'}</p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="mt-1 font-semibold text-slate-900">{displayUser.name}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="mt-1 font-semibold text-slate-900">{displayUser.email}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="mt-1 font-semibold text-slate-900">{displayUser.phone || 'Not provided'}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Role</p>
                  <p className="mt-1 font-semibold text-slate-900">{displayUser.role || 'User'}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Status</p>
                  <p className="mt-1 font-semibold text-emerald-600">{displayUser.status || 'Active'}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Account creation</p>
                  <p className="mt-1 font-semibold text-slate-900">{displayUser.registeredAt || displayUser.createdAt || 'N/A'}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 sm:col-span-2">
                  <p className="text-sm text-slate-500">Last updated / login</p>
                  <p className="mt-1 font-semibold text-slate-900">{displayUser.updatedAt || displayUser.lastLogin || 'N/A'}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Admin actions</h3>
          <div className="mt-5 space-y-3">
            <Button type="button" className="w-full justify-center">View activity</Button>
            <Button type="button" variant="secondary" className="w-full justify-center" onClick={handleResetPassword}>Reset password</Button>
            <Button type="button" variant="danger" className="w-full justify-center" onClick={handleDeleteUser}>Delete user</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
