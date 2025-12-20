import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Map } from '@/components/Map';
import { useChurchInfo } from '@/hooks/useChurchData';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const { data: churchInfo } = useChurchInfo();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for your message! We will get back to you soon.');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section id="hero" className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Get In <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're here to help and would love to connect with you. Reach out with questions,
            prayer requests, or just to say hello.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section id="contact-info" className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-2xl font-display font-bold">Contact Information</h2>

              <div className="space-y-6">
                {churchInfo?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-muted-foreground">{churchInfo.phone}</p>
                      <p className="text-sm text-muted-foreground">Call us anytime</p>
                    </div>
                  </div>
                )}

                {churchInfo?.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-muted-foreground">{churchInfo.email}</p>
                      <p className="text-sm text-muted-foreground">We'd love to hear from you</p>
                    </div>
                  </div>
                )}

                {churchInfo?.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Address</h4>
                      <p className="text-muted-foreground">{churchInfo.address}</p>
                      <p className="text-muted-foreground">
                        {churchInfo.city}, {churchInfo.state} {churchInfo.zip}
                      </p>
                    </div>
                  </div>
                )}

                {churchInfo?.office_hours && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Office Hours</h4>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {churchInfo.office_hours}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Map */}
              <Card className="border-none shadow-lg overflow-hidden">
                <Map
                  latitude={14.848607}
                  longitude={120.312585}
                  address="2057 Jose Abad Santos Avenue, Brgy. Old Cabalan, Olongapo City, Zambales 2200"
                  className="rounded-lg"
                />
                <div className="p-4">
                  <Button
                    className="w-full"
                    onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=14.848607,120.312585', '_blank')}
                  >
                    <MapPin className="mr-2 h-4 w-4" /> Get Directions
                  </Button>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="border-none shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-display font-bold mb-6">Send us a Message (Coming soon!)</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">First Name</label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Last Name</label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Phone (Optional)</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Subject</label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Message</label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
