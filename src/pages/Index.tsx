import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CareGrid } from "@/components/CareGrid";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
// import { Card, CardContent } from '@/components/ui/card';
import { useChurchInfo } from "@/hooks/useChurchData";

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
          <h1 className="mb-6 animate-fade-in font-bold font-display text-5xl text-white md:text-8xl">
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
            {/* Solid → Ghost on hover - Orange variant */}
            <Button
              asChild
              className="border-2 border-church-orange bg-church-orange font-semibold text-church-navy transition-all duration-300 hover:bg-transparent hover:text-church-orange active:bg-transparent active:text-church-orange"
              size="lg"
            >
              <Link to="/services">Join Us This Sunday</Link>
            </Button>
            {/* Solid → Ghost on hover - Teal variant */}
            <Button
              asChild
              className="border-2 border-church-teal bg-church-teal font-semibold text-white transition-all duration-300 hover:bg-transparent hover:text-church-teal active:bg-transparent active:text-church-teal"
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
            {/* Solid → Ghost on hover - White variant */}
            <Button
              asChild
              className="border-2 border-white bg-white font-semibold text-church-navy transition-all duration-300 hover:bg-transparent hover:text-white active:bg-transparent active:text-white"
              size="lg"
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
              <h2 className="mb-6 font-bold font-display text-4xl text-foreground md:text-[2.4rem]">
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

      {/* C.A.R.E. Pathway Section */}
      <section
        className="bg-gradient-to-b from-church-cream to-white py-24"
        id="care"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-church-gold/10 px-4 py-2 font-semibold text-church-gold text-sm">
              Your Journey With Us
            </span>
            <h2 className="mb-4 font-bold font-display text-4xl text-church-navy md:text-5xl">
              Our C.A.R.E. Pathway
            </h2>
            <p className="text-lg text-muted-foreground">
              A simple path to help you grow spiritually and find your place in
              our church family.
            </p>
          </div>

          {/* C.A.R.E. Grid */}
          <CareGrid />

          {/* Bible Verse Card */}
          <div className="mx-auto mt-16 max-w-2xl rounded-2xl bg-white p-8 text-center shadow-2xl md:p-12">
            <p className="mb-4 font-display text-church-navy text-xl italic md:text-2xl">
              "Come to me, all you who are weary and burdened, and I will give
              you rest."
            </p>
            <p className="font-semibold text-church-gold">— Matthew 11:28</p>
          </div>

          {/* CTA Button */}
          <div className="mt-12 text-center">
            <Button
              asChild
              className="bg-church-gold font-semibold text-church-navy shadow-lg hover:bg-church-gold/90"
              size="lg"
            >
              <Link to="/contact">Start Your Journey Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
