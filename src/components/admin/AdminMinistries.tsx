import { useState } from 'react';
import { useMinistries, useMinistryMutations, Ministry, MinistryInsert } from '@/hooks/useChurchData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
export function AdminMinistries() {
  const { data: ministries, isLoading } = useMinistries();
  const { createMinistry, updateMinistry, deleteMinistry } = useMinistryMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Ministry | null>(null);
  const [form, setForm] = useState({ name: '', description: '', leader: '', meeting_time: '', image_url: '' });

  const resetForm = () => { setForm({ name: '', description: '', leader: '', meeting_time: '', image_url: '' }); setEditing(null); };

  const handleSave = async () => {
    if (!form.name) { toast.error('Name is required'); return; }
    try {
      if (editing) {
        await updateMinistry.mutateAsync({ id: editing.id, ...form });
        toast.success('Ministry updated');
      } else {
        await createMinistry.mutateAsync(form as MinistryInsert);
        toast.success('Ministry created');
      }
      setOpen(false); resetForm();
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'An error occurred'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this ministry?')) return;
    try { await deleteMinistry.mutateAsync(id); toast.success('Deleted'); } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'An error occurred'); }
  };

  const openEdit = (m: Ministry) => { setEditing(m); setForm({ name: m.name, description: m.description || '', leader: m.leader || '', meeting_time: m.meeting_time || '', image_url: m.image_url || '' }); setOpen(true); };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Ministries</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Ministry</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Ministry</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Leader" value={form.leader} onChange={(e) => setForm({ ...form, leader: e.target.value })} />
              <Input placeholder="Meeting Time" value={form.meeting_time} onChange={(e) => setForm({ ...form, meeting_time: e.target.value })} />
              <div>
                <label className="text-sm font-medium mb-2 block">Ministry Image</label>
                <ImageUpload 
                  value={form.image_url} 
                  onChange={(url) => setForm({ ...form, image_url: url })} 
                  folder="ministries"
                />
              </div>
              <Button onClick={handleSave} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <p>Loading...</p> : (
        <div className="grid gap-4">
          {ministries?.map((m) => (
            <Card key={m.id} className="overflow-hidden">
              {m.image_url && (
                <div className="h-24 w-full">
                  <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-lg">{m.name}</CardTitle>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(m)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                {m.leader && <p>Leader: {m.leader}</p>}
                {m.meeting_time && <p>Meets: {m.meeting_time}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
