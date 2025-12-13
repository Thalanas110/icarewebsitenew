import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      {/* 404 Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-church-navy via-church-navy/95 to-church-gold/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=1920')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-9xl md:text-[120px] font-display font-bold text-church-gold mb-4 drop-shadow-lg">
              404
            </h1>
            <p className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              This Page Has Gone Astray
            </p>
            <p className="text-xl md:text-2xl text-white/80 mb-6 max-w-2xl mx-auto italic">
              "What man of you, having a hundred sheep, if he has lost one of them, does not leave the ninety-nine in the open country, and go after the one that is lost, until he finds it?"
            </p>
            <p className="text-lg text-church-gold mb-8 font-serif">
              - Luke 15:4
            </p>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Like a lost sheep, the page you are looking for has wandered off. Let us guide you back to the safety of the fold.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-church-gold hover:bg-church-gold/90 text-church-navy font-semibold">
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Return to the Fold
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-black hover:bg-white/10 hover:text-white">
              <Link to="/about">Join the Flock</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
