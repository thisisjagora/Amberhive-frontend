import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import { SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  getCampaignDrafts,
  sendCampaign,
} from "@/redux/slices/emailCampaignSlice";

export const SendCampaignCell = ({ row }) => {
  const dispatch = useDispatch();
  const rowId = row.original.id;
  const [isSending, setIsSending] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const authorId = row.original.author_id; // replace with actual logic if needed

  const handleSendCampaign = async () => {
    setIsSending(true);
    try {
      const response = await dispatch(
        sendCampaign({ authorId, campaign_id: rowId })
      );

      // If rejected, payload is the error message
      if (sendCampaign.rejected.match(response)) {
        toast.error(response.payload);
        return;
      }

      // If fulfilled, payload is the success object
      toast.success(
        response.payload.message || "✅ Campaign sent successfully!"
      );
      setIsDialogOpen(false);
      dispatch(getCampaignDrafts());
    } catch (error) {
      toast.error(`Error: ${error.message || "Something went wrong"}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm gap-2"
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <div className="flex gap-2">
              <SendHorizonal className="w-4 h-4" />
              Send
            </div>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="font-gilroy flex flex-col items-center text-center space-y-4">
        <AlertDialogHeader className="flex flex-col items-center text-center space-y-2">
          <AlertDialogTitle className="text-lg font-semibold">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-center text-gray-600 md:max-w-sm">
            Do you really want to send "{row.original.subject}" campaign? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full">
          <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-3 sm:gap-4">
            <AlertDialogCancel className="w-full sm:w-24" disabled={isSending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:w-28"
              onClick={handleSendCampaign}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Yes, Send It"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
