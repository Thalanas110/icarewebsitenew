import { useState } from 'react';
import { useServiceTimes, useServiceTimeMutations, ServiceTime, ServiceTimeInsert } from '@/hooks/useChurchData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function AdminServiceTimes() {
  const { data: serviceTimes, isLoading } = useServiceTimes();
  const { createServiceTime, updateServiceTime, deleteServiceTime } = useServiceTimeMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceTime | null>(null);
  const [form, setForm] = useState({ name: '', time: '', description: '', audience: '' });

  const resetForm = () => { setForm({ name: '', time: '', description: '', audience: '' }); setEditing(null); };

  const handleSave = async () => {
    if (!form.name || !form.time) { toast.error('Name and time are required'); return; }
    try {
      if (editing) {
        await updateServiceTime.mutateAsync({ id: editing.id, ...form });
        toast.success('Service time updated');
      } else {
        await createServiceTime.mutateAsync(form as ServiceTimeInsert);
        toast.success('Service time created');
      }
      setOpen(false); resetForm();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service time?')) return;
    try { await deleteServiceTime.mutateAsync(id); toast.success('Deleted'); } catch (e: any) { toast.error(e.message); }
  };

  const openEdit = (s: ServiceTime) => { setEditing(s); setForm({ name: s.name, time: s.time, description: s.description || '', audience: s.audience || '' }); setOpen(true); };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Service Times</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Service</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Service Time</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Time * (e.g. 8:30-10:00 AM)" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              <Input placeholder="Audience (e.g. All Ages)" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Button onClick={handleSave} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <p>Loading...</p> : (
        <div className="grid gap-4">
          {serviceTimes?.map((s) => (
            <Card key={s.id}>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-lg">{s.name}</CardTitle>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                <p className="font-medium text-primary">{s.time}</p>
                {s.audience && <p>{s.audience}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
