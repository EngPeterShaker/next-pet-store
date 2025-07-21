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
  searchQuery,
  onStatusChange,
  onSearchChange,
}: {
  status?: string;
  searchQuery?: string;
  onStatusChange: (status: PetStatus | undefined) => void;
  onSearchChange: (query: string) => void;
}) => {
  const { data: counts, isLoading } = usePetStatusCounts();
  
  // Calculate total count
  const totalCount = counts ? 
    (counts.available || 0) + (counts.pending || 0) + (counts.sold || 0) : 0;

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative max-w-md w-full">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, tag, or category..."
          value={searchQuery || ''}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 pr-8"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-2 p-0.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Select
        value={status || 'all'}
        onValueChange={(value) => onStatusChange(value === 'all' ? undefined : value as PetStatus)}
      >
        <SelectTrigger className="w-[200px]">
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex justify-between items-center w-full">
              <span>All Pets</span>
              {isLoading ? (
                <Skeleton className="h-4 w-4" />
              ) : (
                <Badge variant="secondary" className="ml-2">
                  {totalCount}
                </Badge>
              )}
            </div>
          </SelectItem>
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
          onSearchChange('');
          onStatusChange(undefined);
        }}
        variant="outline"
        disabled={!searchQuery && !status}
      >
        <X className="mr-2 h-4 w-4" />
        Clear Filters
      </Button>
    </div>
  );
}

export default PetFilters;