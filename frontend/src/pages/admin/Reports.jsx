import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'

const reportTypes = [
  {
    title: 'User Growth Report',
    description: 'Track user registrations and account creation trends over time',
    icon: '📈',
    id: 'user-growth',
    metrics: { current: 1240, growth: '+12%', period: 'Last 30 days' },
  },
  {
    title: 'User Activity Report',
    description: 'Monitor login activity and user engagement metrics',
    icon: '👥',
    id: 'user-activity',
    metrics: { current: '89%', growth: 'active users', period: 'Today' },
  },
  {
    title: 'System Performance',
    description: 'Check server uptime, response times, and system health',
    icon: '⚡',
    id: 'performance',
    metrics: { current: '99.9%', growth: 'uptime', period: 'Last 7 days' },
  },
  {
    title: 'Security Report',
    description: 'Review failed login attempts, suspicious activities, and security alerts',
    icon: '🔒',
    id: 'security',
    metrics: { current: '3', growth: 'alerts', period: 'Last 24 hours' },
  },
]

const STORAGE_KEY = 'sly-generated-reports'

const generateSampleData = (reportType, dateRange) => {
  return {
    reportType,
    dateRange,
    generatedAt: new Date().toISOString(),
    data: [
      { date: '2026-08-10', users: 45, active: 38 },
      { date: '2026-08-11', users: 52, active: 41 },
      { date: '2026-08-12', users: 48, active: 39 },
      { date: '2026-08-13', users: 61, active: 48 },
      { date: '2026-08-14', users: 55, active: 44 },
    ],
  }
}

const downloadCSV = (filename, data) => {
  const csv = 'Date,Users,Active\n' + data.data.map(d => `${d.date},${d.users},${d.active}`).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

const downloadExcel = (filename, data) => {
  const csv = 'Date,Users,Active\n' + data.data.map(d => `${d.date},${d.users},${d.active}`).join('\n')
  const blob = new Blob([csv], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.replace('.csv', '.xlsx')
  a.click()
  window.URL.revokeObjectURL(url)
}

const downloadPDF = (filename, data) => {
  const content = `
    ${data.reportType.toUpperCase()} - ${data.dateRange}
    Generated: ${new Date(data.generatedAt).toLocaleString()}
    
    Data:
    ${data.data.map(d => `${d.date}: ${d.users} users, ${d.active} active`).join('\n')}
  `
  const blob = new Blob([content], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.replace('.csv', '.pdf')
  a.click()
  window.URL.revokeObjectURL(url)
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState('user-growth')
  const [dateRange, setDateRange] = useState('Last 7 days')
  const [format, setFormat] = useState('PDF')
  const [loading, setLoading] = useState(false)
  const [generatedReports, setGeneratedReports] = useState([])
  const [viewingReport, setViewingReport] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setGeneratedReports(JSON.parse(saved))
    }
  }, [])

  const handleGenerateReport = async () => {
    setLoading(true)
    
    setTimeout(() => {
      const reportData = generateSampleData(reportType, dateRange)
      const timestamp = new Date().toLocaleString()
      const filename = `${reportType}-${dateRange.replace(/\s+/g, '-')}-${Date.now()}`
      
      const newReport = {
        id: Date.now(),
        name: `${reportType} Report - ${dateRange}`,
        filename,
        type: reportType,
        format: format,
        dateRange,
        generatedAt: timestamp,
        data: reportData,
      }

      const updated = [newReport, ...generatedReports].slice(0, 10)
      setGeneratedReports(updated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

      if (format === 'CSV') {
        downloadCSV(`${filename}.csv`, reportData)
      } else if (format === 'Excel') {
        downloadExcel(`${filename}.xlsx`, reportData)
      } else if (format === 'PDF') {
        downloadPDF(`${filename}.pdf`, reportData)
      } else {
        setViewingReport(newReport)
      }

      setLoading(false)
    }, 1500)
  }

  const handleDownloadReport = (report) => {
    if (report.format === 'CSV') {
      downloadCSV(`${report.filename}.csv`, report.data)
    } else if (report.format === 'Excel') {
      downloadExcel(`${report.filename}.xlsx`, report.data)
    } else if (report.format === 'PDF') {
      downloadPDF(`${report.filename}.pdf`, report.data)
    }
  }

  const handleViewReport = (report) => {
    setViewingReport(report)
  }

  const handleDeleteReport = (reportId) => {
    const updated = generatedReports.filter(r => r.id !== reportId)
    setGeneratedReports(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return (
    <div className="space-y-8">
      <PageHeader
        pretitle="📊 Analytics"
        title="System Reports"
        description="Generate and manage comprehensive reports on system performance, user activity, and business metrics."
      />

      {/* Report Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 hover:border-violet-500/50 hover:bg-slate-800 transition"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-4xl">{report.icon}</div>
            </div>
            <h3 className="text-lg font-bold text-white">{report.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{report.description}</p>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-xs font-semibold text-slate-400 uppercase">Current Metric</p>
              <p className="mt-2 text-2xl font-bold text-white">{report.metrics.current}</p>
              <p className="text-xs text-violet-400 font-medium mt-1">{report.metrics.growth}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Report Generator */}
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Generate Report</h2>
        <p className="text-slate-400 mb-6">Create and download reports in your preferred format</p>

        <div className="grid gap-4 md:grid-cols-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-slate-100 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition"
            >
              {reportTypes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-slate-100 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-slate-100 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition"
            >
              <option>PDF</option>
              <option>CSV</option>
              <option>Excel</option>
              <option>View Online</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full rounded-lg bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 px-4 py-2 font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⟳ Generating...' : '📊 Generate'}
            </button>
          </div>
        </div>
      </div>

      {/* View Report Modal */}
      {viewingReport && (
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">📋 View Report</h2>
            <button
              onClick={() => setViewingReport(null)}
              className="text-2xl text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">{viewingReport.name}</h3>
              <p className="text-sm text-slate-400 mb-4">Generated: {viewingReport.generatedAt}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-3 text-left font-semibold text-slate-300">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-300">Users</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-300">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingReport.data.data.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-700 hover:bg-slate-900/50 transition">
                      <td className="px-4 py-3 text-slate-300">{row.date}</td>
                      <td className="px-4 py-3 text-slate-300">{row.users}</td>
                      <td className="px-4 py-3 text-slate-300">{row.active}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Recently Generated Reports */}
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">📥 Recently Generated Reports</h2>
        <p className="text-slate-400 mb-6">Download or view your previously generated reports</p>

        {generatedReports.length > 0 ? (
          <div className="space-y-3">
            {generatedReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 hover:bg-slate-900 p-4 transition"
              >
                <div className="flex-1">
                  <p className="font-semibold text-white">{report.name}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {report.format}
                    </span>
                    <span className="text-xs text-slate-400">{report.generatedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadReport(report)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 transition"
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={() => handleViewReport(report)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 transition"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition"
                  >
                    ✕ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/50 px-6 py-12 text-center">
            <p className="text-slate-400">No reports generated yet</p>
            <p className="text-sm text-slate-500 mt-1">Generate your first report above to see it here</p>
          </div>
        )}
      </div>
    </div>
  )
}
