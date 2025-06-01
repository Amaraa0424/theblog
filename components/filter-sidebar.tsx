"use client"

import { gql, useQuery } from '@apollo/client';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Category, FilterState } from '@/lib/types';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
    }
  }
`;

interface FilterSidebarProps {
  filter: FilterState;
  onChange: (filter: FilterState) => void;
}

export function FilterSidebar({ filter, onChange }: FilterSidebarProps) {
  const { data } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="font-semibold">Categories</h3>
        <ScrollArea className="h-72">
          <RadioGroup
            value={filter.categoryId || ''}
            onValueChange={(value) => onChange({ ...filter, categoryId: value || undefined })}
          >
            <div className="space-y-4 pr-4 pt-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="all" />
                <Label htmlFor="all">All Categories</Label>
              </div>
              {data?.categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={category.id} id={category.id} />
                  <Label htmlFor={category.id}>{category.name}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </ScrollArea>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold mb-4">Sort By</h3>
        <RadioGroup
          value={filter.sortBy}
          onValueChange={(value) => onChange({ ...filter, sortBy: value as FilterState['sortBy'] })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="latest" id="latest" />
            <Label htmlFor="latest">Latest</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="oldest" id="oldest" />
            <Label htmlFor="oldest">Oldest</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="title" id="title" />
            <Label htmlFor="title">Title</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
