import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Zap, Lock, Download, Eye, Trash2 } from 'lucide-react';
const reportTypes = [{
  title: 'User Growth',
  description: 'Track user registrations and account creation trends',
  icon: TrendingUp,
  id: 'user-growth',
  metric: '1,240',
  change: '+12%'
}, {
  title: 'User Activity',
  description: 'Monitor login activity and user engagement',
  icon: Users,
  id: 'user-activity',
  metric: '89%',
  change: 'active users'
}, {
  title: 'Performance',
  description: 'Check server uptime and response times',
  icon: Zap,
  id: 'performance',
  metric: '99.9%',
  change: 'uptime'
}, {
  title: 'Security',
  description: 'Review security alerts and suspicious activities',
  icon: Lock,
  id: 'security',
  metric: '3',
  change: 'alerts'
}];
const STORAGE_KEY = 'sly-generated-reports';
const generateSampleData = (reportType, dateRange) => {
  return {
    reportType,
    dateRange,
    generatedAt: new Date().toISOString(),
    data: [{
      date: '2026-08-10',
      users: 45,
      active: 38
    }, {
      date: '2026-08-11',
      users: 52,
      active: 41
    }, {
      date: '2026-08-12',
      users: 48,
      active: 39
    }, {
      date: '2026-08-13',
      users: 61,
      active: 48
    }, {
      date: '2026-08-14',
      users: 55,
      active: 44
    }]
  };
};
export default function ReportsPage() {
  const [reportType, setReportType] = useState('user-growth');
  const [dateRange, setDateRange] = useState('Last 7 days');
  const [format, setFormat] = useState('PDF');
  const [loading, setLoading] = useState(false);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [viewingReport, setViewingReport] = useState(null);
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setGeneratedReports(JSON.parse(saved));
    }
  }, []);
  const handleGenerateReport = async () => {
    setLoading(true);
    setTimeout(() => {
      const reportData = generateSampleData(reportType, dateRange);
      const timestamp = new Date().toLocaleString();
      const filename = `${reportType}-${dateRange.replace(/\s+/g, '-')}-${Date.now()}`;
      const newReport = {
        id: Date.now(),
        name: `${reportType} Report - ${dateRange}`,
        filename,
        type: reportType,
        format: format,
        dateRange,
        generatedAt: timestamp,
        data: reportData
      };
      const updated = [newReport, ...generatedReports].slice(0, 10);
      setGeneratedReports(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setLoading(false);
    }, 1500);
  };
  const handleDeleteReport = reportId => {
    const updated = generatedReports.filter(r => r.id !== reportId);
    setGeneratedReports(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };
  return <div className="space-y-8">
      {}
      <div>
        <h1 className="text-4xl font-bold text-white">Reports</h1>
        <p className="mt-2 text-slate-300">Generate and manage comprehensive reports on system performance</p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map(report => {
        const Icon = report.icon;
        return <Card key={report.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{report.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.metric}</div>
                <p className="text-xs text-muted-foreground mt-2">{report.change}</p>
                <p className="text-xs text-muted-foreground mt-3">{report.description}</p>
              </CardContent>
            </Card>;
      })}
      </div>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Create and download reports in your preferred format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Report Type</label>
              <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {reportTypes.map(r => <option key={r.id} value={r.id}>
                    {r.title}
                  </option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Date Range</label>
              <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Format</label>
              <select value={format} onChange={e => setFormat(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>PDF</option>
                <option>CSV</option>
                <option>Excel</option>
                <option>View Online</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleGenerateReport} disabled={loading} className="w-full">
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      {viewingReport && <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{viewingReport.name}</CardTitle>
              <CardDescription>{viewingReport.generatedAt}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setViewingReport(null)}>
              Close
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewingReport.data.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Total Users" />
                <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} name="Active Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>}

      {}
      <Card>
        <CardHeader>
          <CardTitle>Recently Generated Reports</CardTitle>
          <CardDescription>Download or manage your previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          {generatedReports.length > 0 ? <div className="space-y-3">
              {generatedReports.map(report => <div key={report.id} className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted transition">
                  <div className="flex-1">
                    <p className="font-semibold">{report.name}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <Badge variant="secondary">{report.format}</Badge>
                      <span className="text-xs text-muted-foreground">{report.generatedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setViewingReport(report)}>
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive" onClick={() => handleDeleteReport(report.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>)}
            </div> : <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No reports generated yet</p>
              <p className="text-sm text-muted-foreground mt-1">Generate your first report to see it here</p>
            </div>}
        </CardContent>
      </Card>
    </div>;
}
