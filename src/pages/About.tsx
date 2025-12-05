import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useChurchInfo } from '@/hooks/useChurchData';
import { Heart, Users, BookOpen, Target } from 'lucide-react';

export default function About() {
  const { data: churchInfo } = useChurchInfo();

  return (
    <Layout>
      {/* Hero */}
      <section id="hero" className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            About <span className="text-gradient">Our Church</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            For over 40+ years, I Care Center - Refuge has been a beacon of hope in our community.
          </p>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800" 
                alt="Our church community"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-display font-bold">Our Story</h2>
              <p className="text-muted-foreground">
                I Care Center - Refuge was founded with a simple mission: to be a place where everyone 
                can experience God's unconditional love and find their purpose in Christ.
              </p>
              <p className="text-muted-foreground">
                What started as a small gathering has grown into a vibrant community of believers 
                committed to making a difference in our city and beyond. Through the years, we've 
                remained dedicated to our founding principles of love, faith, and service.
              </p>
              <p className="text-muted-foreground">
                Today, we continue to reach out to our community through various ministries, 
                outreach programs, and worship services that bring people together in fellowship 
                and spiritual growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold">Our Mission</h3>
                <p className="text-muted-foreground">
                  We exist to help people find and follow Jesus Christ. Our mission is to create a safe haven 
                  where individuals and families can discover God's purpose for their lives, grow in their faith, 
                  and make a positive impact in our community.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold">Our Vision</h3>
                <p className="text-muted-foreground">
                  Through compassionate care, biblical teaching, and authentic fellowship, we strive to be a 
                  refuge for all who are seeking hope, healing, and purpose. We envision a community transformed 
                  by God's love, reaching out to share that love with the world.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Heart, 
                title: 'Love', 
                desc: "We believe in showing Christ's love through our actions, welcoming all with open hearts and open arms. Love is at the center of everything we do." 
              },
              { 
                icon: Users, 
                title: 'Community', 
                desc: "Building authentic relationships and supporting one another through life's joys and challenges. We are stronger together." 
              },
              { 
                icon: BookOpen, 
                title: 'Growth', 
                desc: 'Encouraging spiritual maturity through Bible study, prayer, and service to others. We never stop learning and growing in our faith.' 
              },
            ].map((value, i) => (
              <Card key={i} className="border-none shadow-lg">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold">{value.title}</h4>
                  <p className="text-muted-foreground">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pastor */}
      {churchInfo?.pastor_name && (
        <section id="pastor" className="section-padding bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-display font-bold">Meet Our Pastor</h2>
              <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-4xl font-display font-bold text-primary">
                  {churchInfo.pastor_name.charAt(0)}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{churchInfo.pastor_name}</h3>
              <p className="text-muted-foreground">
                Our senior pastor leads with compassion and dedication, guiding our congregation 
                in spiritual growth and community service.
              </p>
              {churchInfo.pastor_email && (
                <p className="text-sm text-muted-foreground">
                  Contact: {churchInfo.pastor_email}
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
