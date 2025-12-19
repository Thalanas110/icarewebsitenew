import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {
    useAnalyticsSummary,
    useDailyVisits,
    useRecentVisits,
    useContentAnalytics
} from '@/hooks/useAnalytics';
import { Eye, TrendingUp, Clock, ExternalLink, Calendar, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

export function ModeratorAnalytics() {
    // Fetching slightly less data potentially, but reusing hooks is fine
    const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary(30);
    const { data: dailyVisits, isLoading: dailyLoading } = useDailyVisits(30);
    const { data: recentVisits, isLoading: recentLoading } = useRecentVisits(10); // Reduced from 20
    const { data: contentAnalytics, isLoading: contentLoading } = useContentAnalytics();

    if (summaryLoading || dailyLoading || recentLoading || contentLoading) {
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
            '/moderator': 'Moderator Dashboard',
        };
        return pageMappings[path] || path;
    };

    const formatChartData = (data: any[]) => {
        return data?.map(item => ({
            ...item,
            date: format(new Date(item.date), 'MMM dd'),
        })) || [];
    };

    return (
        <div className="space-y-6 pb-6 max-w-full overflow-x-hidden">
            <div>
                <h2 className="text-xl md:text-2xl font-display font-bold break-words">Moderator Analytics</h2>
                <p className="text-sm md:text-base text-muted-foreground">
                    Quick overview of website and content performance
                </p>
            </div>

            {/* Simplified Summary Cards - Mixed General & Content */}
            <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
                {/* General Stat 1 */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium">Total Visits</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg md:text-2xl font-bold break-all">{summary?.total_visits?.toLocaleString() || '0'}</div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            All time visits
                        </p>
                    </CardContent>
                </Card>

                {/* General Stat 2 */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium">Daily Avg</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg md:text-2xl font-bold break-all">{Math.round(Number(summary?.avg_daily_visits) || 0)}</div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            Visits/day (30d)
                        </p>
                    </CardContent>
                </Card>

                {/* Content Stat 1 */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium">Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg md:text-2xl font-bold break-all">{contentAnalytics?.total_events?.toLocaleString() || '0'}</div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            Total events created
                        </p>
                    </CardContent>
                </Card>

                {/* Content Stat 2 */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium">Ministries</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg md:text-2xl font-bold break-all">{contentAnalytics?.total_ministries?.toLocaleString() || '0'}</div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            Active ministries
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Main Chart - Daily Visits Only */}
                <Card className="overflow-hidden md:col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-base md:text-lg">Daily Visits (30 Days)</CardTitle>
                        <CardDescription className="text-xs md:text-sm">
                            Traffic trend over the last month
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
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity - Simplified */}
                <Card className="md:col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                            <Clock className="h-4 w-4" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription className="text-xs md:text-sm">
                            Latest visits
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-[250px] overflow-y-auto">
                            {recentVisits?.map((visit) => (
                                <div key={visit.id} className="flex items-center justify-between p-2 rounded border bg-muted/20 gap-2">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <div className="font-medium text-xs md:text-sm truncate">{formatPagePath(visit.page_path)}</div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] md:text-xs text-muted-foreground shrink-0">
                                        {format(new Date(visit.visited_at), 'MMM dd, HH:mm')}
                                    </div>
                                </div>
                            ))}
                            {(!recentVisits || recentVisits.length === 0) && (
                                <div className="text-center py-4 text-muted-foreground text-xs">
                                    No recent activity
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
