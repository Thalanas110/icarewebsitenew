import { Download, ExternalLink, Heart, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GivingSettings {
  id: string;
  gcash_qr_url: string | null;
  donation_platform_name: string;
  donation_platform_url: string | null;
}

const Giving = () => {
  const [givingSettings, setGivingSettings] = useState<GivingSettings | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGivingSettings();
  }, []);

  const fetchGivingSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("giving_settings")
        .select("*")
        .single();

      if (error) throw error;
      setGivingSettings(data as any);
    } catch (error: any) {
      console.error("Error fetching giving settings:", error);
      toast({
        title: "Error",
        description: "Failed to load giving options",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = async () => {
    if (!givingSettings?.gcash_qr_url) return;

    try {
      const response = await fetch(givingSettings.gcash_qr_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "gcash-qr-code.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "QR code downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 py-12 md:py-20">
            {/* Header Section */}
            <div
              className="mb-12 space-y-4 text-center md:mb-16"
              id="ways-to-give"
            >
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-bold font-display text-4xl tracking-tight md:text-5xl">
                Ways We <span className="text-church-orange">Give</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                Your generous giving helps us continue our mission to serve the
                community and spread hope. Thank you for your support!
              </p>
            </div>

            {/* Giving Options Grid */}
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-2">
              {/* Left Column: Stacked Options */}
              <div className="space-y-6 md:space-y-8">
                {/* Option 1: Visit the Church */}
                <Card className="flex h-full flex-col transition-shadow duration-300 hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl">Visit Us</CardTitle>
                    <CardDescription>
                      Give in person during service
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col space-y-4">
                    <p className="text-center text-muted-foreground text-sm">
                      Join us for worship and give your offering during our
                      service times. We'd love to see you!
                    </p>
                    <Button
                      className="mt-auto w-full"
                      onClick={() => navigate("/contact")}
                      variant="default"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      View Location & Times
                    </Button>
                  </CardContent>
                </Card>

                {/* Option 3: Online Platform */}
                <Card className="flex h-full flex-col transition-shadow duration-300 hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <ExternalLink className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-2xl">
                      {givingSettings?.donation_platform_name ||
                        "Online Giving"}
                    </CardTitle>
                    <CardDescription>Support us online</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col space-y-4">
                    <p className="text-center text-muted-foreground text-sm">
                      Give securely through our online donation platform. Every
                      contribution makes a difference!
                    </p>
                    {givingSettings?.donation_platform_url ? (
                      <Button
                        className="mt-auto w-full"
                        onClick={() =>
                          window.open(
                            givingSettings.donation_platform_url!,
                            "_blank"
                          )
                        }
                        variant="default"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Give Online
                      </Button>
                    ) : (
                      <Button
                        className="mt-auto w-full"
                        disabled
                        variant="outline"
                      >
                        Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: GCash QR Code */}
              <Card className="flex h-full flex-col justify-center border-primary/50 transition-shadow duration-300 hover:shadow-lg lg:min-h-[600px]">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <svg
                      className="h-6 w-6 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl">GCash</CardTitle>
                  <CardDescription>Scan or download QR code</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col space-y-4">
                  {givingSettings?.gcash_qr_url ? (
                    <>
                      <div className="flex flex-1 items-center justify-center rounded-lg bg-white p-4">
                        <img
                          alt="GCash QR Code"
                          className="h-full max-h-[400px] w-full object-contain"
                          src={givingSettings.gcash_qr_url}
                        />
                      </div>
                      <Button
                        className="mt-auto w-full"
                        onClick={handleDownloadQR}
                        variant="outline"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download QR Code
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-1 items-center justify-center rounded-lg bg-muted p-8 text-center">
                      <p className="text-muted-foreground text-sm">
                        GCash QR code will be available soon
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Bottom Message */}
            <div className="mx-auto mt-12 max-w-2xl text-center md:mt-16">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm italic md:text-base">
                    "Each of you should give what you have decided in your heart
                    to give, not reluctantly or under compulsion, for God loves
                    a cheerful giver." - 2 Corinthians 9:7
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Giving;
