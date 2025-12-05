import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  useAnalyticsSummary, 
  useDailyVisits, 
  usePagePopularity, 
  useRecentVisits,
  useContentAnalytics
} from '@/hooks/useAnalytics';
import { Eye, Users, Globe, TrendingUp, Clock, ExternalLink, Calendar, BookOpen, Users2, CalendarDays, CalendarX, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function AdminAnalytics() {
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary(30);
  const { data: dailyVisits, isLoading: dailyLoading } = useDailyVisits(30);
  const { data: pagePopularity, isLoading: pagesLoading } = usePagePopularity(30);
  const { data: recentVisits, isLoading: recentLoading } = useRecentVisits(20);
  const { data: contentAnalytics, isLoading: contentLoading } = useContentAnalytics();

  if (summaryLoading || dailyLoading || pagesLoading || recentLoading || contentLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatPagePath = (path: string) => {
    const pageMappings: Record<string, string> = {
      '/': 'Home',
      '/about': 'About',
      '/ministries': 'Ministries',
      '/services': 'Services',
      '/events': 'Events',
      '/contact': 'Contact',
      '/auth': 'Authentication',
      '/admin': 'Admin Dashboard',
    };
    return pageMappings[path] || path;
  };

  const formatChartData = (data: any[]) => {
    return data?.map(item => ({
      ...item,
      date: format(new Date(item.date), 'MMM dd'),
    })) || [];
  };

  const pieChartData = pagePopularity?.slice(0, 6).map((page, index) => ({
    name: formatPagePath(page.page_path),
    value: page.total_visits,
    color: COLORS[index % COLORS.length],
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Website Analytics</h2>
        <p className="text-muted-foreground">
          Track your website performance and visitor insights
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total_visits?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              All time visits to your website
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.unique_visitors?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Individual visitors tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pages Tracked</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total_pages || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Different pages visited
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(Number(summary?.avg_daily_visits) || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Average visits per day (30d)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Analytics Cards */}
      <div>
        <h3 className="text-lg font-display font-semibold mb-4">Content Overview</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ministries</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentAnalytics?.total_ministries?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">
                Active ministries in your church
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentAnalytics?.total_events?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">
                All events (past and upcoming)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentAnalytics?.scheduled_events?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">
                Events ready to happen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Events</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentAnalytics?.done_events?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">
                Successfully completed events
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts and Data */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Page Analytics</TabsTrigger>
          <TabsTrigger value="content">Content Analytics</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Visits (Last 30 Days)</CardTitle>
                <CardDescription>
                  Track your website traffic over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formatChartData(dailyVisits || [])}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="total_visits" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Total Visits"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="unique_visitors" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      name="Unique Visitors"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Page Distribution</CardTitle>
                <CardDescription>
                  Most visited pages on your website
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Page Performance (Last 30 Days)</CardTitle>
              <CardDescription>
                Detailed breakdown of visits per page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={pagePopularity?.slice(0, 8) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="page_path" 
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tickFormatter={formatPagePath}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(label) => formatPagePath(label)}
                    formatter={(value: number, name: string) => [
                      value.toLocaleString(), 
                      name === 'total_visits' ? 'Total Visits' : 'Unique Visitors'
                    ]}
                  />
                  <Legend />
                  <Bar 
                    dataKey="total_visits" 
                    fill="#8884d8" 
                    name="Total Visits" 
                  />
                  <Bar 
                    dataKey="unique_visitors" 
                    fill="#82ca9d" 
                    name="Unique Visitors" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Top Pages Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pagePopularity?.slice(0, 10).map((page, index) => (
                  <div key={page.page_path} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="w-8 h-6 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{formatPagePath(page.page_path)}</span>
                      <span className="text-sm text-muted-foreground">({page.page_path})</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span><strong>{page.total_visits}</strong> visits</span>
                      <span><strong>{page.unique_visitors}</strong> unique</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Overview</CardTitle>
                <CardDescription>
                  Summary of your church's content
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded border bg-muted/20">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Ministries</div>
                        <div className="text-sm text-muted-foreground">
                          Active church ministries
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      {contentAnalytics?.total_ministries || 0}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded border bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Total Events</div>
                        <div className="text-sm text-muted-foreground">
                          All events created
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      {contentAnalytics?.total_events || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Status Breakdown</CardTitle>
                <CardDescription>
                  Current status of all events
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded border bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-800">Scheduled Events</div>
                        <div className="text-sm text-blue-600">
                          Ready to happen as planned
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {contentAnalytics?.scheduled_events || 0}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded border bg-yellow-50 border-yellow-200">
                    <div className="flex items-center gap-3">
                      <CalendarX className="h-5 w-5 text-yellow-600" />
                      <div>
                        <div className="font-medium text-yellow-800">Postponed Events</div>
                        <div className="text-sm text-yellow-600">
                          Events that have been delayed
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-800">
                      {contentAnalytics?.postponed_events || 0}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded border bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-green-800">Completed Events</div>
                        <div className="text-sm text-green-600">
                          Successfully finished events
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-800">
                      {contentAnalytics?.done_events || 0}
                    </div>
                  </div>
                  
                  {contentAnalytics?.total_events && contentAnalytics.total_events > 0 && (
                    <div className="mt-4 p-3 rounded bg-gray-50 border border-gray-200">
                      <div className="text-sm text-gray-800 space-y-1">
                        <div>
                          <strong>Completion Rate:</strong> {' '}
                          {Math.round((contentAnalytics.done_events / contentAnalytics.total_events) * 100)}% 
                          of events have been completed
                        </div>
                        {contentAnalytics.postponed_events > 0 && (
                          <div>
                            <strong>Postponed Rate:</strong> {' '}
                            {Math.round((contentAnalytics.postponed_events / contentAnalytics.total_events) * 100)}% 
                            of events have been postponed
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Live feed of recent website visits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentVisits?.map((visit) => (
                  <div key={visit.id} className="flex items-center justify-between p-3 rounded border bg-muted/20">
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{formatPagePath(visit.page_path)}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(visit.visited_at), 'MMM dd, yyyy HH:mm:ss')}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {visit.referrer ? (
                        <span>from {new URL(visit.referrer).hostname}</span>
                      ) : (
                        <span>direct visit</span>
                      )}
                    </div>
                  </div>
                ))}
                {(!recentVisits || recentVisits.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}