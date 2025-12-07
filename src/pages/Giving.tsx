import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Download, MapPin, ExternalLink, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

interface GivingSettings {
  id: string;
  gcash_qr_url: string | null;
  donation_platform_name: string;
  donation_platform_url: string | null;
}

const Giving = () => {
  const [givingSettings, setGivingSettings] = useState<GivingSettings | null>(null);
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 py-12 md:py-20">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Ways We Give
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Your generous giving helps us continue our mission to serve the community and spread hope.
              Thank you for your support!
            </p>
          </div>

          {/* Giving Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Option 1: Visit the Church */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto mb-4">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Visit Us</CardTitle>
              <CardDescription>Give in person during service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Join us for worship and give your offering during our service times.
                We'd love to see you!
              </p>
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => navigate("/contact")}
              >
                <MapPin className="w-4 h-4 mr-2" />
                View Location & Times
              </Button>
            </CardContent>
          </Card>

          {/* Option 2: GCash QR Code */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-primary/50">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                </svg>
              </div>
              <CardTitle className="text-2xl">GCash</CardTitle>
              <CardDescription>Scan or download QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {givingSettings?.gcash_qr_url ? (
                <>
                  <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                    <img 
                      src={givingSettings.gcash_qr_url} 
                      alt="GCash QR Code" 
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={handleDownloadQR}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                </>
              ) : (
                <div className="bg-muted rounded-lg p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    GCash QR code will be available soon
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Option 3: Online Platform */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mx-auto mb-4">
                <ExternalLink className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl">
                {givingSettings?.donation_platform_name || "Online Giving"}
              </CardTitle>
              <CardDescription>Support us online</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Give securely through our online donation platform. Every contribution makes a difference!
              </p>
              {givingSettings?.donation_platform_url ? (
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={() => window.open(givingSettings.donation_platform_url!, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Give Online
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  variant="outline"
                  disabled
                >
                  Coming Soon
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Message */}
        <div className="mt-12 md:mt-16 text-center max-w-2xl mx-auto">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm md:text-base text-muted-foreground italic">
                "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, 
                for God loves a cheerful giver." - 2 Corinthians 9:7
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
