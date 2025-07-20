'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pet, PetStatus } from '@/types/pet';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// URL validation regex
const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Schema for form validation
const petFormSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
  category: z.object({
    id: z.number().optional(),
    name: z.string().min(1, 'Category name is required'),
  }),
  status: z.enum([PetStatus.Available, PetStatus.Pending, PetStatus.Sold]),
  tags: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().min(1, 'Tag name is required'),
    })
  ),
  photoUrls: z.array(z.string().regex(urlRegex, 'Please enter a valid URL')).optional(),
});

type PetFormValues = z.infer<typeof petFormSchema>;

interface PetFormProps {
  pet: Pet;
  onSubmit: (data: Pet) => void;
  isSubmitting?: boolean;
}

export default function PetForm({ pet, onSubmit, isSubmitting = false }: PetFormProps) {
  const router = useRouter();
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [photoUrlError, setPhotoUrlError] = useState('');

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      id: pet.id,
      name: pet.name,
      category: pet.category || { name: '' },
      status: pet.status,
      tags: pet.tags || [],
      photoUrls: pet.photoUrls || [],
    },
  });

  const handleAddPhotoUrl = () => {
    setPhotoUrlError('');
    if (!newPhotoUrl) {
      setPhotoUrlError('Please enter a URL');
      return;
    }
    
    if (!urlRegex.test(newPhotoUrl)) {
      setPhotoUrlError('Please enter a valid URL (e.g., https://example.com/image.jpg)');
      return;
    }
    
    const currentUrls = form.getValues('photoUrls') || [];
    form.setValue('photoUrls', [...currentUrls, newPhotoUrl]);
    setNewPhotoUrl('');
  };

  const handleRemovePhotoUrl = (index: number) => {
    const currentUrls = form.getValues('photoUrls') || [];
    form.setValue(
      'photoUrls',
      currentUrls.filter((_, i) => i !== index)
    );
  };

  const handleAddTag = () => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', [...currentTags, { name: '' }]);
  };

  const handleRemoveTag = (index: number) => {
    const currentTags = form.getValues('tags');
    form.setValue(
      'tags',
      currentTags.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium">Basic Information</h2>
          
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Pet name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Field */}
          <FormField
            control={form.control}
            name="category.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status Field */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={PetStatus.Available}>Available</SelectItem>
                    <SelectItem value={PetStatus.Pending}>Pending</SelectItem>
                    <SelectItem value={PetStatus.Sold}>Sold</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Tags */}
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Tags</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTag}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </div>
          
          <div className="space-y-2">
            {form.watch('tags').map((tag, index) => (
              <div key={index} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`tags.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Tag name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveTag(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {form.watch('tags').length === 0 && (
              <p className="text-muted-foreground text-sm">No tags added yet</p>
            )}
          </div>
        </div>

        {/* Photo URLs */}
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium">Photos</h2>
          
          <div className="flex gap-2">
            <Input
              placeholder="Photo URL (e.g., https://example.com/image.jpg)"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddPhotoUrl}
            >
              Add
            </Button>
          </div>
          
          {photoUrlError && (
            <p className="text-sm text-red-500">{photoUrlError}</p>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(form.watch('photoUrls') || []).map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-md overflow-hidden relative">
                  <Image
                    src={url}
                    alt={`Pet image ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={() => handleRemovePhotoUrl(index)}
                    unoptimized={!url.startsWith('/')}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemovePhotoUrl(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {(!form.watch('photoUrls') || form.watch('photoUrls')?.length === 0) && (
              <p className="text-muted-foreground text-sm col-span-full">No photos added yet</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
