import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
// import { Card, CardContent } from '@/components/ui/card';
import { useChurchInfo } from "@/hooks/useChurchData";
import { CareGrid } from "@/components/CareGrid";

const Index = () => {
  const { data: churchInfo } = useChurchInfo();

  return (
    <Layout hideNavbarUntilSection="about">
      <Helmet>
        <title>I Care Center - The Refuge Church | Olongapo City</title>
        <meta
          content="Welcome to I Care Center - The Refuge Church. A place of acceptance, love, and community in Olongapo City. Miracles happen when someone cares."
          name="description"
        />
        <meta
          content="i care center, refuge church, olongapo church, christian church, miracles, pastor"
          name="keywords"
        />
        <link href="https://icarecenter.netlify.app/" rel="canonical" />
      </Helmet>
      {/* Hero Section */}
      <section
        className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-church-navy via-church-navy/95 to-church-gold/20"
        id="hero"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920')] bg-center bg-cover opacity-40" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="mb-6 animate-fade-in font-bold font-display text-5xl text-white md:text-7xl">
            Welcome to
            <br />
            <span className="text-church-gold">
              I Care Center - the Refuge Church
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-white/80 text-xl md:text-2xl">
            Miracles happen when someone cares
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="bg-church-orange font-semibold text-church-navy hover:bg-church-orange/90"
              size="lg"
            >
              <Link to="/services">Join Us This Sunday</Link>
            </Button>
            <Button
              asChild
              className="bg-church-teal font-semibold text-white hover:bg-church-teal/90"
              size="lg"
            >
              <a
                href="https://www.facebook.com/icarefellowship"
                rel="noopener noreferrer"
                target="_blank"
              >
                Join Online
              </a>
            </Button>
            <Button
              asChild
              className="border-white text-black hover:bg-white/10 hover:text-white"
              size="lg"
              variant="outline"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-church-cream py-20" id="about">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-bold font-display text-4xl text-foreground">
                About Our Church
              </h2>
              <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
                I Care Center welcomes all individuals seeking God’s love, and
                keep our doors open to every soul seeking to welcome Jesus into
                their hearts. We invite you to open your heart and allow His
                grace to penetrate into your soul. Our church stands as a beacon
                of hope in Olongapo City. We are a place of acceptance, peace
                and joy to all who are moved to join us. Our church family is
                richly diverse, with people of different ages and backgrounds
                coming together to worship and serve together. Get in touch to
                find out more or join us for a service.
              </p>
              <Button
                asChild
                className="bg-church-navy hover:bg-church-navy/90"
              >
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="relative">
              <img
                alt="Church community"
                className="rounded-lg shadow-2xl"
                src="/during worship 2.jpeg"
              />
              <div className="absolute -bottom-6 -left-6 rounded-lg bg-church-gold p-6 text-church-navy shadow-xl">
                <p className="font-bold text-3xl">
                  {churchInfo?.pastor_name || "Pastor"}
                </p>
                <p className="text-sm">Senior Pastor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="bg-church-cream py-20 text-black" id="location">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-bold font-display text-4xl">Our C.A.R.E. Pathway</h2>
              <CareGrid />
              <Button
                asChild
                className="mt-8 bg-church-gold text-church-navy hover:bg-church-gold/90"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
            <div className="rounded-lg p-8 text-center">
              <p className="mb-4 font-display text-2xl text-church-gold italic">
                "Come to me, all you who are weary and burdened, and I will give
                you rest."
              </p>
              <p className="text-church-navy">— Matthew 11:28</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
