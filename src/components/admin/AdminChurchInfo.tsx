import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type Pastor,
  type PastorInsert,
  useChurchInfo,
  useChurchInfoMutation,
  usePastorMutations,
  usePastors,
} from "@/hooks/useChurchData";
import { ImageUpload } from "./ImageUpload";

export function AdminChurchInfo() {
  const { data: churchInfo, isLoading } = useChurchInfo();
  const mutation = useChurchInfoMutation();
  const { data: pastors, isLoading: pastorsLoading } = usePastors();
  const { createPastor, updatePastor, deletePastor } = usePastorMutations();

  const [form, setForm] = useState({
    church_name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    office_hours: "",
  });

  const [pastorForm, setPastorForm] = useState<PastorInsert>({
    name: "",
    email: "",
    phone: "",
    title: "Pastor",
    bio: "",
    image_url: "",
    sort_order: 0,
  });

  const [editingPastor, setEditingPastor] = useState<Pastor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sync form with church info when loaded
  useEffect(() => {
    if (churchInfo) {
      setForm({
        church_name: churchInfo.church_name || "",
        address: churchInfo.address || "",
        city: churchInfo.city || "",
        state: churchInfo.state || "",
        zip: churchInfo.zip || "",
        phone: churchInfo.phone || "",
        email: churchInfo.email || "",
        office_hours: churchInfo.office_hours || "",
      });
    }
  }, [churchInfo]);

  const handleSaveChurchInfo = async () => {
    if (!churchInfo?.id) return;
    try {
      await mutation.mutateAsync({ id: churchInfo.id, ...form });
      toast.success("Church info updated");
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An error occurred";
      toast.error(errorMessage);
    }
  };

  const resetPastorForm = () => {
    setPastorForm({
      name: "",
      email: "",
      phone: "",
      title: "Pastor",
      bio: "",
      image_url: "",
      sort_order: pastors?.length || 0,
    });
    setEditingPastor(null);
  };

  const handleOpenDialog = (pastor?: Pastor) => {
    if (pastor) {
      setEditingPastor(pastor);
      setPastorForm({
        name: pastor.name,
        email: pastor.email || "",
        phone: pastor.phone || "",
        title: pastor.title || "Pastor",
        bio: pastor.bio || "",
        image_url: pastor.image_url || "",
        sort_order: pastor.sort_order || 0,
      });
    } else {
      resetPastorForm();
    }
    setDialogOpen(true);
  };

  const handleSavePastor = async () => {
    if (!pastorForm.name.trim()) {
      toast.error("Pastor name is required");
      return;
    }

    try {
      if (editingPastor) {
        await updatePastor.mutateAsync({
          id: editingPastor.id,
          ...pastorForm,
        });
        toast.success("Pastor updated");
      } else {
        await createPastor.mutateAsync(pastorForm);
        toast.success("Pastor added");
      }
      setDialogOpen(false);
      resetPastorForm();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An error occurred";
      toast.error(errorMessage);
    }
  };

  const handleDeletePastor = async (id: string) => {
    try {
      await deletePastor.mutateAsync(id);
      toast.success("Pastor deleted");
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An error occurred";
      toast.error(errorMessage);
    }
  };

  if (isLoading || pastorsLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-2xl">Church Information</h2>

      {/* Pastors Management */}
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle>Pastors</CardTitle>
          <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Pastor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPastor ? "Edit Pastor" : "Add Pastor"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="font-medium text-sm">Name *</label>
                  <Input
                    onChange={(e) =>
                      setPastorForm({ ...pastorForm, name: e.target.value })
                    }
                    placeholder="Pastor Name"
                    value={pastorForm.name}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-medium text-sm">Title</label>
                  <Input
                    onChange={(e) =>
                      setPastorForm({ ...pastorForm, title: e.target.value })
                    }
                    placeholder="e.g., Senior Pastor, Associate Pastor"
                    value={pastorForm.title || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-medium text-sm">Email</label>
                  <Input
                    onChange={(e) =>
                      setPastorForm({ ...pastorForm, email: e.target.value })
                    }
                    placeholder="pastor@church.com"
                    type="email"
                    value={pastorForm.email || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-medium text-sm">Phone</label>
                  <Input
                    onChange={(e) =>
                      setPastorForm({ ...pastorForm, phone: e.target.value })
                    }
                    placeholder="Phone Number"
                    value={pastorForm.phone || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-medium text-sm">Bio</label>
                  <Textarea
                    onChange={(e) =>
                      setPastorForm({ ...pastorForm, bio: e.target.value })
                    }
                    placeholder="Short biography..."
                    rows={3}
                    value={pastorForm.bio || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-medium text-sm">Profile Image</label>
                  <ImageUpload
                    folder="pastors"
                    onChange={(url) =>
                      setPastorForm({ ...pastorForm, image_url: url })
                    }
                    value={pastorForm.image_url || ""}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  disabled={createPastor.isPending || updatePastor.isPending}
                  onClick={handleSavePastor}
                >
                  {editingPastor ? "Save Changes" : "Add Pastor"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {!pastors || pastors.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No pastors added yet. Click "Add Pastor" to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {pastors.map((pastor) => (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                  key={pastor.id}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      {pastor.image_url ? (
                        <img
                          alt={pastor.name}
                          className="h-12 w-12 rounded-full object-cover"
                          src={pastor.image_url}
                        />
                      ) : (
                        <span className="font-bold text-lg text-primary">
                          {pastor.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-medium">{pastor.name}</h4>
                      {pastor.title && (
                        <p className="truncate text-muted-foreground text-sm">
                          {pastor.title}
                        </p>
                      )}
                      {pastor.email && (
                        <p className="truncate text-muted-foreground text-xs">
                          {pastor.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      onClick={() => handleOpenDialog(pastor)}
                      size="icon"
                      variant="ghost"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeletePastor(pastor.id)}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Church Details */}
      <Card>
        <CardHeader>
          <CardTitle>Church Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h5>Church Name</h5>
          <Input
            onChange={(e) => setForm({ ...form, church_name: e.target.value })}
            placeholder="Church Name"
            value={form.church_name}
          />
          <h5>Contact Information</h5>
          <Input
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone"
            value={form.phone}
          />
          <h5>Email</h5>
          <Input
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            value={form.email}
          />
          <h5>Office Hours</h5>
          <Input
            onChange={(e) => setForm({ ...form, office_hours: e.target.value })}
            placeholder="Office Hours"
            value={form.office_hours}
          />
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h5>Address</h5>
            <Input
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Address"
              value={form.address}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h5>City</h5>
              <Input
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="City"
                value={form.city}
              />
            </div>
            <div className="space-y-2">
              <h5>State</h5>
              <Input
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="State"
                value={form.state}
              />
            </div>
            <div className="space-y-2">
              <h5>Zip</h5>
              <Input
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                placeholder="Zip"
                value={form.zip}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveChurchInfo} size="lg">
        Save All Changes
      </Button>
    </div>
  );
}
