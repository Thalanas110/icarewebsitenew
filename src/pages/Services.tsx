import { Accessibility, Baby, Clock, MapPin, Users } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useChurchInfo, useServiceTimes } from "@/hooks/useChurchData";

export default function Services() {
  const { data: serviceTimes, isLoading } = useServiceTimes();
  const { data: churchInfo } = useChurchInfo();

  return (
    <Layout>
      <Helmet>
        <title>Service Times - I Care Center | The Refuge Church</title>
        <meta
          content="Join us for worship at I Care Center. View our service times, what to expect, and how to find us in Olongapo City."
          name="description"
        />
      </Helmet>
      {/* Hero */}
      <section className="hero-gradient py-20" id="hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 font-bold font-display text-4xl md:text-[3.15rem]">
            <span className="text-gradient">Service</span> Times
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We offer multiple opportunities throughout the week to worship,
            learn, and grow together in community.
          </p>
        </div>
      </section>

      {/* Service Times */}
      <section className="section-padding" id="service-times">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground">
              Loading services...
            </div>
          ) : (
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
              {serviceTimes?.map((service) => (
                <Card
                  className="w-full border-none shadow-lg transition-shadow hover:shadow-xl"
                  key={service.id}
                >
                  <CardContent className="space-y-4 p-5 md:p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      {service.audience && (
                        <div className="ml-2 flex items-center gap-1 text-right text-muted-foreground text-sm">
                          <Users className="h-4 w-4 shrink-0" />
                          {service.audience}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold font-sans text-xl md:text-2xl">
                      {service.name}
                    </h3>
                    <p className="font-bold text-2xl text-primary md:text-3xl">
                      {service.time}
                    </p>
                    {service.description && (
                      <p className="text-muted-foreground">
                        {service.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* What to Expect */}
      <section className="section-padding" id="expect">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center font-bold font-display text-3xl">
              What to Expect
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  1
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Warm Welcome</h4>
                  <p className="text-muted-foreground">
                    Our greeters are ready to welcome you and help you find your
                    way around.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  2
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Uplifting Worship</h4>
                  <p className="text-muted-foreground">
                    Experience heartfelt worship with contemporary and
                    traditional music.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  3
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Biblical Teaching</h4>
                  <p className="text-muted-foreground">
                    Relevant messages from Scripture that speak to everyday
                    life.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  4
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Fellowship Time</h4>
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
      <section className="section-padding bg-secondary/30" id="location">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="space-y-6 text-center">
              <h2 className="font-bold font-display text-3xl">
                Planning to visit?
              </h2>
              {churchInfo?.address && (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <span className="font-medium text-xl">
                    {churchInfo.address}, {churchInfo.city}, {churchInfo.state}{" "}
                    {churchInfo.zip}
                  </span>
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="group border-none text-center shadow-md transition-all hover:shadow-lg">
                <CardContent className="space-y-4 p-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-church-gold/20 transition-transform group-hover:scale-110">
                    <Accessibility className="h-6 w-6 text-church-gold-dark" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-bold text-lg">Accessibility</h4>
                    <p className="text-muted-foreground text-sm">
                      Our facilities are fully wheelchair accessible with
                      designated seating.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group border-none text-center shadow-md transition-all hover:shadow-lg">
                <CardContent className="space-y-4 p-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-church-gold/20 transition-transform group-hover:scale-110">
                    <Baby className="h-6 w-6 text-church-gold-dark" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-bold text-lg">Kids Ministry</h4>
                    <p className="text-muted-foreground text-sm">
                      Safe, fun, and engaging spaces for children of all ages
                      during service.
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
