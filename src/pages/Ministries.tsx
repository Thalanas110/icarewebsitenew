import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useMinistries } from '@/hooks/useChurchData';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Ministries() {
  const { data: ministries, isLoading } = useMinistries();

  const churchMinistries = ministries?.filter(m => m.category === 'ministry' || !m.category) || [];
  const outreaches = ministries?.filter(m => m.category === 'outreach') || [];

  return (
    <Layout>
      {/* Hero */}
      <section id="hero" className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Our <span className="text-gradient">Ministries</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the many ways you can connect, serve, and grow in your faith journey with us.
          </p>
        </div>
      </section>

      {/* Ministries List */}
      <section id="ministries-list" className="section-padding">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading ministries...</div>
          ) : ministries && ministries.length > 0 ? (
            <div className="space-y-16">
              {/* Church Ministries Section */}
              <div className="space-y-6" id="church-ministries">
                <h2 className="text-3xl font-display font-bold text-center md:text-left">Church Ministries</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {churchMinistries.map((ministry) => (
                    <Card key={ministry.id} id={ministry.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
                      {ministry.image_url ? (
                        <img
                          src={ministry.image_url}
                          alt={ministry.name}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-secondary flex items-center justify-center">
                          <Users className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <CardContent className="p-6 space-y-4 flex-1">
                        <h3 className="text-xl font-display font-bold">{ministry.name}</h3>
                        {ministry.description && (
                          <p className="text-muted-foreground">{ministry.description}</p>
                        )}
                        {ministry.leader && (
                          <p className="text-sm">
                            <strong>Leader:</strong> {ministry.leader}
                          </p>
                        )}
                        {ministry.meeting_time && (
                          <p className="text-sm">
                            <strong>Meets:</strong> {ministry.meeting_time}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {churchMinistries.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground">No ministries found.</div>
                  )}
                </div>
              </div>

              {/* Outreaches Section */}
              <div className="space-y-6" id="outreaches">
                <h2 className="text-3xl font-display font-bold text-center md:text-left">Outreaches</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {outreaches.map((ministry) => (
                    <Card key={ministry.id} id={ministry.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
                      {ministry.image_url ? (
                        <img
                          src={ministry.image_url}
                          alt={ministry.name}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-secondary flex items-center justify-center">
                          <Users className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <CardContent className="p-6 space-y-4 flex-1">
                        <h3 className="text-xl font-display font-bold">{ministry.name}</h3>
                        {ministry.description && (
                          <p className="text-muted-foreground">{ministry.description}</p>
                        )}
                        {ministry.leader && (
                          <p className="text-sm">
                            <strong>Leader:</strong> {ministry.leader}
                          </p>
                        )}
                        {ministry.meeting_time && (
                          <p className="text-sm">
                            <strong>Meets:</strong> {ministry.meeting_time}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {outreaches.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground">No outreaches found.</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No ministries listed yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Get Involved</h2>
          <p className="max-w-2xl mx-auto mb-8 opacity-90">
            Interested in joining a ministry or starting a new one? We'd love to hear from you
            and help you find your place to serve.
          </p>
          <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link to="/contact#hero">Contact Us</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
