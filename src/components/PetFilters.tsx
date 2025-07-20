// src/components/PetFilters.tsx
'use client';

import { usePetStatusCounts } from '@/lib/hooks/use-pet-status-counts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PetStatus } from '@/types/pet';

const PetFilters = ({
  status,
  name,
  onStatusChange,
  onNameChange,
}: {
  status?: string;
  name?: string;
  onStatusChange: (status: PetStatus | undefined) => void;
  onNameChange: (name: string) => void;
}) => {
  const { data: counts, isLoading } = usePetStatusCounts();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative max-w-md w-full">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          value={name || ''}
          onChange={(e) => onNameChange(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select
        value={status || ''}
        onValueChange={(value) => onStatusChange(value as PetStatus | undefined)}
      >
        <SelectTrigger className="w-[200px]">
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={PetStatus.Available}>
            <div className="flex justify-between items-center w-full">
              <span>Available</span>
              {isLoading ? (
                <Skeleton className="h-4 w-4" />
              ) : (
                <Badge variant="secondary" className="ml-2">
                  {counts?.available || 0}
                </Badge>
              )}
            </div>
          </SelectItem>
          <SelectItem value={PetStatus.Pending}>
            <div className="flex justify-between items-center w-full">
              <span>Pending</span>
              {isLoading ? (
                <Skeleton className="h-4 w-4" />
              ) : (
                <Badge variant="secondary" className="ml-2">
                  {counts?.pending || 0}
                </Badge>
              )}
            </div>
          </SelectItem>
          <SelectItem value={PetStatus.Sold}>
            <div className="flex justify-between items-center w-full">
              <span>Sold</span>
              {isLoading ? (
                <Skeleton className="h-4 w-4" />
              ) : (
                <Badge variant="secondary" className="ml-2">
                  {counts?.sold || 0}
                </Badge>
              )}
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={() => {
          onNameChange('');
          onStatusChange(undefined);
        }}
        variant="outline"
      >
        <X className="mr-2 h-4 w-4" />
        Clear Filters
      </Button>
    </div>
  );
}

export default PetFilters;