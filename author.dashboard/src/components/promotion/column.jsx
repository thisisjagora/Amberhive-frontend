import React from "react";

import { formatDate } from "@/utils/format";

import { SendCampaignCell } from "./SendCampaignCell";

export const draftColumns = [
  {
    accessorKey: "subject",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Subject</span>
    ),
    cell: ({ row }) => {
      const { subject, cover_image } = row.original;

      return (
        <div className="flex items-center gap-3">
          {cover_image ? (
            <img
              src={`https://test.amber-hive.com/storage/${cover_image}`}
              alt="cover"
              className="w-16 h-20 object-cover rounded shadow"
            />
          ) : (
            <div className="w-16 h-20 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
              No Image
            </div>
          )}
          <span className="text-sm text-gray-800">{subject}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "content",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Content</span>
    ),
    cell: ({ row }) => {
      const content = row.original.content || "";
      return (
        <span className="break-words whitespace-normal w-72 block text-sm text-gray-800">
          {content}
        </span>
      );
    },
  },

  {
    accessorKey: "promo_code",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Promo Code</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-800">
        {row.original.promo_code || "-"}
      </span>
    ),
  },
  {
    accessorKey: "discount",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Discount (%)</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-800">
        {row.original.discount || "-"}
      </span>
    ),
  },
  {
    accessorKey: "ebook",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">E-Book</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-800">{row.original.ebook}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Date Created</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-800">
        {formatDate(row.original.created_at)}
      </span>
    ),
  },

  //   {
  //     id: "actions",
  //     header: "",
  //     cell: ({ row }) => {
  //       const rowId = row.original.id;
  //       const [isSending, setIsSending] = useState(false);
  //       const [isDialogOpen, setIsDialogOpen] = useState(false);

  //       const handleSendCampaign = async () => {
  //         // console.log("Row ID:", rowId);
  //         setIsSending(true);

  //         try {
  //           const response = await dispatch(
  //             sendCampaign({ authorId, campaign_id: rowId })
  //           );

  //           // console.log("author_id", authorId);
  //           dispatch(getCampaignDrafts());

  //           if (response?.payload?.success) {
  //             toast.success("✅ Success: " + response.payload.message);
  //             setIsDialogOpen(false);
  //           } else {
  //             toast.error(
  //               "❌ Error: " +
  //                 (response.payload.message || "Failed to send campaign.")
  //             );
  //           }
  //         } catch (error) {
  //           toast.error(`Error: ${error.message}`);
  //         } finally {
  //           setIsSending(false);
  //         }
  //       };

  //       useEffect(() => {
  //         if (!isSending) {
  //           console.log("Ready to send campaign...");
  //         }
  //       }, [isSending]);

  //       return (
  //         <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  //           <AlertDialogTrigger asChild>
  //             <Button
  //               variant="ghost"
  //               size="sm"
  //               className="text-sm gap-2"
  //               disabled={isSending}
  //             >
  //               {isSending ? (
  //                 <>
  //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  //                   Sending...
  //                 </>
  //               ) : (
  //                 <div className="flex gap-2">
  //                   <SendHorizonal className="w-4 h-4" />
  //                   Send
  //                 </div>
  //               )}
  //             </Button>
  //           </AlertDialogTrigger>

  //           <AlertDialogContent className="font-gilroy flex flex-col items-center text-center space-y-4">
  //             <AlertDialogHeader className="flex flex-col items-center text-center space-y-2">
  //               <AlertDialogTitle className="text-lg font-semibold">
  //                 Are you sure?
  //               </AlertDialogTitle>
  //               <AlertDialogDescription className="text-sm text-center text-gray-600 md:max-w-sm">
  //                 Do you really want to send "{row.original.subject}" campaign?
  //                 This action cannot be undone.
  //               </AlertDialogDescription>
  //             </AlertDialogHeader>
  //             <AlertDialogFooter className="w-full">
  //               <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-3 sm:gap-4">
  //                 <AlertDialogCancel
  //                   className="w-full sm:w-24"
  //                   disabled={isSending}
  //                 >
  //                   Cancel
  //                 </AlertDialogCancel>
  //                 <AlertDialogAction
  //                   className="w-full sm:w-28"
  //                   onClick={handleSendCampaign}
  //                   disabled={isSending}
  //                 >
  //                   {isSending ? (
  //                     <>
  //                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  //                       Sending...
  //                     </>
  //                   ) : (
  //                     "Yes, Send It"
  //                   )}
  //                 </AlertDialogAction>
  //               </div>
  //             </AlertDialogFooter>
  //           </AlertDialogContent>
  //         </AlertDialog>
  //       );
  //     },
  //   },

  {
    id: "actions",
    header: "",
    cell: ({ row }) => <SendCampaignCell row={row} />,
  },
];
