import { useState } from 'react';
import { useSermons, useSermonMutations, type Sermon, type SermonInsert } from '@/hooks/useChurchData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Video, Music, BookOpen, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
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

export function AdminSermons() {
  const { data: sermons, isLoading } = useSermons();
  const { createSermon, updateSermon, deleteSermon } = useSermonMutations();
  const [isOpen, setIsOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<SermonInsert>({
    title: '',
    description: '',
    speaker: '',
    sermon_date: '',
    video_url: '',
    audio_url: '',
    scripture_reference: '',
    series_name: '',
    thumbnail_url: '',
    duration_minutes: null,
    is_featured: false,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      speaker: '',
      sermon_date: '',
      video_url: '',
      audio_url: '',
      scripture_reference: '',
      series_name: '',
      thumbnail_url: '',
      duration_minutes: null,
      is_featured: false,
    });
    setEditingSermon(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.speaker || !formData.sermon_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingSermon) {
        await updateSermon.mutateAsync({ id: editingSermon.id, ...formData });
        toast.success('Sermon updated successfully');
      } else {
        await createSermon.mutateAsync(formData);
        toast.success('Sermon created successfully');
      }
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast.error(editingSermon ? 'Failed to update sermon' : 'Failed to create sermon');
    }
  };

  const handleEdit = (sermon: Sermon) => {
    setFormData({
      title: sermon.title,
      description: sermon.description || '',
      speaker: sermon.speaker,
      sermon_date: sermon.sermon_date,
      video_url: sermon.video_url || '',
      audio_url: sermon.audio_url || '',
      scripture_reference: sermon.scripture_reference || '',
      series_name: sermon.series_name || '',
      thumbnail_url: sermon.thumbnail_url || '',
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
      toast.success('Sermon deleted successfully');
    } catch (error) {
      toast.error('Failed to delete sermon');
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold">Sermons</h2>
          <p className="text-muted-foreground">Manage your church sermons and messages</p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Sermon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSermon ? 'Edit Sermon' : 'Add New Sermon'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="speaker">Speaker *</Label>
                  <Input
                    id="speaker"
                    value={formData.speaker}
                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sermon_date">Sermon Date *</Label>
                  <Input
                    id="sermon_date"
                    type="date"
                    value={formData.sermon_date}
                    onChange={(e) => setFormData({ ...formData, sermon_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    value={formData.duration_minutes || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      duration_minutes: e.target.value ? parseInt(e.target.value) : null
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scripture_reference">Scripture Reference</Label>
                  <Input
                    id="scripture_reference"
                    value={formData.scripture_reference}
                    onChange={(e) => setFormData({ ...formData, scripture_reference: e.target.value })}
                    placeholder="e.g., John 3:16"
                  />
                </div>
                <div>
                  <Label htmlFor="series_name">Series Name</Label>
                  <Input
                    id="series_name"
                    value={formData.series_name}
                    onChange={(e) => setFormData({ ...formData, series_name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="audio_url">Audio URL</Label>
                  <Input
                    id="audio_url"
                    value={formData.audio_url}
                    onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="thumbnail_url">Thumbnail Image URL</Label>
                  <Input
                    id="thumbnail_url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured sermon</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={createSermon.isPending || updateSermon.isPending}>
                  {editingSermon ? 'Update Sermon' : 'Add Sermon'}
                </Button>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
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
            <CardContent className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No sermons added yet</p>
            </CardContent>
          </Card>
        ) : (
          sermons?.map((sermon) => (
            <Card key={sermon.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{sermon.title}</h3>
                      {sermon.is_featured && (
                        <Badge variant="default" className="bg-church-gold text-church-navy">
                          Featured
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(sermon.sermon_date), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {sermon.speaker}
                      </div>
                      {sermon.duration_minutes && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {sermon.duration_minutes} min
                        </div>
                      )}
                      {sermon.scripture_reference && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {sermon.scripture_reference}
                        </div>
                      )}
                    </div>

                    {sermon.series_name && (
                      <Badge variant="outline" className="mb-2">
                        {sermon.series_name}
                      </Badge>
                    )}

                    {sermon.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {sermon.description}
                      </p>
                    )}

                    <div className="flex gap-2">
                      {sermon.video_url && (
                        <Badge variant="secondary" className="text-xs">
                          <Video className="w-3 h-3 mr-1" />
                          Video
                        </Badge>
                      )}
                      {sermon.audio_url && (
                        <Badge variant="secondary" className="text-xs">
                          <Music className="w-3 h-3 mr-1" />
                          Audio
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(sermon)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(sermon.id)}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the sermon.
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
