import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useServiceTimes, useEvents, useChurchInfo } from '@/hooks/useChurchData';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Heart, Users, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const Index = () => {
  const { data: serviceTimes } = useServiceTimes();
  const { data: events } = useEvents();
  const { data: churchInfo } = useChurchInfo();

  const upcomingEvents = events?.slice(0, 3) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-church-navy via-church-navy/95 to-church-gold/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 animate-fade-in">
            Welcome to<br />
            <span className="text-church-gold">I Care Center</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            Miracles happen when someone cares
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-church-orange hover:bg-church-orange/90 text-church-navy font-semibold">
              <Link to="/services">Join Us This Sunday</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-black hover:bg-white/10 hover:text-white">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Times Section */}
      <section id="services" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">Service Times</h2>
            <p className="text-muted-foreground text-lg">Join us for worship and fellowship</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {serviceTimes?.map((service) => (
              <Card key={service.id} className="text-center border-church-gold/20 hover:border-church-gold/50 transition-colors">
                <CardContent className="pt-8 pb-6">
                  <Clock className="w-12 h-12 text-church-gold mx-auto mb-4" />
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">{service.name}</h3>
                  <p className="text-2xl font-semibold text-church-gold mb-2">{service.time}</p>
                  {service.description && (
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-church-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-foreground mb-6">About Our Church</h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <Heart className="w-8 h-8 text-church-gold mx-auto mb-2" />
                  <p className="text-sm font-medium">Love</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-church-gold mx-auto mb-2" />
                  <p className="text-sm font-medium">Community</p>
                </div>
                <div className="text-center">
                  <BookOpen className="w-8 h-8 text-church-gold mx-auto mb-2" />
                  <p className="text-sm font-medium">Faith</p>
                </div>
              </div>
              <Button asChild className="bg-church-navy hover:bg-church-navy/90">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="relative">
              <img 
                src="/bg.jpeg" 
                alt="Church community" 
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-church-gold text-church-navy p-6 rounded-lg shadow-xl">
                <p className="text-3xl font-bold">{churchInfo?.pastor_name || 'Pastor'}</p>
                <p className="text-sm">Senior Pastor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground text-lg">Don't miss what's happening at I Care</p>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {event.image_url && (
                    <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-church-gold mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {format(new Date(event.event_date), 'MMMM d, yyyy')}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground mb-2">{event.title}</h3>
                    {event.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1 text-muted-foreground text-sm mt-3">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No upcoming events at this time.</p>
          )}
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-20 bg-church-cream text-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Visit Us</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-church-gold flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-black/70">
                      {churchInfo?.address || '123 Faith Street'}<br />
                      {churchInfo?.city || 'City'}, {churchInfo?.state || 'State'} {churchInfo?.zip || '12345'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-church-gold flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Office Hours</p>
                    <p className="text-black/70">{churchInfo?.office_hours || 'Mon-Fri: 9AM - 5PM'}</p>
                  </div>
                </div>
              </div>
              <Button asChild className="mt-8 bg-church-gold hover:bg-church-gold/90 text-church-navy">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
            <div className="bg-church-navy rounded-lg p-8 text-center">
              <p className="text-2xl font-display italic text-church-gold mb-4">
                "Come to me, all you who are weary and burdened, and I will give you rest."
              </p>
              <p className="text-black/60">— Matthew 11:28</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
