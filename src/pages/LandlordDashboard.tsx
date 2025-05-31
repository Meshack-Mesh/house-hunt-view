// Import necessary modules and components
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Home, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/types/Property';
import { PropertySubscriptionModal } from '@/components/PropertySubscriptionModal';

const LandlordDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    period: 'per month',
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    location: '',
    latitude: '',
    longitude: '',
    features: '',
    status: 'available'
  });

  // Image upload state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our Property interface
      const transformedProperties: Property[] = (data || []).map(property => ({
        id: property.id,
        title: property.title,
        description: property.description || '',
        price: property.price,
        period: property.period,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        location: property.location,
        coordinates: property.coordinates as { lat: number; lng: number } | null,
        features: property.features || [],
        status: property.status || 'available',
        image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop"
      }));

      setProperties(transformedProperties);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = () => {
    setShowSubscriptionModal(true);
  };

  const handleSubscriptionSuccess = () => {
    setShowSubscriptionModal(false);
    setShowAddForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validImages: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (
        (file.type === 'image/png' || file.type === 'image/jpeg') &&
        file.size <= 10 * 1024 * 1024
      ) {
        validImages.push(file);
      } else {
        toast({
          title: "Invalid File",
          description: `${file.name} is not a valid PNG/JPEG image or exceeds 10MB.`,
          variant: "destructive",
        });
      }
    }

    if (validImages.length > 0) {
      setSelectedImages(validImages);
    }
  };

  const uploadImages = async (propertyId: string) => {
    const uploadedImageUrls: string[] = [];

    for (const image of selectedImages) {
      const fileExt = image.name.split('.').pop();
      const filePath = `properties/${propertyId}/${Date.now()}_${image.name}`;

      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(filePath, image);

      if (error) {
        toast({
          title: "Upload Error",
          description: `Failed to upload ${image.name}`,
          variant: "destructive",
        });
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      if (publicUrlData.publicUrl) {
        uploadedImageUrls.push(publicUrlData.publicUrl);

        // Insert into property_images table
        await supabase.from('property_images').insert({
          property_id: propertyId,
          image_url: publicUrlData.publicUrl,
        });
      }
    }

    return uploadedImageUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        period: formData.period,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: formData.area,
        location: formData.location,
        coordinates: formData.latitude && formData.longitude ? {
          lat: parseFloat(formData.latitude),
          lng: parseFloat(formData.longitude)
        } : null,
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
        status: formData.status,
        landlord_id: user.id
      };

      let propertyId = editingProperty?.id;

      if (editingProperty) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Property updated successfully",
        });
      } else {
        const { data, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select()
          .single();

        if (error) throw error;

        propertyId = data.id;

        toast({
          title: "Success",
          description: "Property added successfully",
        });
      }

      // Upload images if any
      if (selectedImages.length > 0 && propertyId) {
        await uploadImages(propertyId);
      }

      // Reset form and refresh data
      resetForm();
      fetchProperties();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      price: property.price.toString(),
      period: property.period,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area,
      location: property.location,
      latitude: property.coordinates?.lat.toString() || '',
      longitude: property.coordinates?.lng.toString() || '',
      features: property.features.join(', '),
      status: property.status || 'available'
    });
    setShowAddForm(true);
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property deleted successfully",
      });

      fetchProperties();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      period: 'per month',
      bedrooms: '1',
      bathrooms: '1',
      area: '',
      location: '',
      latitude: '',
      longitude: '',
      features: '',
      status: 'available'
    });
    setSelectedImages([]);
    setShowAddForm(false);
    setEditingProperty(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Landlord Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.full_name || profile?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
              <p className="text-xs text-muted-foreground">All listed properties</p>
            </CardContent>
          </Card>

          {/* You can add more stat cards here if needed */}
        </div>

        {/* Add/Edit Property Form */}
        {showAddForm && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Period</Label>
                  <Input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Bedrooms</Label>
                  <Input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Bathrooms</Label>
                  <Input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Area (sq ft)</Label>
                  <Input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Latitude</Label>
                  <Input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Features (comma separated)</Label>
                  <Input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Input
                    type="text"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <Label>Upload Property Images (at least 3, PNG/JPEG, max 10MB each)</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                />
                {selectedImages.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">{selectedImages.length} image(s) selected</p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button type="submit">{editingProperty ? 'Update Property' : 'Add Property'}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        {/* Add Button */}
        {!showAddForm && (
          <div className="mb-6">
            <Button onClick={handleAddProperty}>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </div>
        )}

        {/* Property Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <Card key={property.id}>
              <img src={property.image} alt={property.title} className="w-full h-48 object-cover rounded-t" />
              <CardContent className="p-4">
                <CardTitle className="text-xl">{property.title}</CardTitle>
                <CardDescription className="text-gray-600 mb-2">{property.location}</CardDescription>
                <p className="text-gray-800 font-semibold">{property.price} {property.period}</p>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" onClick={() => handleEdit(property)}><Edit className="w-4 h-4 mr-1" /> Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(property.id)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <PropertySubscriptionModal
          onSuccess={handleSubscriptionSuccess}
          onCancel={() => setShowSubscriptionModal(false)}
        />
      )}
    </div>
  );
};

export default LandlordDashboard;
