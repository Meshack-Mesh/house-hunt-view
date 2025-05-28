
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MapPin, Bed, Bath, Square, Edit, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string; // Changed from number to string (UUID)
  title: string;
  description: string;
  price: number;
  period: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  location: string;
  coordinates: { lat: number; lng: number } | null; // Changed from Json to explicit type
  features: string[];
  status: string;
  created_at: string;
}

interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  is_primary: boolean;
}

const LandlordDashboard = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    period: 'per month',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    location: '',
    coordinates: { lat: 0, lng: 0 },
    features: '',
    status: 'available',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', profile?.id)
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
        created_at: property.created_at || ''
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

  const uploadImages = async (propertyId: string) => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile?.id}/${propertyId}/${Date.now()}-${i}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);

      // Save to property_images table
      await supabase
        .from('property_images')
        .insert({
          property_id: propertyId,
          image_url: publicUrl,
          is_primary: i === 0, // First image is primary
        });
    }

    setUploading(false);
    setSelectedFiles([]);
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        landlord_id: profile?.id,
      };

      let propertyId;

      if (editingProperty) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id);

        if (error) throw error;
        propertyId = editingProperty.id;
      } else {
        // Create new property
        const { data, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select()
          .single();

        if (error) throw error;
        propertyId = data.id;
      }

      // Upload images if any
      if (selectedFiles.length > 0) {
        await uploadImages(propertyId);
      }

      toast({
        title: "Success",
        description: editingProperty ? "Property updated successfully!" : "Property created successfully!",
      });

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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      period: 'per month',
      bedrooms: 1,
      bathrooms: 1,
      area: '',
      location: '',
      coordinates: { lat: 0, lng: 0 },
      features: '',
      status: 'available',
    });
    setSelectedFiles([]);
    setShowAddForm(false);
    setEditingProperty(null);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description || '',
      price: property.price.toString(),
      period: property.period,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      location: property.location,
      coordinates: property.coordinates || { lat: 0, lng: 0 },
      features: property.features.join(', '),
      status: property.status,
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
        description: "Property deleted successfully!",
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Landlord Dashboard</h1>
            <p className="text-gray-600">Manage your properties</p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Property</span>
          </Button>
        </div>

        {/* Add/Edit Property Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="e.g., Modern 2-Bedroom Apartment"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      placeholder="e.g., Westlands, Nairobi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (KSh)</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      placeholder="45000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Period</label>
                    <select
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="per month">Per Month</option>
                      <option value="per year">Per Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Area</label>
                    <Input
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                      placeholder="e.g., 120 sqm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Under Maintenance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Describe the property..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Features (comma-separated)</label>
                  <Input
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="e.g., Parking, Security, Generator, Water"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Property Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedFiles.length} file(s) selected
                    </p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : (editingProperty ? 'Update Property' : 'Add Property')}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <Upload className="text-gray-400" size={48} />
                <span className="text-gray-500 ml-2">No Image</span>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    property.status === 'available' ? 'bg-green-100 text-green-800' :
                    property.status === 'rented' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-2 flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {property.location}
                </p>

                <div className="text-2xl font-bold text-blue-600 mb-3">
                  KSh {property.price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {property.period}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-3 text-gray-600">
                  <div className="flex items-center">
                    <Bed size={16} className="mr-1" />
                    <span className="text-sm">{property.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center">
                    <Bath size={16} className="mr-1" />
                    <span className="text-sm">{property.bathrooms} bath</span>
                  </div>
                  <div className="flex items-center">
                    <Square size={16} className="mr-1" />
                    <span className="text-sm">{property.area}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(property)}
                    className="flex-1"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(property.id)}
                    className="flex-1"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">No properties added yet.</p>
            <p className="text-gray-400">Click "Add Property" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;
