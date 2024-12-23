import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategorySelect: (categoryId: string) => void;
  categories: Array<{ id: string; name: string }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategorySelector({ 
  selectedCategories, 
  onCategorySelect, 
  categories = [], 
  open, 
  onOpenChange 
}: CategorySelectorProps) {
  console.log("CategorySelector rendered with categories:", categories);
  console.log("Selected categories:", selectedCategories);

  const handleSelect = (currentValue: string, categoryId: string) => {
    console.log("Category selected:", categoryId);
    onCategorySelect(categoryId);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCategories.length > 0
            ? `${selectedCategories.length} categories selected`
            : "Select categories..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup>
            {categories.length > 0 ? (
              categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={(currentValue) => handleSelect(currentValue, category.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategories.includes(category.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))
            ) : (
              <CommandItem disabled>No categories available</CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}