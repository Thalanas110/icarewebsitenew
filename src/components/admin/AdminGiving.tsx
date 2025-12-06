import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "./ImageUpload";
import { Loader2 } from "lucide-react";

interface GivingSettings {
  id: string;
  gcash_qr_url: string | null;
  donation_platform_name: string;
  donation_platform_url: string | null;
}

export default function AdminGiving() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<GivingSettings | null>(null);
  const [formData, setFormData] = useState({
    gcash_qr_url: "",
    donation_platform_name: "",
    donation_platform_url: "",
  });
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("giving_settings" as any)
        .select("*")
        .single();

      if (error) throw error;

      setSettings(data as any);
      setFormData({
        gcash_qr_url: (data as any).gcash_qr_url || "",
        donation_platform_name: (data as any).donation_platform_name || "",
        donation_platform_url: (data as any).donation_platform_url || "",
      });
    } catch (error) {
      console.error("Error fetching giving settings:", error);
      toast({
        title: "Error",
        description: "Failed to load giving settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("giving_settings" as any)
        .update({
          gcash_qr_url: formData.gcash_qr_url || null,
          donation_platform_name: formData.donation_platform_name || "Buy Me a Coffee",
          donation_platform_url: formData.donation_platform_url || null,
        })
        .eq("id", settings.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Giving settings updated successfully",
      });
      
      fetchSettings();
    } catch (error) {
      console.error("Error updating giving settings:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update giving settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Giving Settings</CardTitle>
          <CardDescription>
            Manage donation options and payment methods for the Giving page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* GCash QR Code Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">GCash QR Code</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a QR code image that people can scan to send donations via GCash
              </p>
            </div>
            
            <ImageUpload
              value={formData.gcash_qr_url}
              onChange={(url) => setFormData({ ...formData, gcash_qr_url: url })}
              folder="giving"
            />

            {formData.gcash_qr_url && (
              <div className="mt-4">
                <Label>QR Code Preview</Label>
                <div className="mt-2 bg-white p-4 rounded-lg border inline-block">
                  <img 
                    src={formData.gcash_qr_url} 
                    alt="GCash QR Code Preview" 
                    className="w-48 h-48 object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Online Donation Platform Section */}
          <div className="space-y-4 pt-6 border-t">
            <div>
              <Label className="text-base font-semibold">Online Donation Platform</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Configure third-party donation platform (e.g., Buy Me a Coffee, Ko-fi, etc.)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input
                id="platform-name"
                placeholder="e.g., Buy Me a Coffee"
                value={formData.donation_platform_name}
                onChange={(e) =>
                  setFormData({ ...formData, donation_platform_name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform-url">Platform URL</Label>
              <Input
                id="platform-url"
                type="url"
                placeholder="https://www.buymeacoffee.com/yourchurch"
                value={formData.donation_platform_url}
                onChange={(e) =>
                  setFormData({ ...formData, donation_platform_url: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Enter the full URL where people can donate online
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
