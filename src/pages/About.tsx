import { BookOpen, Target } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { CORE_VALUES } from "@/constant/core-values";
import { useChurchInfo } from "@/hooks/useChurchData";

export default function About() {
  const { data: churchInfo } = useChurchInfo();

  return (
    <Layout>
      <Helmet>
        <title>About Us - I Care Center | The Refuge Church</title>
        <meta
          content="Learn about I Care Center - The Refuge Church in Olongapo City. Our mission is to share the Gospel, teach Biblical Truth, and provide a refuge for the lost."
          name="description"
        />
      </Helmet>
      {/* Hero */}
      <section className="hero-gradient py-20" id="hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 font-bold font-display text-4xl md:text-5xl">
            About <span className="text-gradient">Our Church</span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            For over 40+ years, I Care Center - Refuge has been a beacon of hope
            in our community.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding" id="story">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <img
                alt="Our church community"
                className="rounded-lg shadow-xl"
                src="/during worship.jpg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-bold font-display text-3xl">Our Story</h2>
              <p className="text-muted-foreground">
                We’re currently working on this page to better share the journey
                God has been leading our church through.
              </p>
              <p className="text-muted-foreground">
                Please check back soon to learn more about our beginnings, our
                mission, and the people who call this church home.
              </p>
              <p className="text-muted-foreground">
                We look forward to sharing our story with you soon. Until then,
                you are always welcome here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-secondary/30" id="mission">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-none shadow-lg">
              <CardContent className="space-y-4 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold font-display text-2xl">Our Mission</h3>
                <p className="text-muted-foreground">
                  The Refuge Church is determined to Share the Gospel, teach
                  Biblical Truth, and encourage disciples to grow in Godly
                  obedience until the return of our Lord Jesus Christ.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="space-y-4 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold font-display text-2xl">Our Vision</h3>
                <p className="text-muted-foreground">
                  The Refuge Church is a unified Church body committed to be a
                  reflection of God's love as a Refuge for the lost to come and
                  be Cared for, Lifted up, and Encouraged to Grow in personal
                  relationship with the Lord Jesus Christ for the Glory of God.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding" id="values">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold font-display text-3xl md:text-4xl">
              Our Core Values
            </h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {CORE_VALUES.map((value, i) => (
              <Card className="border-none shadow-lg" key={i}>
                <CardContent className="space-y-4 p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-xl">{value.title}</h4>
                  <p className="text-muted-foreground">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pastor */}
      {churchInfo?.pastor_name && (
        <section className="section-padding bg-secondary/30" id="pastor">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h2 className="font-bold font-display text-3xl">
                Meet Our Pastor
              </h2>
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
                <span className="font-bold font-display text-4xl text-primary">
                  {churchInfo.pastor_name.charAt(0)}
                </span>
              </div>
              <h3 className="font-semibold text-2xl">
                {churchInfo.pastor_name}
              </h3>
              <p className="text-muted-foreground">
                Our senior pastor leads with compassion and dedication, guiding
                our congregation in spiritual growth and community service.
              </p>
              {churchInfo.pastor_email && (
                <p className="text-muted-foreground text-sm">
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
