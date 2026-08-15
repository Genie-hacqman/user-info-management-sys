export default function StatCard({
  title,
  value,
  icon,
  color = 'blue'
}) {
  const colorConfigs = {
    blue: {
      bg: 'bg-[linear-gradient(135deg,_rgba(59,130,246,0.15),_rgba(37,99,235,0.08))]',
      border: 'border-blue-500/40',
      badge: 'bg-blue-500/20 text-blue-200',
      title: 'text-blue-300',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.25)]'
    },
    green: {
      bg: 'bg-[linear-gradient(135deg,_rgba(34,197,94,0.15),_rgba(22,163,74,0.08))]',
      border: 'border-green-500/40',
      badge: 'bg-green-500/20 text-green-200',
      title: 'text-green-300',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.25)]'
    },
    purple: {
      bg: 'bg-[linear-gradient(135deg,_rgba(168,85,247,0.15),_rgba(126,34,206,0.08))]',
      border: 'border-purple-500/40',
      badge: 'bg-purple-500/20 text-purple-200',
      title: 'text-purple-300',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.25)]'
    },
    red: {
      bg: 'bg-[linear-gradient(135deg,_rgba(239,68,68,0.15),_rgba(220,38,38,0.08))]',
      border: 'border-red-500/40',
      badge: 'bg-red-500/20 text-red-200',
      title: 'text-red-300',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.25)]'
    },
    yellow: {
      bg: 'bg-[linear-gradient(135deg,_rgba(234,179,8,0.15),_rgba(202,138,4,0.08))]',
      border: 'border-yellow-500/40',
      badge: 'bg-yellow-500/20 text-yellow-200',
      title: 'text-yellow-300',
      glow: 'shadow-[0_0_20px_rgba(234,179,8,0.25)]'
    },
    cyan: {
      bg: 'bg-[linear-gradient(135deg,_rgba(34,211,238,0.15),_rgba(6,182,212,0.08))]',
      border: 'border-cyan-500/40',
      badge: 'bg-cyan-500/20 text-cyan-200',
      title: 'text-cyan-300',
      glow: 'shadow-[0_0_20px_rgba(34,211,238,0.25)]'
    },
    pink: {
      bg: 'bg-[linear-gradient(135deg,_rgba(236,72,153,0.15),_rgba(190,24,93,0.08))]',
      border: 'border-pink-500/40',
      badge: 'bg-pink-500/20 text-pink-200',
      title: 'text-pink-300',
      glow: 'shadow-[0_0_20px_rgba(236,72,153,0.25)]'
    }
  };
  const config = colorConfigs[color] || colorConfigs.blue;
  return <div className={`group rounded-2xl border-2 ${config.border} ${config.bg} p-6 transition duration-300 hover:${config.border.replace('/', '-')} hover:${config.glow.replace('/', '-')} cursor-pointer`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-xs font-bold ${config.title} uppercase tracking-wider`}>{title}</p>
          <p className="mt-3 text-4xl font-bold text-white group-hover:text-blue-100 transition">{value}</p>
        </div>
        {icon && <div className={`rounded-xl ${config.badge} p-4 text-2xl group-hover:scale-110 transition`}>
            {icon}
          </div>}
      </div>
    </div>;
}
