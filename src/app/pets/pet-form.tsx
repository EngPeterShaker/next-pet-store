"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdatePet, useUploadPetImage } from "@/lib/hooks/use-pets";
import { useToast } from "@/components/ui/use-toast";
import { Pet } from "@/types/pet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2 } from "lucide-react";

// Schema for form validation
const petFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.object({
    name: z.string().min(1, "Category name is required"),
  }),
  status: z.enum(["available", "pending", "sold"]),
  tags: z.array(
    z.object({
      name: z.string().min(1, "Tag name is required"),
    })
  ),
  photoUrls: z.array(z.string()).min(1, "At least one photo is required"),
});

type PetFormValues = z.infer<typeof petFormSchema>;

interface PetFormProps {
  pet: Pet;
  onSuccess?: () => void;
}

export function PetForm({ pet, onSuccess }: PetFormProps) {
  const { toast } = useToast();
  const { mutate: updatePet, isPending: isUpdating } = useUpdatePet();
  const { mutate: uploadImage, isPending: isUploading } = useUploadPetImage();

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: pet.name,
      category: pet.category || { name: "" },
      status: pet.status,
      tags: pet.tags || [],
      photoUrls: pet.photoUrls || [],
    },
  });

  const handleImageUpload = async (file: File) => {
    try {
      const response = await uploadImage(
        { id: pet.id, file },
        {
          onSuccess: (data) => {
            const currentPhotos = form.getValues("photoUrls");
            form.setValue("photoUrls", [...currentPhotos, data.message]);
            toast({
              title: "Success",
              description: "Image uploaded successfully",
            });
          },
        }
      );
      return response;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (values: PetFormValues) => {
    updatePet(
      {
        ...pet,
        ...values,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Pet updated successfully",
          });
          onSuccess?.();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update pet",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        <FormField
          control={form.control}
          name="photoUrls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photos</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  onUpload={handleImageUpload}
                  disabled={isUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags Field */}
        <div>
          <FormLabel>Tags</FormLabel>
          <div className="space-y-2">
            {form.watch("tags").map((tag, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`tags.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="Tag name" {...field} />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const tags = form.getValues("tags");
                            form.setValue(
                              "tags",
                              tags.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                form.setValue("tags", [...form.getValues("tags"), { name: "" }]);
              }}
            >
              Add Tag
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isUpdating || isUploading}>
          {isUpdating || isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Form>
  );
}