import { useState } from 'react';
import { useMinistries, useMinistryMutations, Ministry, MinistryInsert } from '@/hooks/useChurchData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

function SortableMinistryCard({ ministry, onEdit, onDelete }: { ministry: Ministry; onEdit: (m: Ministry) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: ministry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card className="overflow-hidden">
        {ministry.image_url && (
          <div className="h-24 w-full relative">
            <img src={ministry.image_url} alt={ministry.name} className="w-full h-full object-cover" />
            <div {...attributes} {...listeners} className="absolute top-2 right-2 bg-black/50 p-1 rounded cursor-grab hover:bg-black/70 text-white">
              <GripVertical className="h-4 w-4" />
            </div>
          </div>
        )}
        {!ministry.image_url && (
          <div className="h-8 bg-muted w-full flex justify-end p-2">
            <div {...attributes} {...listeners} className="cursor-grab hover:bg-muted-foreground/20 p-1 rounded">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-lg">{ministry.name}</CardTitle>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => onEdit(ministry)}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(ministry.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 text-sm text-muted-foreground">
          {ministry.leader && <p>Leader: {ministry.leader}</p>}
          {ministry.meeting_time && <p>Meets: {ministry.meeting_time}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminMinistries() {
  const { data: ministries, isLoading } = useMinistries();
  const { createMinistry, updateMinistry, deleteMinistry, updateSortOrder } = useMinistryMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Ministry | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    leader: '',
    meeting_time: '',
    image_url: '',
    category: 'ministry' as 'ministry' | 'outreach'
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const resetForm = () => {
    setForm({ name: '', description: '', leader: '', meeting_time: '', image_url: '', category: 'ministry' });
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error('Name is required'); return; }
    try {
      if (editing) {
        await updateMinistry.mutateAsync({ id: editing.id, ...form });
        toast.success('Updated successfully');
      } else {
        // Get max sort order for the new item to put it at the end
        const currentMaxSort = ministries?.length ? Math.max(...ministries.map(m => m.sort_order || 0)) : 0;
        await createMinistry.mutateAsync({ ...form, sort_order: currentMaxSort + 1 } as MinistryInsert);
        toast.success('Created successfully');
      }
      setOpen(false); resetForm();
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'An error occurred'); }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMinistry.mutateAsync(deleteId);
      toast.success('Deleted');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setDeleteId(null);
    }
  };

  const openEdit = (m: Ministry) => {
    setEditing(m);
    setForm({
      name: m.name,
      description: m.description || '',
      leader: m.leader || '',
      meeting_time: m.meeting_time || '',
      image_url: m.image_url || '',
      category: m.category || 'ministry'
    });
    setOpen(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !ministries) return;

    const oldIndex = ministries.findIndex((m) => m.id === active.id);
    const newIndex = ministries.findIndex((m) => m.id === over.id);

    // Optimistic update logic could go here, but for now we'll just trigger the mutation
    const newOrder = arrayMove(ministries, oldIndex, newIndex);

    // We need to re-assign sort_orders based on the new array order
    // Note: We are reordering the ENTIRE list, but visually we might be dragging within a category.
    // However, if we want to allow dragging BETWEEN categories, we need to handle that.
    // For simplicity, let's assume we just update the sort_order of the items based on the new list.
    // Accessing the sub-lists might be safer if we only allow sorting WITHIN categories.
    // Let's implement sorting WITHIN categories for now.

    // Check if both items are in the same category
    const activeItem = ministries.find(m => m.id === active.id);
    const overItem = ministries.find(m => m.id === over.id);

    if (activeItem?.category !== overItem?.category) return; // Don't allow cross-category dragging for now

    const categoryItems = ministries.filter(m => m.category === activeItem?.category);
    const oldCatIndex = categoryItems.findIndex(m => m.id === active.id);
    const newCatIndex = categoryItems.findIndex(m => m.id === over.id);

    const newCatOrder = arrayMove(categoryItems, oldCatIndex, newCatIndex);

    const updates = newCatOrder.map((m, index) => ({
      id: m.id,
      sort_order: index + 1
    }));

    updateSortOrder.mutate(updates);
  };

  const churchMinistries = ministries?.filter(m => m.category === 'ministry' || !m.category) || [];
  const outreaches = ministries?.filter(m => m.category === 'outreach') || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Ministries & Outreaches</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add New</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Entry</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <RadioGroup
                  value={form.category}
                  onValueChange={(v: 'ministry' | 'outreach') => setForm({ ...form, category: v })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ministry" id="cat-ministry" />
                    <Label htmlFor="cat-ministry">Church Ministry</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outreach" id="cat-outreach" />
                    <Label htmlFor="cat-outreach">Outreach</Label>
                  </div>
                </RadioGroup>
              </div>

              <Input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Leader" value={form.leader} onChange={(e) => setForm({ ...form, leader: e.target.value })} />
              <Input placeholder="Meeting Time" value={form.meeting_time} onChange={(e) => setForm({ ...form, meeting_time: e.target.value })} />
              <div>
                <Label className="mb-2 block">Image</Label>
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-medium mb-4 text-primary">Church Ministries</h3>
            {isLoading ? <p>Loading...</p> : (
              <SortableContext items={churchMinistries.map(m => m.id)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {churchMinistries.map((m) => (
                    <SortableMinistryCard key={m.id} ministry={m} onEdit={openEdit} onDelete={handleDeleteClick} />
                  ))}
                  {churchMinistries.length === 0 && <p className="text-muted-foreground col-span-full">No church ministries yet.</p>}
                </div>
              </SortableContext>
            )}
          </section>

          <section>
            <h3 className="text-xl font-medium mb-4 text-primary">Outreaches</h3>
            {isLoading ? <p>Loading...</p> : (
              <SortableContext items={outreaches.map(m => m.id)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {outreaches.map((m) => (
                    <SortableMinistryCard key={m.id} ministry={m} onEdit={openEdit} onDelete={handleDeleteClick} />
                  ))}
                  {outreaches.length === 0 && <p className="text-muted-foreground col-span-full">No outreaches yet.</p>}
                </div>
              </SortableContext>
            )}
          </section>
        </div>
      </DndContext>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the ministry/outreach.
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
