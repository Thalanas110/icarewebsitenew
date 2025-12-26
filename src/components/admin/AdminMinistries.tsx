import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  type Ministry,
  type MinistryInsert,
  useMinistries,
  useMinistryMutations,
} from "@/hooks/useChurchData";
import { ImageUpload } from "./ImageUpload";

function SortableMinistryCard({
  ministry,
  onEdit,
  onDelete,
}: {
  ministry: Ministry;
  onEdit: (m: Ministry) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: ministry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="mb-4" ref={setNodeRef} style={style}>
      <Card className="overflow-hidden">
        {ministry.image_url && (
          <div className="relative h-24 w-full">
            <img
              alt={ministry.name}
              className="h-full w-full object-cover"
              src={ministry.image_url}
            />
            <div
              {...attributes}
              {...listeners}
              className="absolute top-2 right-2 cursor-grab rounded bg-black/50 p-1 text-white hover:bg-black/70"
            >
              <GripVertical className="h-4 w-4" />
            </div>
          </div>
        )}
        {!ministry.image_url && (
          <div className="flex h-8 w-full justify-end bg-muted p-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab rounded p-1 hover:bg-muted-foreground/20"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-lg">{ministry.name}</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => onEdit(ministry)}
              size="icon"
              variant="ghost"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onDelete(ministry.id)}
              size="icon"
              variant="ghost"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 text-muted-foreground text-sm">
          {ministry.leader && <p>Leader: {ministry.leader}</p>}
          {ministry.meeting_time && <p>Meets: {ministry.meeting_time}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminMinistries() {
  const { data: ministries, isLoading } = useMinistries();
  const { createMinistry, updateMinistry, deleteMinistry, updateSortOrder } =
    useMinistryMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Ministry | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    leader: "",
    meeting_time: "",
    image_url: "",
    category: "ministry" as "ministry" | "outreach",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      leader: "",
      meeting_time: "",
      image_url: "",
      category: "ministry",
    });
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.name) {
      toast.error("Name is required");
      return;
    }
    try {
      if (editing) {
        await updateMinistry.mutateAsync({ id: editing.id, ...form });
        toast.success("Updated successfully");
      } else {
        // Get max sort order for the new item to put it at the end
        const currentMaxSort = ministries?.length
          ? Math.max(...ministries.map((m) => m.sort_order || 0))
          : 0;
        await createMinistry.mutateAsync({
          ...form,
          sort_order: currentMaxSort + 1,
        } as MinistryInsert);
        toast.success("Created successfully");
      }
      setOpen(false);
      resetForm();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "An error occurred");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMinistry.mutateAsync(deleteId);
      toast.success("Deleted");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setDeleteId(null);
    }
  };

  const openEdit = (m: Ministry) => {
    setEditing(m);
    setForm({
      name: m.name,
      description: m.description || "",
      leader: m.leader || "",
      meeting_time: m.meeting_time || "",
      image_url: m.image_url || "",
      category: m.category || "ministry",
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
    const activeItem = ministries.find((m) => m.id === active.id);
    const overItem = ministries.find((m) => m.id === over.id);

    if (activeItem?.category !== overItem?.category) return; // Don't allow cross-category dragging for now

    const categoryItems = ministries.filter(
      (m) => m.category === activeItem?.category
    );
    const oldCatIndex = categoryItems.findIndex((m) => m.id === active.id);
    const newCatIndex = categoryItems.findIndex((m) => m.id === over.id);

    const newCatOrder = arrayMove(categoryItems, oldCatIndex, newCatIndex);

    const updates = newCatOrder.map((m, index) => ({
      id: m.id,
      sort_order: index + 1,
    }));

    updateSortOrder.mutate(updates);
  };

  const churchMinistries =
    ministries?.filter((m) => m.category === "ministry" || !m.category) || [];
  const outreaches = ministries?.filter((m) => m.category === "outreach") || [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-2xl">Ministries & Outreaches</h2>
        <Dialog
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) resetForm();
          }}
          open={open}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit" : "Add"} Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <RadioGroup
                  className="flex gap-4"
                  onValueChange={(v: "ministry" | "outreach") =>
                    setForm({ ...form, category: v })
                  }
                  value={form.category}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="cat-ministry" value="ministry" />
                    <Label htmlFor="cat-ministry">Church Ministry</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="cat-outreach" value="outreach" />
                    <Label htmlFor="cat-outreach">Outreach</Label>
                  </div>
                </RadioGroup>
              </div>

              <Input
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name *"
                value={form.name}
              />
              <Textarea
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Description"
                value={form.description}
              />
              <Input
                onChange={(e) => setForm({ ...form, leader: e.target.value })}
                placeholder="Leader"
                value={form.leader}
              />
              <Input
                onChange={(e) =>
                  setForm({ ...form, meeting_time: e.target.value })
                }
                placeholder="Meeting Time"
                value={form.meeting_time}
              />
              <div>
                <Label className="mb-2 block">Image</Label>
                <ImageUpload
                  folder="ministries"
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  value={form.image_url}
                />
              </div>
              <Button className="w-full" onClick={handleSave}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className="space-y-8">
          <section>
            <h3 className="mb-4 font-medium text-primary text-xl">
              Church Ministries
            </h3>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <SortableContext
                items={churchMinistries.map((m) => m.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {churchMinistries.map((m) => (
                    <SortableMinistryCard
                      key={m.id}
                      ministry={m}
                      onDelete={handleDeleteClick}
                      onEdit={openEdit}
                    />
                  ))}
                  {churchMinistries.length === 0 && (
                    <p className="col-span-full text-muted-foreground">
                      No church ministries yet.
                    </p>
                  )}
                </div>
              </SortableContext>
            )}
          </section>

          <section>
            <h3 className="mb-4 font-medium text-primary text-xl">
              Outreaches
            </h3>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <SortableContext
                items={outreaches.map((m) => m.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {outreaches.map((m) => (
                    <SortableMinistryCard
                      key={m.id}
                      ministry={m}
                      onDelete={handleDeleteClick}
                      onEdit={openEdit}
                    />
                  ))}
                  {outreaches.length === 0 && (
                    <p className="col-span-full text-muted-foreground">
                      No outreaches yet.
                    </p>
                  )}
                </div>
              </SortableContext>
            )}
          </section>
        </div>
      </DndContext>

      <AlertDialog
        onOpenChange={(open) => !open && setDeleteId(null)}
        open={!!deleteId}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              ministry/outreach.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
