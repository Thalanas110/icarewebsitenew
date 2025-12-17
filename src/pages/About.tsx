import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useChurchInfo } from '@/hooks/useChurchData';
import { Heart, Users, Music, Megaphone, Target, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function About() {
  const { data: churchInfo } = useChurchInfo();

  return (
    <Layout>
      <Helmet>
        <title>About Us - I Care Center | The Refuge Church</title>
        <meta name="description" content="Learn about I Care Center - The Refuge Church in Olongapo City. Our mission is to share the Gospel, teach Biblical Truth, and provide a refuge for the lost." />
      </Helmet>
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
                src="/during worship.jpg"
                alt="Our church community"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-display font-bold">Our Story</h2>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="text-muted-foreground">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
                  The Refuge Church is determined  to Share the Gospel, teach Biblical Truth, and encourage disciples to grow in Godly obedience until the return of our Lord Jesus Christ.
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
                  The Refuge Church is a unified Church body committed to be a reflection of God's love as a Refuge for the lost to come and be Cared for, Lifted up, and Encouraged to Grow in personal relationship with the Lord Jesus Christ for the Glory of God.
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
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Megaphone,
                title: 'Evangelism',
                desc: ""
              },
              {
                icon: Users,
                title: 'Christ Centered Discipleship',
                desc: ""
              },
              {
                icon: Music,
                title: 'Spiirit filled Worship',
                desc: ""
              },
              {
                icon: Heart,
                title: 'Godly Love & Care',
                desc: ""
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
