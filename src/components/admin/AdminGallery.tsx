import { useState } from 'react';
import { useGallery, useGalleryMutations } from '@/hooks/useChurchData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function AdminGallery() {
    const { data: images, isLoading } = useGallery();
    const { uploadImage, deleteImage } = useGalleryMutations();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const resetForm = () => {
        setTitle('');
        setDescription('');
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
        if (!selectedFile || !title) return;

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
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(filePath, selectedFile);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(filePath);

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
            console.error('Error uploading image:', error);
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
            const urlParts = imageUrl.split('/');
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
        return <div className="flex items-center justify-center p-8">Loading gallery...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-display font-bold">Gallery Management</h2>
                    <p className="text-muted-foreground">Manage your church photo gallery (Max 15 images)</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button disabled={(images?.length || 0) >= 15}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Image
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Image</DialogTitle>
                            <DialogDescription>
                                Upload a new photo to the gallery. {15 - (images?.length || 0)} slots remaining.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Sunday Worship"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief description of the photo"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Image File</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isUploading}>
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        'Upload'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images?.map((image) => (
                    <Card key={image.id} className="overflow-hidden group">
                        <div className="relative aspect-video">
                            <img
                                src={image.image_url}
                                alt={image.title}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(image.id, image.image_url)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold truncate">{image.title}</h3>
                            {image.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {image.description}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {(!images || images.length === 0) && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
                        <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground">No images yet</h3>
                        <p className="text-sm text-muted-foreground">Upload photos to showcase your church community</p>
                    </div>
                )}
            </div>
        </div>
    );
}
