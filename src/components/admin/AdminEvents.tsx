import { format } from "date-fns";
import {
  Calendar,
  CalendarX,
  CheckCircle,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type Event,
  type EventInsert,
  useEventMutations,
  useEvents,
} from "@/hooks/useChurchData";
import { ImageUpload } from "./ImageUpload";

export function AdminEvents() {
  const { data: events, isLoading } = useEvents();
  const { createEvent, updateEvent, deleteEvent } = useEventMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    image_url: "",
    status: "scheduled" as "scheduled" | "postponed" | "done",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      event_date: "",
      event_time: "",
      location: "",
      image_url: "",
      status: "scheduled",
    });
    setEditing(null);
  };

  const handleSave = async () => {
    if (!(form.title && form.event_date)) {
      toast.error("Title and date are required");
      return;
    }
    try {
      if (editing) {
        await updateEvent.mutateAsync({ id: editing.id, ...form });
        toast.success("Event updated");
      } else {
        await createEvent.mutateAsync(form as EventInsert);
        toast.success("Event created");
      }
      setOpen(false);
      resetForm();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEvent.mutateAsync(deleteId);
      toast.success("Deleted");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setDeleteId(null);
    }
  };

  const openEdit = (e: Event) => {
    setEditing(e);
    setForm({
      title: e.title,
      description: e.description || "",
      event_date: e.event_date,
      event_time: e.event_time || "",
      location: e.location || "",
      image_url: e.image_url || "",
      status: e.status || "scheduled",
    });
    setOpen(true);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-2xl">Events</h2>
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
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit" : "Add"} Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title *"
                value={form.title}
              />
              <Input
                onChange={(e) =>
                  setForm({ ...form, event_date: e.target.value })
                }
                type="date"
                value={form.event_date}
              />
              <Input
                onChange={(e) =>
                  setForm({ ...form, event_time: e.target.value })
                }
                placeholder="Time (e.g. 7:00 PM)"
                value={form.event_time}
              />
              <Input
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Location"
                value={form.location}
              />
              <div>
                <label className="mb-2 block font-medium text-sm">Status</label>
                <Select
                  onValueChange={(value: "scheduled" | "postponed" | "done") =>
                    setForm({ ...form, status: value })
                  }
                  value={form.status}
                >
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
              <Textarea
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Description"
                value={form.description}
              />
              <div>
                <label className="mb-2 block font-medium text-sm">
                  Event Cover Image
                </label>
                <ImageUpload
                  folder="events"
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
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {events?.map((e) => (
            <Card className="overflow-hidden" key={e.id}>
              {e.image_url && (
                <div className="h-32 w-full">
                  <img
                    alt={e.title}
                    className="h-full w-full object-cover"
                    src={e.image_url}
                  />
                </div>
              )}
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{e.title}</CardTitle>
                  <Badge
                    className="flex items-center gap-1"
                    variant={
                      e.status === "done"
                        ? "default"
                        : e.status === "postponed"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {e.status === "done" && <CheckCircle className="h-3 w-3" />}
                    {e.status === "postponed" && (
                      <CalendarX className="h-3 w-3" />
                    )}
                    {e.status === "scheduled" && (
                      <Calendar className="h-3 w-3" />
                    )}
                    {e.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => openEdit(e)}
                    size="icon"
                    variant="ghost"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(e.id)}
                    size="icon"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-muted-foreground text-sm">
                <p>
                  {format(new Date(e.event_date), "MMMM d, yyyy")}{" "}
                  {e.event_time && `at ${e.event_time}`}
                </p>
                {e.location && <p>{e.location}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        onOpenChange={(open) => !open && setDeleteId(null)}
        open={!!deleteId}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event.
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
