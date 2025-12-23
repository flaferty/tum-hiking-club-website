import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useHike } from '@/hooks/useHikes';
import { davHuts } from '@/lib/mockData';
import { DAVHut } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mountain, 
  Upload, 
  Plus,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';

interface WaypointInput {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  type: 'start' | 'end' | 'overnight_stop';
  day_number: string;
  isExisting?: boolean;
}

export default function EditHike() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { data: hike, isLoading: hikeLoading } = useHike(id);
  
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    end_date: '',
    duration: '',
    difficulty: '',
    max_participants: '20',
    distance: '',
    elevation: '',
    location_name: '',
    location_lat: '',
    location_lng: '',
    description: '',
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>([]);
  const [waypoints, setWaypoints] = useState<WaypointInput[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (hike) {
      setFormData({
        name: hike.name,
        date: hike.date,
        end_date: hike.end_date || '',
        duration: hike.duration,
        difficulty: hike.difficulty,
        max_participants: hike.max_participants.toString(),
        distance: hike.distance.toString(),
        elevation: hike.elevation.toString(),
        location_name: hike.location_name,
        location_lat: hike.location_lat.toString(),
        location_lng: hike.location_lng.toString(),
        description: hike.description || '',
      });
      
      if (hike.images) {
        setExistingImages(hike.images.map(img => ({ id: img.id, url: img.image_url })));
      }
      
      if (hike.waypoints) {
        setWaypoints(hike.waypoints.map(wp => ({
          id: wp.id,
          name: wp.name,
          latitude: wp.latitude.toString(),
          longitude: wp.longitude.toString(),
          type: wp.type,
          day_number: wp.day_number?.toString() || '',
          isExisting: true,
        })));
      }
    }
  }, [hike]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = files.length + images.length + existingImages.length;
    if (totalImages > 5) {
      toast({
        title: 'Too many images',
        description: 'Maximum 5 images allowed.',
        variant: 'destructive'
      });
      return;
    }
    
    setImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) return;
    
    const totalImages = files.length + images.length + existingImages.length;
    if (totalImages > 5) {
      toast({
        title: 'Too many images',
        description: 'Maximum 5 images allowed.',
        variant: 'destructive'
      });
      return;
    }
    
    setImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [images.length, existingImages.length, toast]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const addWaypoint = () => {
    setWaypoints(prev => [...prev, {
      id: crypto.randomUUID(),
      name: '',
      latitude: '',
      longitude: '',
      type: 'overnight_stop',
      day_number: '',
      isExisting: false,
    }]);
  };

  const updateWaypoint = (id: string, field: keyof WaypointInput, value: string) => {
    setWaypoints(prev => prev.map(wp => 
      wp.id === id ? { ...wp, [field]: value } : wp
    ));
  };

  const selectHut = (id: string, hut: DAVHut) => {
    setWaypoints(prev => prev.map(wp => 
      wp.id === id ? { 
        ...wp, 
        name: hut.name,
        latitude: hut.latitude.toString(),
        longitude: hut.longitude.toString()
      } : wp
    ));
  };

  const removeWaypoint = (id: string) => {
    setWaypoints(prev => prev.filter(wp => wp.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    
    setIsSubmitting(true);

    try {
      // Upload new images
      const uploadedImageUrls: string[] = [];
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('hike-images')
          .upload(fileName, image);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('hike-images')
          .getPublicUrl(fileName);
        
        uploadedImageUrls.push(urlData.publicUrl);
      }

      // Update hike
      const allImageUrls = [...existingImages.map(img => img.url), ...uploadedImageUrls];
      
      const { error: hikeError } = await supabase
        .from('hikes')
        .update({
          name: formData.name,
          date: formData.date,
          end_date: formData.end_date || null,
          duration: formData.duration,
          difficulty: formData.difficulty,
          max_participants: parseInt(formData.max_participants),
          distance: parseFloat(formData.distance),
          elevation: parseInt(formData.elevation),
          location_name: formData.location_name,
          location_lat: parseFloat(formData.location_lat) || 0,
          location_lng: parseFloat(formData.location_lng) || 0,
          description: formData.description || null,
          image_url: allImageUrls[0] || null,
        })
        .eq('id', id);

      if (hikeError) throw hikeError;

      // Delete removed images from database
      const currentImageIds = existingImages.map(img => img.id);
      if (hike?.images) {
        const removedImageIds = hike.images
          .filter(img => !currentImageIds.includes(img.id))
          .map(img => img.id);
        
        if (removedImageIds.length > 0) {
          await supabase.from('hike_images').delete().in('id', removedImageIds);
        }
      }

      // Insert new images
      if (uploadedImageUrls.length > 0) {
        const newImageRecords = uploadedImageUrls.map((url, index) => ({
          hike_id: id,
          image_url: url,
          display_order: existingImages.length + index,
        }));

        const { error: imagesError } = await supabase
          .from('hike_images')
          .insert(newImageRecords);

        if (imagesError) throw imagesError;
      }

      // Handle waypoints - delete existing and recreate
      await supabase.from('waypoints').delete().eq('hike_id', id);
      
      if (waypoints.length > 0) {
        const waypointRecords = waypoints
          .filter(wp => wp.name && wp.latitude && wp.longitude)
          .map(wp => ({
            hike_id: id,
            name: wp.name,
            latitude: parseFloat(wp.latitude),
            longitude: parseFloat(wp.longitude),
            type: wp.type,
            day_number: wp.day_number ? parseInt(wp.day_number) : null,
          }));

        if (waypointRecords.length > 0) {
          const { error: wpError } = await supabase
            .from('waypoints')
            .insert(waypointRecords);

          if (wpError) throw wpError;
        }
      }

      toast({
        title: 'Hike updated!',
        description: 'Your changes have been saved.',
      });
      
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Error updating hike:', error);
      toast({
        title: 'Error updating hike',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || hikeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-2xl">
              <Mountain className="h-6 w-6 text-primary" />
              Edit Hike
            </CardTitle>
            <p className="text-muted-foreground">Update the hike details</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Photos */}
              <div>
                <h3 className="mb-3 font-heading font-semibold">Photos</h3>
                
                {/* Existing images */}
                {existingImages.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {existingImages.map((img) => (
                      <div key={img.id} className="relative">
                        <img 
                          src={img.url} 
                          alt="Hike"
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img.id)}
                          className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div 
                  className="cursor-pointer rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary/50"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">Drop your photos here or click to browse</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB each</p>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                
                {imagePreview.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {imagePreview.map((src, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={src} 
                          alt={`Preview ${index + 1}`}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div>
                <h3 className="mb-3 font-heading font-semibold">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Hike Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Zugspitze Summit Trail"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="date">Start Date *</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_date">End Date (multi-day)</Label>
                      <Input
                        id="end_date"
                        name="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration *</Label>
                      <Input
                        id="duration"
                        name="duration"
                        placeholder="e.g., 6-8 hours"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hike Details */}
              <div>
                <h3 className="mb-3 font-heading font-semibold">Hike Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <Select 
                      value={formData.difficulty} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="max_participants">Max Participants *</Label>
                    <Input
                      id="max_participants"
                      name="max_participants"
                      type="number"
                      min="1"
                      value={formData.max_participants}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="distance">Distance (km) *</Label>
                    <Input
                      id="distance"
                      name="distance"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 12.5"
                      value={formData.distance}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="elevation">Elevation Gain (m) *</Label>
                    <Input
                      id="elevation"
                      name="elevation"
                      type="number"
                      placeholder="e.g., 1200"
                      value={formData.elevation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="mb-3 font-heading font-semibold">Location</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location_name">Location Name *</Label>
                    <Input
                      id="location_name"
                      name="location_name"
                      placeholder="e.g., Garmisch-Partenkirchen"
                      value={formData.location_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="location_lat">Latitude</Label>
                      <Input
                        id="location_lat"
                        name="location_lat"
                        type="number"
                        step="any"
                        placeholder="e.g., 47.4210"
                        value={formData.location_lat}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location_lng">Longitude</Label>
                      <Input
                        id="location_lng"
                        name="location_lng"
                        type="number"
                        step="any"
                        placeholder="e.g., 10.9853"
                        value={formData.location_lng}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Overnight Stops */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-heading font-semibold">Overnight Stops</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addWaypoint} className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add Stop
                  </Button>
                </div>
                
                {waypoints.length > 0 ? (
                  <div className="space-y-4">
                    {waypoints.map((waypoint) => (
                      <Card key={waypoint.id} className="relative">
                        <CardContent className="pt-4">
                          <button
                            type="button"
                            onClick={() => removeWaypoint(waypoint.id)}
                            className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                              <Label>Select DAV Hut</Label>
                              <Select onValueChange={(hutId) => {
                                const hut = davHuts.find(h => h.id === hutId);
                                if (hut) selectHut(waypoint.id, hut);
                              }}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a hut..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {davHuts.map(hut => (
                                    <SelectItem key={hut.id} value={hut.id}>
                                      {hut.name} ({hut.elevation}m) - {hut.region}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Name</Label>
                              <Input
                                value={waypoint.name}
                                onChange={(e) => updateWaypoint(waypoint.id, 'name', e.target.value)}
                                placeholder="Stop name"
                              />
                            </div>
                            
                            <div>
                              <Label>Day Number</Label>
                              <Input
                                type="number"
                                min="1"
                                value={waypoint.day_number}
                                onChange={(e) => updateWaypoint(waypoint.id, 'day_number', e.target.value)}
                                placeholder="e.g., 1"
                              />
                            </div>
                            
                            <div>
                              <Label>Latitude</Label>
                              <Input
                                type="number"
                                step="any"
                                value={waypoint.latitude}
                                onChange={(e) => updateWaypoint(waypoint.id, 'latitude', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <Label>Longitude</Label>
                              <Input
                                type="number"
                                step="any"
                                value={waypoint.longitude}
                                onChange={(e) => updateWaypoint(waypoint.id, 'longitude', e.target.value)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add overnight stops for multi-day hikes.
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-3 font-heading font-semibold">Description</h3>
                <Textarea
                  name="description"
                  placeholder="Describe the hike, what to expect, what to bring..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
