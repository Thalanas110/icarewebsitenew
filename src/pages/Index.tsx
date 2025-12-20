import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card'; 
import { useChurchInfo } from '@/hooks/useChurchData';
import { Link } from 'react-router-dom';
import { Heart, Users, MapPin, Clock, Building2, Handshake } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const { data: churchInfo } = useChurchInfo();

  return (
    <Layout>
      <Helmet>
        <title>I Care Center - The Refuge Church | Olongapo City</title>
        <meta name="description" content="Welcome to I Care Center - The Refuge Church. A place of acceptance, love, and community in Olongapo City. Miracles happen when someone cares." />
        <meta name="keywords" content="i care center, refuge church, olongapo church, christian church, miracles, pastor" />
        <link rel="canonical" href="https://icarecenter.netlify.app/" />
      </Helmet>
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-church-navy via-church-navy/95 to-church-gold/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 animate-fade-in">
            Welcome to<br />
            <span className="text-church-gold">I Care Center - the Refuge Church</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            Miracles happen when someone cares
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-church-orange hover:bg-church-orange/90 text-church-navy font-semibold">
              <Link to="/services">Join Us This Sunday</Link>
            </Button>
            <Button asChild size="lg" className="bg-church-teal hover:bg-church-teal/90 text-white font-semibold">
              <a href="https://www.facebook.com/icarefellowship" target="_blank" rel="noopener noreferrer">Join Online</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-black hover:bg-white/10 hover:text-white">
              <Link to="/about">Learn More</Link>
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
                I Care Center welcomes all individuals seeking God’s love, and keep our doors open to every soul seeking to welcome Jesus into their hearts. We invite you to open your heart and allow His grace to penetrate into your soul.
                Our church stands as a beacon of hope in Olongapo City. We are a place of acceptance, peace and joy to all who are moved to join us. Our church family is richly diverse, with people of different ages and backgrounds coming together to worship and serve together. Get in touch to find out more or join us for a service.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <Heart className="w-8 h-8 text-church-gold mx-auto mb-2" />
                  <p className="text-sm font-medium">Connect to Christ</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-church-gold mx-auto mb-2" />
                  <p className="text-sm font-medium">Affiliate to Cell</p>
                </div>
                <div className="text-center">
                  <Building2 className="w-8 h-8 text-church-gold mx-auto mb-2" />
                  <p className="text-sm font-medium">Raise to Church</p>
                </div>
                <div className="text-center">
                  <Handshake className="w-8 h-8 text-church-gold mx-auto mb-2" />
                  <p className="text-sm font-medium">Engage to Community</p>
                </div>
              </div>
              <Button asChild className="bg-church-navy hover:bg-church-navy/90">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src="/during worship 2.jpeg"
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
              <p className="text-white">— Matthew 11:28</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
