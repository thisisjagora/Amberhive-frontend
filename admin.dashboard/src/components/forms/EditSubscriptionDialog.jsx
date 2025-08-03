import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubscriptionPlans,
  updateSubscriptionPlan,
} from "@/redux/slices/subscriptionPlanSlice";
import { FaPencilAlt } from "react-icons/fa";

const EditSubscriptionDialog = ({ plan }) => {
  const dispatch = useDispatch();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    monthly_book_limit: "",
    royalty_percentage: "",
    monthly_price: "",
  });
  const [features, setFeatures] = useState([""]);

  const { statusUpdate } = useSelector((state) => state.subscriptionPlans);

  useEffect(() => {
    if (plan) {
      setForm({
        name: plan.name || "",
        monthly_book_limit: plan.book_limit || "",
        royalty_percentage: plan.royalty_percentage || "",
        monthly_price: plan.monthly_price || "",
      });
      setFeatures(plan.features?.length ? plan.features : [""]);
    }
  }, [plan]);

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
    if (
      !form.name.trim() ||
      !form.monthly_price.trim() ||
      !form.royalty_percentage.trim()
    ) {
      toast.error("Name, price, and royalty percentage are required.");
      return;
    }

    const updated = {
      name: form.name.trim(),
      monthly_book_limit: form.monthly_book_limit
        ? Number(form.monthly_book_limit)
        : null,
      royalty_percentage: Number(form.royalty_percentage),
      monthly_price: Number(form.monthly_price),
      features: features.filter((f) => f.trim() !== ""),
    };

    try {
      const result = await dispatch(
        updateSubscriptionPlan({ id: plan.id, updated })
      ).unwrap();

      dispatch(fetchSubscriptionPlans());

      if (result?.message) {
        toast.success(result.message);
      }

      if (result?.success !== false) {
        setDialogOpen(false);
      }
    } catch (error) {
      const message =
        error?.message || error?.response?.data?.message;

      if (message) {
        toast.error(message);
      }

      console.error("❌ Update error:", error);
    }
  };

  return (
    <AlertDialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        if (statusUpdate !== "loading") {
          setDialogOpen(open);
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <button
          title="Edit"
          className="hover:text-yellow-600 cursor-pointer flex items-center gap-1"
        >
          <FaPencilAlt />
          
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="md:max-w-lg w-full font-gilroy">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Subscription</AlertDialogTitle>
          <AlertDialogDescription>
            Modify the subscription details below.
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
            <Button
              variant="outline"
              className={`cursor-pointer`}
              onClick={() => {
                if (statusUpdate !== "loading") {
                  setDialogOpen(false);
                }
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={statusUpdate === "loading"}
              className={`cursor-pointer`}
            >
              {statusUpdate === "loading" ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditSubscriptionDialog;
