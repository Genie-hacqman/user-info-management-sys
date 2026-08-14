import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/profile', label: 'Profile' },
  { to: '/dashboard/edit-profile', label: 'Edit Profile' },
  { to: '/dashboard/change-password', label: 'Change Password' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 rounded-2xl bg-slate-900 p-4 text-white shadow-lg">
      <h3 className="mb-4 text-lg font-semibold text-slate-100">Navigation</h3>
      <nav className="space-y-2">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isActive
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
