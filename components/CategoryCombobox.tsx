"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $description: String) {
    createCategory(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

interface Category {
  value: string;
  label: string;
}

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

interface ErrorResponse {
  message: string;
}

interface GraphQLCategory {
  id: string;
  name: string;
  description?: string;
}

export function CategoryCombobox({
  value,
  onChange,
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data, loading, refetch } = useQuery(GET_CATEGORIES);
  const [createCategory] = useMutation(CREATE_CATEGORY);

  const filteredCategories = (data?.categories || []).map(
    (cat: GraphQLCategory) => ({
      value: cat.id,
      label: cat.name,
    })
  );

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    try {
      const result = await createCategory({
        variables: {
          name,
          description,
        },
      });

      const newCategory = result.data.createCategory;
      onChange(newCategory.id);
      setDialogOpen(false);
      toast.success("Category created successfully");
      refetch(); // Refresh the categories list
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.message || "Failed to create category");
    }
  };

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? filteredCategories.find(
                  (category: Category) => category.value === value
                )?.label
              : "Select category..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search category..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty className="py-6 text-center text-sm">
              {loading ? "Loading categories..." : "No category found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredCategories.map((category: Category) => (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  onSelect={(currentValue) => {
                    onChange(
                      currentValue === value ? "" : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {category.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setDialogOpen(true);
                      setOpen(false);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create new category
                  </CommandItem>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleCreateCategory}>
                    <DialogHeader>
                      <DialogTitle>Create new category</DialogTitle>
                      <DialogDescription>
                        Add a new category for your posts.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter category name"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          name="description"
                          placeholder="Enter category description (optional)"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Create</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
