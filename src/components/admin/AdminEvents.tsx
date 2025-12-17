import { useState } from 'react';
import { useEvents, useEventMutations, Event, EventInsert } from '@/hooks/useChurchData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Calendar, CalendarX, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ImageUpload } from './ImageUpload';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AdminEvents() {
  const { data: events, isLoading } = useEvents();
  const { createEvent, updateEvent, deleteEvent } = useEventMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({ title: '', description: '', event_date: '', event_time: '', location: '', image_url: '', status: 'scheduled' as 'scheduled' | 'postponed' | 'done' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const resetForm = () => { setForm({ title: '', description: '', event_date: '', event_time: '', location: '', image_url: '', status: 'scheduled' }); setEditing(null); };

  const handleSave = async () => {
    if (!form.title || !form.event_date) { toast.error('Title and date are required'); return; }
    try {
      if (editing) {
        await updateEvent.mutateAsync({ id: editing.id, ...form });
        toast.success('Event updated');
      } else {
        await createEvent.mutateAsync(form as EventInsert);
        toast.success('Event created');
      }
      setOpen(false); resetForm();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEvent.mutateAsync(deleteId);
      toast.success('Deleted');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setDeleteId(null);
    }
  };

  const openEdit = (e: Event) => { setEditing(e); setForm({ title: e.title, description: e.description || '', event_date: e.event_date, event_time: e.event_time || '', location: e.location || '', image_url: e.image_url || '', status: e.status || 'scheduled' }); setOpen(true); };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Events</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Event</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Event</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
              <Input placeholder="Time (e.g. 7:00 PM)" value={form.event_time} onChange={(e) => setForm({ ...form, event_time: e.target.value })} />
              <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={form.status} onValueChange={(value: 'scheduled' | 'postponed' | 'done') => setForm({ ...form, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="postponed">Postponed</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div>
                <label className="text-sm font-medium mb-2 block">Event Cover Image</label>
                <ImageUpload
                  value={form.image_url}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  folder="events"
                />
              </div>
              <Button onClick={handleSave} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <p>Loading...</p> : (
        <div className="grid gap-4">
          {events?.map((e) => (
            <Card key={e.id} className="overflow-hidden">
              {e.image_url && (
                <div className="h-32 w-full">
                  <img src={e.image_url} alt={e.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{e.title}</CardTitle>
                  <Badge variant={e.status === 'done' ? 'default' : e.status === 'postponed' ? 'destructive' : 'secondary'} className="flex items-center gap-1">
                    {e.status === 'done' && <CheckCircle className="h-3 w-3" />}
                    {e.status === 'postponed' && <CalendarX className="h-3 w-3" />}
                    {e.status === 'scheduled' && <Calendar className="h-3 w-3" />}
                    {e.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(e)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDeleteClick(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                <p>{format(new Date(e.event_date), 'MMMM d, yyyy')} {e.event_time && `at ${e.event_time}`}</p>
                {e.location && <p>{e.location}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
