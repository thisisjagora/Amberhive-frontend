import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addSubscriptionPlan } from "@/redux/slices/subscriptionPlanSlice";

const AddSubscriptions = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    monthly_book_limit: "",
    royalty_percentage: "",
    monthly_price: "",
  });
  const [features, setFeatures] = useState([""]);

  const dispatch = useDispatch();
  // const { statusAdd } = useSelector((state) => state.subscriptionPlans);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateFeature = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const addFeature = () => {
    if (features[features.length - 1]?.trim() !== "") {
      setFeatures([...features, ""]);
    } else {
      toast.error("Please fill in the current feature first.");
    }
  };

  const removeFeature = (index) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    const { name, monthly_price, royalty_percentage } = form;

    if (!name || !monthly_price || !royalty_percentage) {
      toast.error("Name, price, and royalty percentage are required.");
      return;
    }

    const payload = {
      name: form.name,
      monthly_book_limit: form.monthly_book_limit
        ? Number(form.monthly_book_limit)
        : null,
      royalty_percentage: Number(form.royalty_percentage),
      monthly_price: Number(form.monthly_price),
      features: features.filter((f) => f.trim() !== ""),
    };

    try {
      const result = await dispatch(addSubscriptionPlan(payload)).unwrap();
      dispatch(fetchSubscriptionPlans());
      toast.success(result.message || "Subscription plan added!");

      // Reset form
      setDialogOpen(false);
      setForm({
        name: "",
        monthly_book_limit: "",
        royalty_percentage: "",
        monthly_price: "",
      });
      setFeatures([""]);
    } catch (error) {
      toast.error(`Failed to add plan: ${error}`);
      console.error("❌ Add plan error:", error);
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button className="text-base">+ Add a Subscription</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="md:max-w-lg w-full font-gilroy">
        <AlertDialogHeader>
          <AlertDialogTitle>Add a Subscription</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the details to create a new subscription plan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Premium"
            />
          </div>

          <div>
            <Label>Monthly Book Limit (optional)</Label>
            <Input
              name="monthly_book_limit"
              type="number"
              value={form.monthly_book_limit}
              onChange={handleChange}
              placeholder="e.g. 10"
            />
          </div>

          <div>
            <Label>Royalty Percentage</Label>
            <Input
              name="royalty_percentage"
              type="number"
              value={form.royalty_percentage}
              onChange={handleChange}
              placeholder="e.g. 85"
            />
          </div>

          <div>
            <Label>Monthly Price ($)</Label>
            <Input
              name="monthly_price"
              type="number"
              value={form.monthly_price}
              onChange={handleChange}
              placeholder="e.g. 29.99"
            />
          </div>

          <div>
            <Label>Features</Label>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                  className="flex-1"
                />
                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}
            <Button onClick={addFeature} variant="outline" type="button">
              + Add Feature
            </Button>
          </div>
        </div>

        <AlertDialogFooter className="mt-6">
          <div className="flex md:flex-row flex-col justify-between gap-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddSubscriptions;
