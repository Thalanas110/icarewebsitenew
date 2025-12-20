import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useServiceTimes, useChurchInfo } from '@/hooks/useChurchData';
import { Clock, Users, MapPin, Car, Accessibility, Baby } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Services() {
  const { data: serviceTimes, isLoading } = useServiceTimes();
  const { data: churchInfo } = useChurchInfo();

  return (
    <Layout>
      <Helmet>
        <title>Service Times - I Care Center | The Refuge Church</title>
        <meta name="description" content="Join us for worship at I Care Center. View our service times, what to expect, and how to find us in Olongapo City." />
      </Helmet>
      {/* Hero */}
      <section id="hero" className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="text-gradient">Service</span> Times
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We offer multiple opportunities throughout the week to worship, learn, and grow together in community.
          </p>
        </div>
      </section>

      {/* Service Times */}
      <section id="service-times" className="section-padding">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading services...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {serviceTimes?.map((service) => (
                <Card key={service.id} className="border-none shadow-lg hover:shadow-xl transition-shadow w-full">
                  <CardContent className="p-5 md:p-8 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      {service.audience && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground text-right ml-2">
                          <Users className="h-4 w-4 shrink-0" />
                          {service.audience}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-bold">{service.name}</h3>
                    <p className="text-2xl md:text-3xl font-bold text-primary">{service.time}</p>
                    {service.description && (
                      <p className="text-muted-foreground">{service.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* What to Expect */}
      <section id="expect" className="section-padding">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-8">What to Expect</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Warm Welcome</h4>
                  <p className="text-muted-foreground">
                    Our greeters are ready to welcome you and help you find your way around.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Uplifting Worship</h4>
                  <p className="text-muted-foreground">
                    Experience heartfelt worship with contemporary and traditional music.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Biblical Teaching</h4>
                  <p className="text-muted-foreground">
                    Relevant messages from Scripture that speak to everyday life.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Fellowship Time</h4>
                  <p className="text-muted-foreground">
                    Connect with others over refreshments after the service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Location */}
      <section id="location" className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-display font-bold">Visit Us</h2>
              {churchInfo?.address && (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <span className="text-xl font-medium">
                    {churchInfo.address}, {churchInfo.city}, {churchInfo.state} {churchInfo.zip}
                  </span>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-none shadow-md hover:shadow-lg transition-all text-center group">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-church-gold/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Car className="h-6 w-6 text-church-gold-dark" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Free Parking</h4>
                    <p className="text-muted-foreground text-sm">
                      Ample parking space available for all our visitors right at the venue.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-all text-center group">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-church-gold/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Accessibility className="h-6 w-6 text-church-gold-dark" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Accessibility</h4>
                    <p className="text-muted-foreground text-sm">
                      Our facilities are fully wheelchair accessible with designated seating.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-all text-center group">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-church-gold/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Baby className="h-6 w-6 text-church-gold-dark" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Kids Ministry</h4>
                    <p className="text-muted-foreground text-sm">
                      Safe, fun, and engaging spaces for children of all ages during service.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
// Force rebuild
