import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UploadCloud,
  MoreHorizontal,
  MoreVertical,
  Trash2,
  Eye,
  Loader,
  Copy,
  Loader2,
} from "lucide-react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FaEdit, FaTags } from "react-icons/fa";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { editBook, fetchMyBooks, trashBook } from "@/redux/slices/bookSlice";
import { useDispatch, useSelector } from "react-redux";

export const CellAction = ({ data }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { statusTrashBook, statusEditBook } = useSelector(
    (state) => state.books
  );

  const ebookInputRef = useRef();
  const coverInputRef = useRef();
  const [fileError, setFileError] = useState("");
  const [coverError, setCoverError] = useState("");

  const [editForm, setEditForm] = useState({
    description: data.description || "",
    book: null,
    cover_image: null,
  });

  const [promoForm, setPromoForm] = useState({
    discount: "",
    duration: "",
  });

  const handleDelete = async () => {
    try {
      const result = await dispatch(trashBook(data.id)).unwrap();
      dispatch(fetchMyBooks());
      toast.success("Book deleted", {
        description: result?.message || `${data.name} has been removed.`,
        className: "bg-red-600 text-white",
      });
      setShowDialog(false);
    } catch (error) {
      toast.error("Delete failed", {
        description:
          error?.message || "An error occurred while deleting the book.",
      });
    }
  };

  const handleCopyLink = () => {
    const url = `https://amberhive-user.vercel.app/book/${data.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Book link copied to clipboard!");
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("description", editForm.description);
      if (editForm.book) formData.append("book", editForm.book);
      if (editForm.cover_image)
        formData.append("cover_image", editForm.cover_image);

      const result = await dispatch(
        editBook({ id: data.id, formData })
      ).unwrap();

      toast.success("Book updated", {
        description: result?.message || "Book updated successfully.",
      });

      setShowEditModal(false);
      dispatch(fetchMyBooks());
    } catch (error) {
      toast.error("Update failed", {
        description:
          error?.message || "Something went wrong while updating the book.",
      });
    }
  };

  const handlePromoSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("discount", promoForm.discount);
      formData.append("duration", promoForm.duration);

      const result = await dispatch(
        editBook({ id: data.id, formData })
      ).unwrap();

      toast.success("Promotion applied", {
        description: result?.message || "Book promotion was successful.",
      });

      setShowPromoModal(false);
      dispatch(fetchMyBooks());
    } catch (error) {
      toast.error("Promotion failed", {
        description:
          error?.message || "Something went wrong while applying promotion.",
      });
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-5 w-5 p-0 cursor-pointer">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => navigate(`/dashboard/publications/book/${data.id}`)}
          >
            <Eye className="mr-2 h-4 w-4 text-gray-700" /> View
          </DropdownMenuItem>

          {data.status === "published" && (
            <>
              {/* <DropdownMenuItem onSelect={() => setShowEditModal(true)}> */}
              <DropdownMenuItem >
                <Link className="flex items-center gap-2"
                  to={`/dashboard/publications/edit-upload-book/${data.id}`}
                >
                  <FaEdit className="mr-2 h-4 w-4 text-blue-600" /> Edit
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => setShowPromoModal(true)}>
                <FaTags className="mr-2 h-4 w-4 text-green-600" /> Promotion
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={handleCopyLink}>
                <Copy className="w-4 h-4 mr-1 text-blue-600" /> Copy Book Link
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem
            className="text-red-600 focus:bg-red-50"
            onSelect={() => setTimeout(() => setShowDialog(true), 100)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Trash
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirm */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex items-center gap-3">
            <AiOutlineExclamationCircle className="text-red-600 text-2xl" />
            <div>
              <AlertDialogTitle className="text-xl">
                Confirm Trash
              </AlertDialogTitle>
              <p className="text-gray-600">
                Are you sure you want to delete <strong>{data.name}</strong>?
                This action cannot be undone.
              </p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={statusTrashBook === "loading"}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={statusTrashBook === "loading"}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {statusTrashBook === "loading" ? (
                <span className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Modal */}

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className={`font-gilroy`}>
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              You can update the book’s description, upload a new cover or ePub
              file.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
            {/* Book Description */}
            <div className="space-y-2">
              <Label className="font-semibold text-gray-600">
                Book Description
              </Label>

              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 mb-2">
                {[
                  { cmd: "bold", label: <b>B</b> },
                  { cmd: "italic", label: <i>I</i> },
                  { cmd: "underline", label: <u>U</u> },
                  { cmd: "strikeThrough", label: <s>S</s> },
                  { cmd: "insertOrderedList", label: "1." },
                  { cmd: "insertUnorderedList", label: "•" },
                  { cmd: "outdent", label: "⬅️" },
                  { cmd: "indent", label: "➡️" },
                  { cmd: "justifyLeft", label: "⬅ Align" },
                  { cmd: "justifyCenter", label: "⬌ Center" },
                  { cmd: "justifyRight", label: "Align ➡️" },
                  { cmd: "justifyFull", label: "Justify" },
                  { cmd: "removeFormat", label: "🚫 Clear" },
                ].map((btn) => (
                  <Button
                    key={btn.cmd}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.execCommand(btn.cmd)}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>

              {/* Editable Content */}
              <div
                contentEditable
                style={{ direction: "ltr", textAlign: "left" }}
                className="min-h-[150px] max-h-[300px] overflow-y-auto p-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 prose"
                // dangerouslySetInnerHTML={{ __html: editForm.description }}
                onInput={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.currentTarget.innerHTML,
                  }))
                }
              />
            </div>

            {/* Book Upload */}
            <Label className="font-semibold text-gray-600">
              Upload Ebook (.epub only)
            </Label>
            <div
              className="border rounded-md p-6 text-center bg-gray-50 cursor-pointer"
              onClick={() => ebookInputRef.current.click()}
            >
              <UploadCloud className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-yellow-600 font-medium">
                Click to upload
              </p>
              <p className="text-xs text-gray-500">ePub (Max. 2MB)</p>
              {editForm.book && (
                <p className="text-green-600 mt-2 text-sm">
                  Selected: {editForm.book.name}
                </p>
              )}
              {fileError && (
                <p className="text-red-600 mt-2 text-sm">{fileError}</p>
              )}
              <Input
                type="file"
                accept=".epub"
                ref={ebookInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                      setFileError("Ebook file must be 2MB or less.");
                      return;
                    }
                    if (!file.name.endsWith(".epub")) {
                      setFileError("Only .epub files are allowed.");
                      return;
                    }
                    setFileError("");
                    setEditForm((prev) => ({ ...prev, book: file }));
                  }
                }}
              />
            </div>

            {/* Cover Image Upload */}
            <Label className="font-semibold text-gray-600">
              Upload Cover Image
            </Label>
            <div
              className="border rounded-md p-6 text-center bg-gray-50 cursor-pointer"
              onClick={() => coverInputRef.current.click()}
            >
              <UploadCloud className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-yellow-600 font-medium">
                Click to upload
              </p>
              <p className="text-xs text-gray-500">JPEG/PNG - Max. 1MB</p>
              {editForm.cover_image && (
                <p className="text-green-600 mt-2 text-sm">
                  Selected: {editForm.cover_image.name}
                </p>
              )}
              {coverError && (
                <p className="text-red-600 mt-2 text-sm">{coverError}</p>
              )}
              <Input
                type="file"
                accept="image/*"
                ref={coverInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 1 * 1024 * 1024) {
                      setCoverError("Cover image must be 1MB or less.");
                      return;
                    }
                    setCoverError("");
                    setEditForm((prev) => ({ ...prev, cover_image: file }));
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                disabled={statusEditBook === "loading"}
              >
                {statusEditBook === "loading" ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Book"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Promotion Modal */}
      <Dialog open={showPromoModal} onOpenChange={setShowPromoModal}>
        <DialogContent className={`font-gilroy`}>
          <DialogHeader>
            <DialogTitle>Promote Book</DialogTitle>
            <DialogDescription>
              Apply a discount and set the promotion duration for this book.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Discount (%)"
              value={promoForm.discount}
              onChange={(e) =>
                setPromoForm({ ...promoForm, discount: e.target.value })
              }
            />
            <Input
              type="date"
              value={promoForm.duration}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setPromoForm({ ...promoForm, duration: e.target.value })
              }
            />
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPromoModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePromoSubmit}
                disabled={statusEditBook === "loading"}
              >
                {statusEditBook === "loading" ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Applying...
                  </span>
                ) : (
                  "Apply Promotion"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
