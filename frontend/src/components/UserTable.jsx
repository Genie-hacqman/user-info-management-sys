export default function UserTable({ columns = [], rows = [], emptyMessage = 'No users found.' }) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border-2 border-dashed border-cyan-500/30 bg-[linear-gradient(135deg,rgba(34,211,238,0.1),rgba(6,182,212,0.05))] px-6 py-12 text-center text-sm text-slate-300 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
        📭 {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-slate-700/50 bg-slate-900/60 shadow-xl backdrop-blur-sm">
      <table className="min-w-full divide-y divide-slate-700/50">
        <thead className="bg-linear-to-r from-slate-800 to-slate-900/80 border-b-2 border-slate-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key || column.label}
                className="px-6 py-4 text-left text-xs font-bold text-slate-200 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-700/50">
          {rows.map((row, index) => (
            <tr key={row.id || index} className="group hover:bg-slate-800/50 transition">
              {columns.map((column) => (
                <td key={`${row.id || index}-${column.key}`} className="px-6 py-4 text-sm text-slate-200 group-hover:text-white transition">
                  {typeof column.render === 'function' ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
