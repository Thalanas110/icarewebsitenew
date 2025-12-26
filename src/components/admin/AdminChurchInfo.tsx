import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useChurchInfo, useChurchInfoMutation } from "@/hooks/useChurchData";

export function AdminChurchInfo() {
  const { data: churchInfo, isLoading } = useChurchInfo();
  const mutation = useChurchInfoMutation();
  const [form, setForm] = useState({
    pastor_name: "",
    pastor_email: "",
    pastor_phone: "",
    church_name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    office_hours: "",
  });

  useEffect(() => {
    if (churchInfo) {
      setForm({
        pastor_name: churchInfo.pastor_name || "",
        pastor_email: churchInfo.pastor_email || "",
        pastor_phone: churchInfo.pastor_phone || "",
        church_name: churchInfo.church_name || "",
        address: churchInfo.address || "",
        city: churchInfo.city || "",
        state: churchInfo.state || "",
        zip: churchInfo.zip || "",
        phone: churchInfo.phone || "",
        email: churchInfo.email || "",
        office_hours: churchInfo.office_hours || "",
      });
    }
  }, [churchInfo]);

  const handleSave = async () => {
    if (!churchInfo?.id) return;
    try {
      await mutation.mutateAsync({ id: churchInfo.id, ...form });
      toast.success("Church info updated");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-2xl">Church Information</h2>

      <Card>
        <CardHeader>
          <CardTitle>Pastor Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h5>Pastor Name</h5>
          <Input
            onChange={(e) => setForm({ ...form, pastor_name: e.target.value })}
            placeholder="Pastor Name"
            value={form.pastor_name}
          />
          <h5>Pastor Email</h5>
          <Input
            onChange={(e) => setForm({ ...form, pastor_email: e.target.value })}
            placeholder="Pastor Email"
            value={form.pastor_email}
          />
          <h5>Pastor Phone</h5>
          <Input
            onChange={(e) => setForm({ ...form, pastor_phone: e.target.value })}
            placeholder="Pastor Phone"
            value={form.pastor_phone}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Church Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h5>Church Name</h5>
          <Input
            onChange={(e) => setForm({ ...form, church_name: e.target.value })}
            placeholder="Church Name"
            value={form.church_name}
          />
          <h5>Contact Information</h5>
          <Input
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone"
            value={form.phone}
          />
          <h5>Email</h5>
          <Input
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            value={form.email}
          />
          <h5>Office Hours</h5>
          <Input
            onChange={(e) => setForm({ ...form, office_hours: e.target.value })}
            placeholder="Office Hours"
            value={form.office_hours}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h5>Address</h5>
            <Input
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Address"
              value={form.address}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h5>City</h5>
              <Input
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="City"
                value={form.city}
              />
            </div>
            <div className="space-y-2">
              <h5>State</h5>
              <Input
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="State"
                value={form.state}
              />
            </div>
            <div className="space-y-2">
              <h5>Zip</h5>
              <Input
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                placeholder="Zip"
                value={form.zip}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} size="lg">
        Save All Changes
      </Button>
    </div>
  );
}
