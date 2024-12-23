import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function CategoryManager() {
  const { toast } = useToast();
  const [categories, setCategories] = useState(() => {
    return JSON.parse(localStorage.getItem("videoCategories") || "[]");
  });
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    const categoryId = Date.now().toString();
    const category = {
      id: categoryId,
      name: newCategory,
      videos: [],
    };

    const updatedCategories = [...categories, category];
    setCategories(updatedCategories);
    localStorage.setItem("videoCategories", JSON.stringify(updatedCategories));
    setNewCategory("");
    
    toast({
      title: "Success",
      description: `Category "${category.name}" has been created`,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={handleAddCategory}>Add Category</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Videos: {category.videos.length}</p>
              <Button 
                variant="destructive"
                className="mt-4"
                onClick={() => {
                  const updatedCategories = categories.filter(c => c.id !== category.id);
                  setCategories(updatedCategories);
                  localStorage.setItem("videoCategories", JSON.stringify(updatedCategories));
                  toast({
                    title: "Category Deleted",
                    description: `${category.name} has been removed`,
                  });
                }}
              >
                Delete Category
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}