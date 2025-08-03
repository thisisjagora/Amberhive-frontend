import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader } from "lucide-react";

import Layout from "@/components/shared/Layout";
import { fetchBookById, updateBook } from "@/redux/slices/bookSlice"; // make sure updateBook is defined
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const EditDraft = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bookDetail, statusBookDetail, statusUpdateBook, error } = useSelector(
    (state) => state.books
  );

  const [formValues, setFormValues] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (bookDetail) {
      setFormValues({
        ...bookDetail,
        tags: Array.isArray(bookDetail.tags)
          ? bookDetail.tags
          : typeof bookDetail.tags === "string"
          ? JSON.parse(bookDetail.tags)
          : [],
        discount: bookDetail.discount || 0,
        duration: bookDetail.duration || "2025-06-10",
        copyright: bookDetail.copyright || "",
        // license: bookDetail.license || "private",
        protection: bookDetail.protection || "yes",
        genre_id: bookDetail.genre_id || 1,
      });
    }
  }, [bookDetail]);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    setFormValues((prev) => ({ ...prev, [field]: file }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  for (const key in formValues) {
    if (key === "tags") {
      formData.append(key, JSON.stringify(formValues[key]));
    } else if (formValues[key] instanceof File) {
      formData.append(key, formValues[key]);
    } else if (formValues[key] !== null && formValues[key] !== undefined) {
      formData.append(key, formValues[key]);
    }
  }

  const result = await dispatch(updateBook({ id, formData })).unwrap();

  toast.success("Book Updated", {
    description: result?.message,
  });

  navigate("/dashboard/publications/drafts");
};

  const header = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
    </div>
  );

  if (statusBookDetail === "loading") {
    return (
      <Layout header={header}>
        <div className="grid grid-cols-2 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  if (statusBookDetail === "failed") {
    return (
      <Layout header={header}>
        <p className="text-red-500 text-sm">
          Error: {error || "Failed to load book"}
        </p>
      </Layout>
    );
  }

  return (
    <Layout header={header}>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 p-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formValues?.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={formValues?.subtitle || ""}
            onChange={(e) => handleChange("subtitle", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            type="number"
            id="price"
            value={formValues?.price || ""}
            onChange={(e) => handleChange("price", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            type="number"
            id="discount"
            value={formValues?.discount || ""}
            onChange={(e) => handleChange("discount", e.target.value)}
          />
        </div>

        {/* <div>
          <Label htmlFor="page_count">Page Count</Label>
          <Input
            type="number"
            id="page_count"
            value={formValues?.page_count || ""}
            onChange={(e) => handleChange("page_count", e.target.value)}
          />
        </div> */}

        <div>
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            value={formValues?.language || ""}
            onChange={(e) => handleChange("language", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            type="date"
            id="duration"
            value={formValues?.duration || ""}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => handleChange("duration", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="copyright">Copyright</Label>
          <Input
            id="copyright"
            value={formValues?.copyright || ""}
            onChange={(e) => handleChange("copyright", e.target.value)}
          />
        </div>

        {/* <div>
          <Label>License</Label>
          <Select
            value={formValues?.license}
            onValueChange={(value) => handleChange("license", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select license" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        <div>
          <Label>Protection</Label>
          <Select
            value={formValues?.protection}
            onValueChange={(value) => handleChange("protection", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select protection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="book">Book File (EPUB/PDF)</Label>
          <Input
            id="book"
            type="file"
            accept=".epub,.pdf"
            onChange={(e) => handleFileChange("book", e.target.files[0])}
          />

          {formValues?.book && typeof formValues.book === "string" && (
            <div className="mt-2 text-sm text-muted-foreground">
              Current file:{" "}
              <span className="text-black font-medium">
                {formValues.book.split("/").pop()}
              </span>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="cover_image">Cover Image</Label>
          <Input
            id="cover_image"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange("cover_image", e.target.files[0])}
          />
          {formValues?.cover_image &&
            typeof formValues.cover_image === "string" && (
              <img
                src={`https://test.amber-hive.com/storage/${formValues.cover_image}`}
                alt="Cover Preview"
                className="mt-2 w-32 h-auto rounded border"
              />
            )}
        </div>

       <div className="col-span-2 space-y-2">
  <Label className="font-semibold text-gray-600">Book Description</Label>

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
    dangerouslySetInnerHTML={{ __html: formValues?.description || "" }}
    onInput={(e) =>
      handleChange("description", e.currentTarget.innerHTML)
    }
  />
</div>


        <div className="col-span-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={formValues?.tags?.join(", ") || ""}
            onChange={(e) =>
              handleChange(
                "tags",
                e.target.value.split(",").map((tag) => tag.trim())
              )
            }
          />
        </div>

        <div className="col-span-2">
          <Button
            type="submit"
            className="mt-4 cursor-pointer"
            disabled={statusUpdateBook === "loading"}
          >
            {statusUpdateBook === "loading" ? (
              <span className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" /> Submitting...
              </span>
            ) : (
              "Submit Changes"
            )}
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default EditDraft;
