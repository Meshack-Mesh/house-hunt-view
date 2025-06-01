
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PropertyImageUploadProps {
  onImagesChange: (imageUrls: string[]) => void;
  existingImages?: string[];
}

export const PropertyImageUpload = ({ onImagesChange, existingImages = [] }: PropertyImageUploadProps) => {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > 3) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 3 images per property.",
        variant: "destructive",
      });
      return;
    }

    const uploadPromises = files.map(uploadImage);
    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter(url => url !== null) as string[];
    
    const newImages = [...images, ...validUrls];
    setImages(newImages);
    onImagesChange(newImages);
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label>Property Images (Maximum 3)</Label>
      
      {images.length < 3 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Label htmlFor="image-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  {uploading ? 'Uploading...' : 'Upload property images'}
                </span>
                <Input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
              </Label>
            </div>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative">
              <img
                src={imageUrl}
                alt={`Property image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
