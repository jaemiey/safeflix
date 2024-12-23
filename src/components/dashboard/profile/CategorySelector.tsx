import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategorySelect: (categoryId: string) => void;
  categories: Array<{ id: string; name: string }>;
}

export function CategorySelector({ 
  selectedCategories, 
  onCategorySelect, 
  categories = []
}: CategorySelectorProps) {
  console.log("CategorySelector rendered with categories:", categories);
  console.log("Selected categories:", selectedCategories);

  return (
    <Card>
      <CardContent className="grid grid-cols-2 gap-2 p-2">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className={cn(
                "justify-start space-x-2",
                selectedCategories.includes(category.id) && "bg-primary/10"
              )}
              onClick={() => onCategorySelect(category.id)}
            >
              <Check
                className={cn(
                  "h-4 w-4",
                  selectedCategories.includes(category.id) ? "opacity-100" : "opacity-0"
                )}
              />
              <span>{category.name}</span>
            </Button>
          ))
        ) : (
          <div className="col-span-2 text-center text-sm text-muted-foreground">
            No categories available
          </div>
        )}
      </CardContent>
    </Card>
  );
}