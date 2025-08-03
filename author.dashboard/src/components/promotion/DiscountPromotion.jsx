import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import DiscountProm from "@/assets/icons/d-c-icon.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBooks } from "@/redux/slices/bookSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  createCampaign,
  getCampaignDrafts,
} from "@/redux/slices/emailCampaignSlice";

const initialState = {
  ebook: "",

  subjectTitle: "",
  discountAmount: "",
  duration: "",
  promoCode: "",
};

const DiscountPromotion = () => {
  const [formData, setFormData] = useState(initialState);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const { myBooks } = useSelector((state) => state.books);

  const { statusCreateCampaign } = useSelector((state) => state.emailCampaign);

  useEffect(() => {
    dispatch(fetchMyBooks());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const generatePromoCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setFormData((prev) => ({ ...prev, promoCode: code }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ebook, subjectTitle, discountAmount, duration, promoCode } =
      formData;

    if (!ebook || !subjectTitle || !discountAmount || !duration) {
      toast.error("All fields are required!");
      return;
    }

    const payload = new FormData();
    payload.append("ebook", ebook);
    payload.append("subject", subjectTitle);
    payload.append("discount", discountAmount);
    payload.append("duration", duration);
    payload.append("promo_code", promoCode);

    try {
      const res = await dispatch(createCampaign(payload)).unwrap();
      dispatch(getCampaignDrafts());
      toast.success(res.message || "Campaign request submitted successfully!");
      setFormData(initialState); // reset the form
      setIsOpen(false); // close the modal
    } catch (err) {
      toast.error(err.message || "Failed to submit campaign.");
      console.error(err);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <div
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center justify-center border-2 cursor-pointer rounded-md p-14 mt-4 mb-2 hover:bg-accent transition-colors"
      >
        <img
          src={DiscountProm}
          alt="Discount Icon"
          className="w-10 h-10 mb-2 object-cover rounded"
        />
        <div className="max-w-[160px] text-center mt-4">
          <h1 className="font-medium">Discount & Promotion</h1>
        </div>
      </div>

      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <AlertDialogTitle>Discount & Promotion</AlertDialogTitle>
          <AlertDialogDescription>
            Use this form to submit a new campaign request.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="subjectTitle">Subject Title*</Label>
            <Input
              id="subjectTitle"
              value={formData.subjectTitle}
              onChange={handleInputChange}
              placeholder="Get 20% Off My New eBook!"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ebook">Book*</Label>
            <Select
              value={formData.ebook}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, ebook: val }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ebook" />
              </SelectTrigger>
              <SelectContent className="font-gilroy">
                {myBooks.length > 0 ? (
                  myBooks.map((bookItem) => (
                    <SelectItem key={bookItem.id} value={bookItem.title}>
                      {bookItem.title}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    No books found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="discountAmount">Discount Amount*</Label>
            <Input
              id="discountAmount"
              type="number"
              placeholder="10.00"
              value={formData.discountAmount}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="duration">Duration*</Label>
            <Input
              id="duration"
              type="date"
              value={formData.duration}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className={
                formData.duration && new Date(formData.duration) < new Date()
                  ? "border-red-500"
                  : ""
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="promoCode">Promo Code</Label>
            <div className="flex gap-2">
              <Input
                id="promoCode"
                value={formData.promoCode}
                onChange={handleInputChange}
                placeholder="Enter or generate promo code"
              />
              <Button type="button" className="cursor-pointer" onClick={generatePromoCode}>
                Generate
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:justify-between gap-3 pt-2">
            <AlertDialogCancel
              type="button"
              className="w-full md:w-auto h-10 px-6 rounded-md cursor-pointer border border-input bg-transparent hover:bg-accent text-sm"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="submit"
              disabled={statusCreateCampaign === "loading"}
              className="w-full md:w-auto h-10 px-6 rounded-md cursor-pointer text-sm font-medium bg-primary text-white hover:bg-primary/90"
            >
              {statusCreateCampaign === "loading" ? "Submitting..." : "Save"}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DiscountPromotion;
