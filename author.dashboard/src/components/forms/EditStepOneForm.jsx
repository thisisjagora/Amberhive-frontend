import React, { useRef, useEffect, useState } from "react";
import { BookOpen, UploadCloud, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { fetchGenres } from "@/redux/slices/genreSlice";
import ReaderEpub from "../ReaderEpub";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditStepOneForm({ nextStep, setBookData, bookData }) {
  const coverInputRef = useRef(null);
  const [fileError, setFileError] = useState("");
  const [coverError, setCoverError] = useState("");
  const [tagInput, setTagInput] = useState(bookData.tags?.join(", ") || "");

  const ebookInputRef = useRef(null);
  const dispatch = useDispatch();
  const { genres } = useSelector((state) => state.genre);

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.name) {
        setBookData((prev) => ({
          ...prev,
          author: parsed.name,
          authorId: parsed.author_id,
        }));
      }
    }
  }, [setBookData]);

  useEffect(() => {
    setTagInput(bookData.tags?.join(", ") || "");
  }, [bookData.tags]);

  const handleCoverClick = () => coverInputRef.current?.click();
  const handleEbookClick = () => ebookInputRef.current?.click();

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;

    if (valid) {
      nextStep();
    }
  };

  console.log(bookData);

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold">Ebook Details</h2>
        <p className="text-sm text-gray-500">Title & Metadata Entry</p>
      </div>

      <div className="bg-white border p-6 rounded-lg shadow-sm space-y-6">
        <div className="space-y-2">
          <Label className="font-semibold text-gray-600">Book Title*</Label>
          <Input
            name="bookTitle"
            required
            className="font-semibold text-gray-600"
            value={bookData.title || ""}
            onChange={(e) =>
              setBookData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-gray-600">
            Subtitle (Optional)
          </Label>
          <Input
            name="subtitle"
            className="py-4 font-semibold text-gray-600"
            value={bookData.subtitle || ""}
            onChange={(e) =>
              setBookData((prev) => ({ ...prev, subtitle: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-gray-600">Genre*</Label>
          <Select
            value={bookData.genre_id ? String(bookData.genre_id) : ""}
            onValueChange={(value) =>
              setBookData((prev) => ({ ...prev, genre_id: value }))
            }
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent className="font-gilroy">
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={String(genre.id)}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-gray-600">Tags</Label>
          <Input
            name="tags"
            placeholder="comma-separated e.g. fantasy, magic, adventure"
            className="font-semibold text-gray-600"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onBlur={() => {
              const tags = tagInput
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);
              setBookData((prev) => ({ ...prev, tags }));
            }}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-gray-600">Name of Author*</Label>
          <Input
            name="author"
            value={bookData.author}
            readOnly
            required
            className="font-semibold text-gray-600 bg-gray-100 cursor-not-allowed"
          />
        </div>

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
            onInput={(e) =>
              setBookData((prev) => ({
                ...prev,
                description: e.currentTarget.innerHTML,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-gray-600">Language*</Label>
          <Input
            name="language"
            required
            className="font-semibold text-gray-600"
            value={bookData.language || ""}
            onChange={(e) =>
              setBookData((prev) => ({ ...prev, language: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-gray-600">
            Upload Cover Image
          </Label>

          {/* Upload/preview box */}
          <div
            className="border rounded-md p-6 text-center bg-gray-50 cursor-pointer relative"
            onClick={handleCoverClick}
          >
            <UploadCloud className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-yellow-600 font-medium">
              Click to upload
            </p>
            <p className="text-xs text-gray-500">
              JPEG/PNG - Recommended 1600×2400px (Max. 1MB)
            </p>

            {/* Preview if URL exists */}
            {bookData.cover_image &&
              typeof bookData.cover_image === "string" && (
                <div className="mt-4">
                  <img
                    src={`https://test.amber-hive.com/storage/${bookData.cover_image}`}
                    alt="Cover Preview"
                    className="mx-auto max-h-48 rounded shadow"
                  />
                </div>
              )}

            {/* Error */}
            {coverError && (
              <p className="text-sm text-red-600 mt-2">{coverError}</p>
            )}

            {/* Hidden input */}
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

                  // preview locally
                  const previewUrl = URL.createObjectURL(file);

                  setBookData((prev) => ({
                    ...prev,
                    cover_image: previewUrl, // store URL instead of File
                  }));
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-gray-600">
            Upload Ebook (.epub only)
          </Label>

          {/* View Book button only if a book exists */}
          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="mt-4 cursor-pointer flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  View Book
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent
                className="relative flex flex-col overflow-hidden"
                style={{
                  position: "fixed",
                  width: "98vw",
                  maxWidth: "none",
                  height: "95vh",
                  margin: 0,
                  padding: 0,
                  borderRadius: "0.5rem",
                }}
              >
                <AlertDialogCancel
                  className="absolute right-4 top-4 p-1 rounded-md hover:bg-muted"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </AlertDialogCancel>

                <AlertDialogHeader className="pb-2 p-6">
                  <AlertDialogTitle>
                    {bookData.title || "Preview"}
                  </AlertDialogTitle>
                </AlertDialogHeader>

                <div className="flex-1 mt-4 overflow-hidden rounded border">
                  <ReaderEpub
                    url={
                      bookData.book instanceof File
                        ? URL.createObjectURL(bookData.book)
                        : bookData.book
                    }
                  />
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div
            className="border rounded-md p-6 text-center bg-gray-50 cursor-pointer"
            onClick={handleEbookClick}
          >
            <UploadCloud className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-yellow-600 font-medium">
              Click to upload
            </p>

            <p className="text-xs text-gray-500">ePub (Max. 2MB)</p>

            {/* Selected File */}
            {bookData.book && (
              <p className="text-sm text-green-600 mt-2">
                Selected:{" "}
                {bookData.book instanceof File
                  ? bookData.book.name
                  : bookData.book.split("/").pop()}
              </p>
            )}

            {/* Error Message */}
            {fileError && (
              <p className="text-sm text-red-600 mt-2">{fileError}</p>
            )}

            {/* Hidden Input */}
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
                  setBookData((prev) => ({
                    ...prev,
                    book: file,
                  }));
                }
              }}
            />
          </div>

          {/* Convert PDF/Word to EPUB */}
          <div className="flex gap-3 items-center justify-end">
            <a
              href="https://www.zamzar.com/convert/pdf-to-epub/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                variant="outline"
                className="text-sm bg-white border cursor-pointer border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              >
                Convert PDF to EPUB
              </Button>
            </a>

            <a
              href="https://www.zamzar.com/convert/doc-to-epub/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                variant="outline"
                className="text-sm bg-white border cursor-pointer border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              >
                Convert Word to EPUB
              </Button>
            </a>
          </div>
        </div>

        <div className="flex justify-end gap-6 pt-6">
          <Button type="submit" className="bg-black text-white cursor-pointer">
            Save and Continue
          </Button>
        </div>
      </div>
    </form>
  );
}
