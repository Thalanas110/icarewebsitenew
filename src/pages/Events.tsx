import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useEvents } from '@/hooks/useChurchData';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function Events() {
  const { data: events, isLoading } = useEvents();

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Upcoming <span className="text-gradient">Events</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay connected with what's happening in our church community. Join us for special services, 
            fellowship events, and opportunities to grow together.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading events...</div>
          ) : events && events.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {events.map((event) => (
                <Card key={event.id} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Date Box */}
                      <div className="flex-shrink-0 w-20 h-20 bg-primary text-primary-foreground rounded-lg flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">
                          {format(new Date(event.event_date), 'd')}
                        </span>
                        <span className="text-sm uppercase">
                          {format(new Date(event.event_date), 'MMM')}
                        </span>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 space-y-3">
                        <h3 className="text-xl font-display font-bold">{event.title}</h3>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}
                          </div>
                          {event.event_time && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.event_time}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-muted-foreground">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No upcoming events at this time. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates about upcoming events, special services, 
            and church news.
          </p>
        </div>
      </section>
    </Layout>
  );
}
