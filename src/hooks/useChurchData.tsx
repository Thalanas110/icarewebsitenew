import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/hooks/useLogs";
import { LOG_ACTION_TYPES } from "@/integrations/supabase/loggingTypes";
import { useMutation, useQuery, useQueryClient } from "./simple-query-hooks";

// Types
export interface Ministry {
  id: string;
  name: string;
  description: string | null;
  leader: string | null;
  meeting_time: string | null;
  image_url: string | null;
  sort_order: number | null;
  category: "ministry" | "outreach";
  created_at: string;
  updated_at: string;
}

export type MinistryInsert = Omit<
  Ministry,
  "id" | "created_at" | "updated_at"
> & { id?: string };

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  image_url: string | null;
  status: "scheduled" | "postponed" | "done";
  created_at: string;
  updated_at: string;
}

export type EventInsert = Omit<Event, "id" | "created_at" | "updated_at"> & {
  id?: string;
  status?: "scheduled" | "postponed" | "done";
};

export interface ServiceTime {
  id: string;
  name: string;
  time: string;
  description: string | null;
  audience: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export type ServiceTimeInsert = Omit<
  ServiceTime,
  "id" | "created_at" | "updated_at"
> & { id?: string };

export interface Sermon {
  id: string;
  title: string;
  description: string | null;
  speaker: string;
  sermon_date: string;
  video_url: string | null;
  audio_url: string | null;
  scripture_reference: string | null;
  series_name: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export type SermonInsert = Omit<Sermon, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export interface ChurchInfo {
  id: string;
  pastor_name: string | null;
  pastor_email: string | null;
  pastor_phone: string | null;
  church_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  email: string | null;
  office_hours: string | null;
  fallback_stream_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  created_at: string;
}

export type GalleryImageInsert = Omit<GalleryImage, "id" | "created_at"> & {
  id?: string;
};

export interface Pastor {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  bio: string | null;
  image_url: string | null;
  facebook_url: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export type PastorInsert = Omit<Pastor, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

// Ministries
export function useMinistries() {
  return useQuery({
    queryKey: ["ministries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ministries")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Ministry[];
    },
  });
}

export function useMinistryMutations() {
  const queryClient = useQueryClient();

  const createMinistry = useMutation({
    mutationFn: async (ministry: MinistryInsert) => {
      const { data, error } = await supabase
        .from("ministries")
        .insert([ministry])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
      logActivity(LOG_ACTION_TYPES.CREATE_MINISTRY, {
        description: `Created ministry: ${data.name}`,
        entityType: "ministry",
        entityId: data.id,
      });
    },
  });

  const updateMinistry = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Ministry> & { id: string }) => {
      const { data, error } = await supabase
        .from("ministries")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
      logActivity(LOG_ACTION_TYPES.UPDATE_MINISTRY, {
        description: `Updated ministry: ${data.name}`,
        entityType: "ministry",
        entityId: data.id,
      });
    },
  });

  const deleteMinistry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ministries").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
      logActivity(LOG_ACTION_TYPES.DELETE_MINISTRY, {
        description: "Deleted a ministry",
        entityType: "ministry",
        entityId: id,
      });
    },
  });

  const updateSortOrder = useMutation({
    mutationFn: async (items: Array<{ id: string; sort_order: number }>) => {
      const updates = items.map((item) =>
        supabase
          .from("ministries")
          .update({ sort_order: item.sort_order })
          .eq("id", item.id)
      );
      const results = await Promise.all(updates.map((u) => u));
      const errors = results.filter((r) => r.error);
      if (errors.length > 0) throw errors[0].error;
      return items;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["ministries"] }),
  });

  return { createMinistry, updateMinistry, deleteMinistry, updateSortOrder };
}

// Events
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
      if (error) throw error;
      return data as Event[];
    },
  });
}

export function useEventMutations() {
  const queryClient = useQueryClient();

  const createEvent = useMutation({
    mutationFn: async (event: EventInsert) => {
      const { data, error } = await supabase
        .from("events")
        .insert([event])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      logActivity(LOG_ACTION_TYPES.CREATE_EVENT, {
        description: `Created event: ${data.title}`,
        entityType: "event",
        entityId: data.id,
      });
    },
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Event> & { id: string }) => {
      const { data, error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      logActivity(LOG_ACTION_TYPES.UPDATE_EVENT, {
        description: `Updated event: ${data.title}`,
        entityType: "event",
        entityId: data.id,
      });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      logActivity(LOG_ACTION_TYPES.DELETE_EVENT, {
        description: "Deleted an event",
        entityType: "event",
        entityId: id,
      });
    },
  });

  return { createEvent, updateEvent, deleteEvent };
}

// Service Times
export function useServiceTimes() {
  return useQuery({
    queryKey: ["service_times"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_times")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ServiceTime[];
    },
  });
}

export function useServiceTimeMutations() {
  const queryClient = useQueryClient();

  const createServiceTime = useMutation({
    mutationFn: async (serviceTime: ServiceTimeInsert) => {
      const { data, error } = await supabase
        .from("service_times")
        .insert([serviceTime])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["service_times"] });
      logActivity(LOG_ACTION_TYPES.CREATE_SERVICE_TIME, {
        description: `Created service time: ${data.name}`,
        entityType: "service_time",
        entityId: data.id,
      });
    },
  });

  const updateServiceTime = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<ServiceTime> & { id: string }) => {
      const { data, error } = await supabase
        .from("service_times")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["service_times"] });
      logActivity(LOG_ACTION_TYPES.UPDATE_SERVICE_TIME, {
        description: `Updated service time: ${data.name}`,
        entityType: "service_time",
        entityId: data.id,
      });
    },
  });

  const deleteServiceTime = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("service_times")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["service_times"] });
      logActivity(LOG_ACTION_TYPES.DELETE_SERVICE_TIME, {
        description: "Deleted a service time",
        entityType: "service_time",
        entityId: id,
      });
    },
  });

  const updateSortOrder = useMutation({
    mutationFn: async (items: Array<{ id: string; sort_order: number }>) => {
      const updates = items.map((item) =>
        supabase
          .from("service_times")
          .update({ sort_order: item.sort_order })
          .eq("id", item.id)
      );
      const results = await Promise.all(updates.map((u) => u));
      const errors = results.filter((r) => r.error);
      if (errors.length > 0) throw errors[0].error;
      return items;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["service_times"] }),
  });

  return {
    createServiceTime,
    updateServiceTime,
    deleteServiceTime,
    updateSortOrder,
  };
}

// Church Info
export function useChurchInfo() {
  return useQuery({
    queryKey: ["church_info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("church_info")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as ChurchInfo | null;
    },
  });
}

export function useChurchInfoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<ChurchInfo> & { id: string }) => {
      const { data, error } = await supabase
        .from("church_info")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["church_info"] });
      logActivity(LOG_ACTION_TYPES.UPDATE_CHURCH_INFO, {
        description: "Updated church information",
        entityType: "church_info",
      });
    },
  });
}

// Sermons
export function useSermons() {
  return useQuery({
    queryKey: ["sermons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sermons")
        .select("*")
        .order("sermon_date", { ascending: false });
      if (error) throw error;
      return data as Sermon[];
    },
  });
}

export function useLatestSermon() {
  return useQuery({
    queryKey: ["latest_sermon"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sermons")
        .select("*")
        .order("sermon_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as Sermon | null;
    },
  });
}

export function useSermonMutations() {
  const queryClient = useQueryClient();

  const createSermon = useMutation({
    mutationFn: async (sermon: SermonInsert) => {
      const { data, error } = await supabase
        .from("sermons")
        .insert([sermon])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
      queryClient.invalidateQueries({ queryKey: ["latest_sermon"] });
      logActivity(LOG_ACTION_TYPES.CREATE_SERMON, {
        description: `Created sermon: ${data.title}`,
        entityType: "sermon",
        entityId: data.id,
      });
    },
  });

  const updateSermon = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Sermon> & { id: string }) => {
      const { data, error } = await supabase
        .from("sermons")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
      queryClient.invalidateQueries({ queryKey: ["latest_sermon"] });
      logActivity(LOG_ACTION_TYPES.UPDATE_SERMON, {
        description: `Updated sermon: ${data.title}`,
        entityType: "sermon",
        entityId: data.id,
      });
    },
  });

  const deleteSermon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sermons").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
      queryClient.invalidateQueries({ queryKey: ["latest_sermon"] });
      logActivity(LOG_ACTION_TYPES.DELETE_SERMON, {
        description: "Deleted a sermon",
        entityType: "sermon",
        entityId: id,
      });
    },
  });

  return { createSermon, updateSermon, deleteSermon };
}

// Gallery
export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as GalleryImage[];
    },
  });
}

export function useGalleryMutations() {
  const queryClient = useQueryClient();

  const uploadImage = useMutation({
    mutationFn: async (image: GalleryImageInsert) => {
      const { data, error } = await supabase
        .from("gallery_images")
        .insert([image])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      logActivity(LOG_ACTION_TYPES.UPLOAD_IMAGE, {
        description: `Uploaded image: ${data.title}`,
        entityType: "gallery_image",
        entityId: data.id,
      });
    },
  });

  const deleteImage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      logActivity(LOG_ACTION_TYPES.DELETE_IMAGE, {
        description: "Deleted a gallery image",
        entityType: "gallery_image",
        entityId: id,
      });
    },
  });

  return { uploadImage, deleteImage };
}

// Pastors
export function usePastors() {
  return useQuery({
    queryKey: ["pastors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pastors")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Pastor[];
    },
  });
}

export function usePastorMutations() {
  const queryClient = useQueryClient();

  const createPastor = useMutation({
    mutationFn: async (pastor: PastorInsert) => {
      const { data, error } = await supabase
        .from("pastors")
        .insert([pastor])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pastors"] });
      logActivity(LOG_ACTION_TYPES.CREATE_PASTOR, {
        description: `Created pastor: ${data.name}`,
        entityType: "pastor",
        entityId: data.id,
      });
    },
  });

  const updatePastor = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Pastor> & { id: string }) => {
      const { data, error } = await supabase
        .from("pastors")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pastors"] });
      logActivity(LOG_ACTION_TYPES.UPDATE_PASTOR, {
        description: `Updated pastor: ${data.name}`,
        entityType: "pastor",
        entityId: data.id,
      });
    },
  });

  const deletePastor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pastors").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["pastors"] });
      logActivity(LOG_ACTION_TYPES.DELETE_PASTOR, {
        description: "Deleted a pastor",
        entityType: "pastor",
        entityId: id,
      });
    },
  });

  const updateSortOrder = useMutation({
    mutationFn: async (items: Array<{ id: string; sort_order: number }>) => {
      const updates = items.map((item) =>
        supabase
          .from("pastors")
          .update({ sort_order: item.sort_order })
          .eq("id", item.id)
      );
      const results = await Promise.all(updates.map((u) => u));
      const errors = results.filter((r) => r.error);
      if (errors.length > 0) throw errors[0].error;
      return items;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pastors"] }),
  });

  return { createPastor, updatePastor, deletePastor, updateSortOrder };
}
