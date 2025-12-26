import { format } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useEvents } from "@/hooks/useChurchData";

export default function Events() {
  const { data: events, isLoading } = useEvents();

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-20" id="hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 font-bold font-display text-4xl md:text-5xl">
            Upcoming <span className="text-gradient">Events</span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Stay connected with what's happening in our church community. Join
            us for special services, fellowship events, and opportunities to
            grow together.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="section-padding" id="events-list">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground">
              Loading events...
            </div>
          ) : events && events.length > 0 ? (
            <div className="mx-auto max-w-4xl space-y-6">
              {events.map((event) => (
                <Card
                  className="border-none shadow-lg transition-shadow hover:shadow-xl"
                  key={event.id}
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start">
                      {/* Date Box */}
                      <div className="flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <span className="font-bold text-2xl">
                          {format(new Date(event.event_date), "d")}
                        </span>
                        <span className="text-sm uppercase">
                          {format(new Date(event.event_date), "MMM")}
                        </span>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 space-y-3">
                        <h3 className="font-bold font-display text-xl">
                          {event.title}
                        </h3>

                        <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(
                              new Date(event.event_date),
                              "EEEE, MMMM d, yyyy"
                            )}
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
                          <p className="text-muted-foreground">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Calendar className="mx-auto mb-4 h-16 w-16 opacity-50" />
              <p>No upcoming events at this time. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-secondary/30" id="newsletter">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-bold font-display text-3xl">Stay Updated</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Subscribe to our newsletter to receive updates about upcoming
            events, special services, and church news.
          </p>
        </div>
      </section>
    </Layout>
  );
}
