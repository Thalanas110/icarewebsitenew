import { Image as ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useGallery, useGalleryMutations } from "@/hooks/useChurchData";
import { supabase } from "@/integrations/supabase/client";

export function AdminGallery() {
  const { data: images, isLoading } = useGallery();
  const { uploadImage, deleteImage } = useGalleryMutations();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setIsUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(selectedFile && title)) return;

    if ((images?.length || 0) >= 15) {
      toast({
        title: "Limit Reached",
        description: "You can only upload up to 15 images to the gallery.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // 1. Upload file to Supabase Storage
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("gallery").getPublicUrl(filePath);

      // 3. Save to Database
      await uploadImage.mutateAsync({
        title,
        description: description || null,
        image_url: publicUrl,
      });

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      // Extract filename from URL to delete from storage
      // This is a simplified approach; ideally we store the storage path
      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];

      await deleteImage.mutateAsync(id);

      // Attempt to delete from storage as well (optional but good for cleanup)
      // await supabase.storage.from('gallery').remove([fileName]);

      toast({
        title: "Deleted",
        description: "Image removed from gallery",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading gallery...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold font-display text-2xl">
            Gallery Management
          </h2>
          <p className="text-muted-foreground">
            Manage your church photo gallery (Max 15 images)
          </p>
        </div>
        <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={(images?.length || 0) >= 15}>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Image</DialogTitle>
              <DialogDescription>
                Upload a new photo to the gallery. {15 - (images?.length || 0)}{" "}
                slots remaining.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleUpload}>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Sunday Worship"
                  required
                  value={title}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the photo"
                  value={description}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image File</Label>
                <Input
                  accept="image/*"
                  id="image"
                  onChange={handleFileChange}
                  required
                  type="file"
                />
              </div>
              <DialogFooter>
                <Button disabled={isUploading} type="submit">
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {images?.map((image) => (
          <Card className="group overflow-hidden" key={image.id}>
            <div className="relative aspect-video">
              <img
                alt={image.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                src={image.image_url}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  onClick={() => handleDelete(image.id, image.image_url)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="truncate font-semibold">{image.title}</h3>
              {image.description && (
                <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
                  {image.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        {(!images || images.length === 0) && (
          <div className="col-span-full rounded-lg border-2 border-dashed py-12 text-center">
            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="font-medium text-lg text-muted-foreground">
              No images yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Upload photos to showcase your church community
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
