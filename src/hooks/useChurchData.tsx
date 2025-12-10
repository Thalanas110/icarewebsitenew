import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Types
export interface Ministry {
  id: string;
  name: string;
  description: string | null;
  leader: string | null;
  meeting_time: string | null;
  image_url: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export type MinistryInsert = Omit<Ministry, 'id' | 'created_at' | 'updated_at'> & { id?: string };

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  image_url: string | null;
  status: 'scheduled' | 'postponed' | 'done';
  created_at: string;
  updated_at: string;
}

export type EventInsert = Omit<Event, 'id' | 'created_at' | 'updated_at'> & { id?: string; status?: 'scheduled' | 'postponed' | 'done'; };

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

export type ServiceTimeInsert = Omit<ServiceTime, 'id' | 'created_at' | 'updated_at'> & { id?: string };

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

export type SermonInsert = Omit<Sermon, 'id' | 'created_at' | 'updated_at'> & { id?: string };

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
  office_hours: string | null;
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

export type GalleryImageInsert = Omit<GalleryImage, 'id' | 'created_at'> & { id?: string };

// Ministries
export function useMinistries() {
  return useQuery({
    queryKey: ['ministries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ministries')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as Ministry[];
    },
  });
}

export function useMinistryMutations() {
  const queryClient = useQueryClient();

  const createMinistry = useMutation({
    mutationFn: async (ministry: MinistryInsert) => {
      const { data, error } = await supabase.from('ministries').insert([ministry]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ministries'] }),
  });

  const updateMinistry = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Ministry> & { id: string }) => {
      const { data, error } = await supabase.from('ministries').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ministries'] }),
  });

  const deleteMinistry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('ministries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ministries'] }),
  });

  return { createMinistry, updateMinistry, deleteMinistry };
}

// Events
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      if (error) throw error;
      return data as Event[];
    },
  });
}

export function useEventMutations() {
  const queryClient = useQueryClient();

  const createEvent = useMutation({
    mutationFn: async (event: EventInsert) => {
      const { data, error } = await supabase.from('events').insert([event]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Event> & { id: string }) => {
      const { data, error } = await supabase.from('events').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });

  return { createEvent, updateEvent, deleteEvent };
}

// Service Times
export function useServiceTimes() {
  return useQuery({
    queryKey: ['service_times'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_times')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as ServiceTime[];
    },
  });
}

export function useServiceTimeMutations() {
  const queryClient = useQueryClient();

  const createServiceTime = useMutation({
    mutationFn: async (serviceTime: ServiceTimeInsert) => {
      const { data, error } = await supabase.from('service_times').insert([serviceTime]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service_times'] }),
  });

  const updateServiceTime = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServiceTime> & { id: string }) => {
      const { data, error } = await supabase.from('service_times').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service_times'] }),
  });

  const deleteServiceTime = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('service_times').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service_times'] }),
  });

  const updateSortOrder = useMutation({
    mutationFn: async (items: Array<{ id: string; sort_order: number }>) => {
      const updates = items.map(item =>
        supabase.from('service_times').update({ sort_order: item.sort_order }).eq('id', item.id)
      );
      const results = await Promise.all(updates.map(u => u));
      const errors = results.filter(r => r.error);
      if (errors.length > 0) throw errors[0].error;
      return items;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service_times'] }),
  });

  return { createServiceTime, updateServiceTime, deleteServiceTime, updateSortOrder };
}

// Church Info
export function useChurchInfo() {
  return useQuery({
    queryKey: ['church_info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('church_info')
        .select('*')
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
    mutationFn: async ({ id, ...updates }: Partial<ChurchInfo> & { id: string }) => {
      const { data, error } = await supabase.from('church_info').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['church_info'] }),
  });
}

// Sermons
export function useSermons() {
  return useQuery({
    queryKey: ['sermons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('sermon_date', { ascending: false });
      if (error) throw error;
      return data as Sermon[];
    },
  });
}

export function useLatestSermon() {
  return useQuery({
    queryKey: ['latest_sermon'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('sermon_date', { ascending: false })
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
      const { data, error } = await supabase.from('sermons').insert([sermon]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sermons'] });
      queryClient.invalidateQueries({ queryKey: ['latest_sermon'] });
    },
  });

  const updateSermon = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Sermon> & { id: string }) => {
      const { data, error } = await supabase.from('sermons').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sermons'] });
      queryClient.invalidateQueries({ queryKey: ['latest_sermon'] });
    },
  });

  const deleteSermon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sermons').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sermons'] });
      queryClient.invalidateQueries({ queryKey: ['latest_sermon'] });
    },
  });

  return { createSermon, updateSermon, deleteSermon };
}

// Gallery
export function useGallery() {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as GalleryImage[];
    },
  });
}

export function useGalleryMutations() {
  const queryClient = useQueryClient();

  const uploadImage = useMutation({
    mutationFn: async (image: GalleryImageInsert) => {
      const { data, error } = await supabase.from('gallery_images').insert([image]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] }),
  });

  const deleteImage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] }),
  });

  return { uploadImage, deleteImage };
}

