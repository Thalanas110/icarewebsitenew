import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "./ImageUpload";

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
    } catch (_error) {
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
          donation_platform_name:
            formData.donation_platform_name || "Buy Me a Coffee",
          donation_platform_url: formData.donation_platform_url || null,
        })
        .eq("id", settings.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Giving settings updated successfully",
      });

      fetchSettings();
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to update giving settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
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
              <Label className="font-semibold text-base">GCash QR Code</Label>
              <p className="mt-1 text-muted-foreground text-sm">
                Upload a QR code image that people can scan to send donations
                via GCash
              </p>
            </div>

            <ImageUpload
              folder="giving"
              onChange={(url) =>
                setFormData({ ...formData, gcash_qr_url: url })
              }
              value={formData.gcash_qr_url}
            />

            {formData.gcash_qr_url && (
              <div className="mt-4">
                <Label>QR Code Preview</Label>
                <div className="mt-2 inline-block rounded-lg border bg-white p-4">
                  <img
                    alt="GCash QR Code Preview"
                    className="h-48 w-48 object-contain"
                    src={formData.gcash_qr_url}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Online Donation Platform Section */}
          <div className="space-y-4 border-t pt-6">
            <div>
              <Label className="font-semibold text-base">
                Online Donation Platform
              </Label>
              <p className="mt-1 text-muted-foreground text-sm">
                Configure third-party donation platform (e.g., Buy Me a Coffee,
                Ko-fi, etc.)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input
                id="platform-name"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    donation_platform_name: e.target.value,
                  })
                }
                placeholder="e.g., Buy Me a Coffee"
                value={formData.donation_platform_name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform-url">Platform URL</Label>
              <Input
                id="platform-url"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    donation_platform_url: e.target.value,
                  })
                }
                placeholder="https://www.buymeacoffee.com/yourchurch"
                type="url"
                value={formData.donation_platform_url}
              />
              <p className="text-muted-foreground text-xs">
                Enter the full URL where people can donate online
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t pt-6">
            <Button disabled={saving} onClick={handleSave}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
