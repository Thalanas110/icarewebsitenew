import { useState, useEffect } from 'react';
import { useChurchInfo, useChurchInfoMutation } from '@/hooks/useChurchData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function AdminChurchInfo() {
  const { data: churchInfo, isLoading } = useChurchInfo();
  const mutation = useChurchInfoMutation();
  const [form, setForm] = useState({
    pastor_name: '', pastor_email: '', pastor_phone: '',
    church_name: '', address: '', city: '', state: '', zip: '',
    phone: '', email: '', office_hours: ''
  });

  useEffect(() => {
    if (churchInfo) {
      setForm({
        pastor_name: churchInfo.pastor_name || '',
        pastor_email: churchInfo.pastor_email || '',
        pastor_phone: churchInfo.pastor_phone || '',
        church_name: churchInfo.church_name || '',
        address: churchInfo.address || '',
        city: churchInfo.city || '',
        state: churchInfo.state || '',
        zip: churchInfo.zip || '',
        phone: churchInfo.phone || '',
        email: churchInfo.email || '',
        office_hours: churchInfo.office_hours || ''
      });
    }
  }, [churchInfo]);

  const handleSave = async () => {
    if (!churchInfo?.id) return;
    try {
      await mutation.mutateAsync({ id: churchInfo.id, ...form });
      toast.success('Church info updated');
    } catch (e: any) { toast.error(e.message); }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Church Information</h2>
      
      <Card>
        <CardHeader><CardTitle>Pastor Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Pastor Name" value={form.pastor_name} onChange={(e) => setForm({ ...form, pastor_name: e.target.value })} />
          <Input placeholder="Pastor Email" value={form.pastor_email} onChange={(e) => setForm({ ...form, pastor_email: e.target.value })} />
          <Input placeholder="Pastor Phone" value={form.pastor_phone} onChange={(e) => setForm({ ...form, pastor_phone: e.target.value })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Church Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Church Name" value={form.church_name} onChange={(e) => setForm({ ...form, church_name: e.target.value })} />
          <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Office Hours" value={form.office_hours} onChange={(e) => setForm({ ...form, office_hours: e.target.value })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Location</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            <Input placeholder="Zip" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} size="lg">Save All Changes</Button>
    </div>
  );
}
