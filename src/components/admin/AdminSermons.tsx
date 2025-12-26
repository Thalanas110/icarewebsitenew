import { format } from "date-fns";
import {
  BookOpen,
  Calendar,
  Clock,
  Music,
  Pencil,
  Plus,
  Trash2,
  Video,
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  type Sermon,
  type SermonInsert,
  useSermonMutations,
  useSermons,
} from "@/hooks/useChurchData";

export function AdminSermons() {
  const { data: sermons, isLoading } = useSermons();
  const { createSermon, updateSermon, deleteSermon } = useSermonMutations();
  const [isOpen, setIsOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<SermonInsert>({
    title: "",
    description: "",
    speaker: "",
    sermon_date: "",
    video_url: "",
    audio_url: "",
    scripture_reference: "",
    series_name: "",
    thumbnail_url: "",
    duration_minutes: null,
    is_featured: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      speaker: "",
      sermon_date: "",
      video_url: "",
      audio_url: "",
      scripture_reference: "",
      series_name: "",
      thumbnail_url: "",
      duration_minutes: null,
      is_featured: false,
    });
    setEditingSermon(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(formData.title && formData.speaker && formData.sermon_date)) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingSermon) {
        await updateSermon.mutateAsync({ id: editingSermon.id, ...formData });
        toast.success("Sermon updated successfully");
      } else {
        await createSermon.mutateAsync(formData);
        toast.success("Sermon created successfully");
      }
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        editingSermon ? "Failed to update sermon" : "Failed to create sermon"
      );
    }
  };

  const handleEdit = (sermon: Sermon) => {
    setFormData({
      title: sermon.title,
      description: sermon.description || "",
      speaker: sermon.speaker,
      sermon_date: sermon.sermon_date,
      video_url: sermon.video_url || "",
      audio_url: sermon.audio_url || "",
      scripture_reference: sermon.scripture_reference || "",
      series_name: sermon.series_name || "",
      thumbnail_url: sermon.thumbnail_url || "",
      duration_minutes: sermon.duration_minutes,
      is_featured: sermon.is_featured,
    });
    setEditingSermon(sermon);
    setIsOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSermon.mutateAsync(deleteId);
      toast.success("Sermon deleted successfully");
    } catch (error) {
      toast.error("Failed to delete sermon");
    } finally {
      setDeleteId(null);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (isLoading) return <div>Loading sermons...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold font-display text-2xl">Sermons</h2>
          <p className="text-muted-foreground">
            Manage your church sermons and messages
          </p>
        </div>
        <Dialog onOpenChange={handleOpenChange} open={isOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Sermon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSermon ? "Edit Sermon" : "Add New Sermon"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    value={formData.title}
                  />
                </div>
                <div>
                  <Label htmlFor="speaker">Speaker *</Label>
                  <Input
                    id="speaker"
                    onChange={(e) =>
                      setFormData({ ...formData, speaker: e.target.value })
                    }
                    required
                    value={formData.speaker}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sermon_date">Sermon Date *</Label>
                  <Input
                    id="sermon_date"
                    onChange={(e) =>
                      setFormData({ ...formData, sermon_date: e.target.value })
                    }
                    required
                    type="date"
                    value={formData.sermon_date}
                  />
                </div>
                <div>
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration_minutes: e.target.value
                          ? Number.parseInt(e.target.value)
                          : null,
                      })
                    }
                    type="number"
                    value={formData.duration_minutes || ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scripture_reference">
                    Scripture Reference
                  </Label>
                  <Input
                    id="scripture_reference"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scripture_reference: e.target.value,
                      })
                    }
                    placeholder="e.g., John 3:16"
                    value={formData.scripture_reference}
                  />
                </div>
                <div>
                  <Label htmlFor="series_name">Series Name</Label>
                  <Input
                    id="series_name"
                    onChange={(e) =>
                      setFormData({ ...formData, series_name: e.target.value })
                    }
                    value={formData.series_name}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  value={formData.description}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    onChange={(e) =>
                      setFormData({ ...formData, video_url: e.target.value })
                    }
                    placeholder="https://..."
                    value={formData.video_url}
                  />
                </div>
                <div>
                  <Label htmlFor="audio_url">Audio URL</Label>
                  <Input
                    id="audio_url"
                    onChange={(e) =>
                      setFormData({ ...formData, audio_url: e.target.value })
                    }
                    placeholder="https://..."
                    value={formData.audio_url}
                  />
                </div>
                <div>
                  <Label htmlFor="thumbnail_url">Thumbnail Image URL</Label>
                  <Input
                    id="thumbnail_url"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        thumbnail_url: e.target.value,
                      })
                    }
                    placeholder="https://..."
                    value={formData.thumbnail_url}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_featured}
                  id="is_featured"
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
                <Label htmlFor="is_featured">Featured sermon</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  disabled={createSermon.isPending || updateSermon.isPending}
                  type="submit"
                >
                  {editingSermon ? "Update Sermon" : "Add Sermon"}
                </Button>
                <Button
                  onClick={() => handleOpenChange(false)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sermons?.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No sermons added yet</p>
            </CardContent>
          </Card>
        ) : (
          sermons?.map((sermon) => (
            <Card className="overflow-hidden" key={sermon.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{sermon.title}</h3>
                      {sermon.is_featured && (
                        <Badge
                          className="bg-church-gold text-church-navy"
                          variant="default"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>

                    <div className="mb-3 grid grid-cols-2 gap-4 text-muted-foreground text-sm md:grid-cols-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(sermon.sermon_date), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {sermon.speaker}
                      </div>
                      {sermon.duration_minutes && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {sermon.duration_minutes} min
                        </div>
                      )}
                      {sermon.scripture_reference && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {sermon.scripture_reference}
                        </div>
                      )}
                    </div>

                    {sermon.series_name && (
                      <Badge className="mb-2" variant="outline">
                        {sermon.series_name}
                      </Badge>
                    )}

                    {sermon.description && (
                      <p className="mb-3 line-clamp-2 text-muted-foreground text-sm">
                        {sermon.description}
                      </p>
                    )}

                    <div className="flex gap-2">
                      {sermon.video_url && (
                        <Badge className="text-xs" variant="secondary">
                          <Video className="mr-1 h-3 w-3" />
                          Video
                        </Badge>
                      )}
                      {sermon.audio_url && (
                        <Badge className="text-xs" variant="secondary">
                          <Music className="mr-1 h-3 w-3" />
                          Audio
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex gap-2">
                    <Button
                      onClick={() => handleEdit(sermon)}
                      size="sm"
                      variant="outline"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDeleteClick(sermon.id)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog
        onOpenChange={(open) => !open && setDeleteId(null)}
        open={!!deleteId}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              sermon.
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
