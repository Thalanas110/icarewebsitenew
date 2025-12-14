import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [activeTab, setActiveTab] = useState("overview");
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
    <div className="space-y-6 pb-6 max-w-full overflow-x-hidden">
      <div>
        <h2 className="text-xl md:text-2xl font-display font-bold break-words">Website Analytics</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Track your website performance and visitor insights
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Visits</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold break-all">{summary?.total_visits?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              All time visits to your website
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold break-all">{summary?.unique_visitors?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              Individual visitors tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Pages Tracked</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold break-all">{summary?.total_pages || '0'}</div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              Different pages visited
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Daily Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold break-all">{Math.round(Number(summary?.avg_daily_visits) || 0)}</div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              Average visits per day (30d)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Analytics Cards */}
      <div>
        <h3 className="text-base md:text-lg font-display font-semibold mb-3 md:mb-4">Content Overview</h3>
        <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Total Ministries</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold break-all">{contentAnalytics?.total_ministries?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Active ministries in your church
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold break-all">{contentAnalytics?.total_events?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                All events (past and upcoming)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Scheduled Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold break-all">{contentAnalytics?.scheduled_events?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Events ready to happen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Completed Events</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold break-all">{contentAnalytics?.done_events?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Successfully completed events
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts and Data */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="w-full">
          {/* Mobile View - Dropdown */}
          <div className="min-[1100px]:hidden w-full mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="pages">Page Analytics</SelectItem>
                <SelectItem value="content">Content Analytics</SelectItem>
                <SelectItem value="recent">Recent Activity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop View - Tabs */}
          <div className="hidden min-[1100px]:block overflow-x-auto -mx-2 px-2">
            <TabsList className="w-full md:w-auto inline-flex">
              <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="pages" className="text-xs md:text-sm">Page Analytics</TabsTrigger>
              <TabsTrigger value="content" className="text-xs md:text-sm">Content Analytics</TabsTrigger>
              <TabsTrigger value="recent" className="text-xs md:text-sm">Recent Activity</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Daily Visits (Last 30 Days)</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Track your website traffic over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 overflow-hidden">
                <div className="w-full">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={formatChartData(dailyVisits || [])} margin={{ left: -20, right: 10, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 9 }}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                        interval="preserveStartEnd"
                      />
                      <YAxis tick={{ fontSize: 9 }} width={40} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '10px' }} iconSize={8} />
                      <Line
                        type="monotone"
                        dataKey="total_visits"
                        stroke="#8884d8"
                        strokeWidth={2}
                        name="Total Visits"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="unique_visitors"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        name="Unique Visitors"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Page Distribution</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Most visited pages on your website
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 overflow-hidden">
                <div className="w-full">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        wrapperStyle={{ fontSize: '10px' }}
                        iconSize={8}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pages">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Page Performance (Last 30 Days)</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Detailed breakdown of visits per page
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pagePopularity?.slice(0, 8) || []} margin={{ left: -20, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="page_path"
                      tick={{ fontSize: 9 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      tickFormatter={formatPagePath}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 9 }} width={40} />
                    <Tooltip
                      labelFormatter={(label) => formatPagePath(label)}
                      formatter={(value: number, name: string) => [
                        value.toLocaleString(),
                        name === 'total_visits' ? 'Total Visits' : 'Unique Visitors'
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} iconSize={8} />
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
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Top Pages Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pagePopularity?.slice(0, 10).map((page, index) => (
                  <div key={page.page_path} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 md:p-3 rounded border gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Badge variant="outline" className="w-6 h-6 md:w-8 md:h-6 flex items-center justify-center shrink-0 text-xs">
                        {index + 1}
                      </Badge>
                      <span className="font-medium text-sm md:text-base truncate">{formatPagePath(page.page_path)}</span>
                      <span className="text-xs md:text-sm text-muted-foreground truncate hidden md:inline">({page.page_path})</span>
                    </div>
                    <div className="flex gap-3 md:gap-4 text-xs md:text-sm ml-8 sm:ml-0 shrink-0">
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
                <CardTitle className="text-base md:text-lg">Content Overview</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Summary of your church's content
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between p-3 md:p-4 rounded border bg-muted/20">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-sm md:text-base">Ministries</div>
                        <div className="text-xs md:text-sm text-muted-foreground">
                          Active church ministries
                        </div>
                      </div>
                    </div>
                    <div className="text-xl md:text-2xl font-bold shrink-0">
                      {contentAnalytics?.total_ministries || 0}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 md:p-4 rounded border bg-muted/20">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-sm md:text-base">Total Events</div>
                        <div className="text-xs md:text-sm text-muted-foreground">
                          All events created
                        </div>
                      </div>
                    </div>
                    <div className="text-xl md:text-2xl font-bold shrink-0">
                      {contentAnalytics?.total_events || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Event Status Breakdown</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Current status of all events
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between p-3 md:p-4 rounded border bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <CalendarDays className="h-4 w-4 md:h-5 md:w-5 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-blue-800 text-sm md:text-base">Scheduled Events</div>
                        <div className="text-xs md:text-sm text-blue-600">
                          Ready to happen as planned
                        </div>
                      </div>
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-blue-800 shrink-0">
                      {contentAnalytics?.scheduled_events || 0}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 md:p-4 rounded border bg-yellow-50 border-yellow-200">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <CalendarX className="h-4 w-4 md:h-5 md:w-5 text-yellow-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-yellow-800 text-sm md:text-base">Postponed Events</div>
                        <div className="text-xs md:text-sm text-yellow-600">
                          Events that have been delayed
                        </div>
                      </div>
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-yellow-800 shrink-0">
                      {contentAnalytics?.postponed_events || 0}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 md:p-4 rounded border bg-green-50 border-green-200">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-green-800 text-sm md:text-base">Completed Events</div>
                        <div className="text-xs md:text-sm text-green-600">
                          Successfully finished events
                        </div>
                      </div>
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-green-800 shrink-0">
                      {contentAnalytics?.done_events || 0}
                    </div>
                  </div>

                  {contentAnalytics?.total_events && contentAnalytics.total_events > 0 && (
                    <div className="mt-3 md:mt-4 p-2 md:p-3 rounded bg-gray-50 border border-gray-200">
                      <div className="text-xs md:text-sm text-gray-800 space-y-1">
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
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Clock className="h-4 w-4" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Live feed of recent website visits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentVisits?.map((visit) => (
                  <div key={visit.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 md:p-3 rounded border bg-muted/20 gap-2">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                      <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm md:text-base truncate">{formatPagePath(visit.page_path)}</div>
                        <div className="text-xs md:text-sm text-muted-foreground">
                          {format(new Date(visit.visited_at), 'MMM dd, yyyy HH:mm:ss')}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground ml-6 sm:ml-0 shrink-0">
                      {visit.referrer ? (
                        <span className="truncate block max-w-[200px]">from {new URL(visit.referrer).hostname}</span>
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