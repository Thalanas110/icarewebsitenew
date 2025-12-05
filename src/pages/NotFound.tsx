import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      {/* 404 Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-church-navy via-church-navy/95 to-church-gold/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-9xl md:text-[120px] font-display font-bold text-church-gold mb-4 drop-shadow-lg">
              404
            </h1>
            <p className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Page Not Found
            </p>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
              Sorry, the page you're looking for doesn't exist. Let's get you back on track.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-church-gold hover:bg-church-gold/90 text-church-navy font-semibold">
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-black hover:bg-white/10 hover:text-white">
              <Link to="/about">Learn About Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
