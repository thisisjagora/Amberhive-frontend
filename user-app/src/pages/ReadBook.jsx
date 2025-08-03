import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchBookById } from "@/store/slice/bookSlice";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReaderEpub from "@/components/ReaderEpub.";

const ReadBook = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bookDetail, statusBookDetail } = useSelector((state) => state.books);
  const book = bookDetail?.book?.book;

  useEffect(() => {
    dispatch(fetchBookById(id));
  }, [id, dispatch]);

  const isEpub = book?.toLowerCase().endsWith(".epub");

  return (
    <div className="pt-10 px-4 md:px-8 lg:px-16 min-h-screen bg-gray-50">
      <div className="mb-2">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center text-sm text-gray-700 hover:text-yellow-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {statusBookDetail === "loading" && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500" />
        </div>
      )}

      {statusBookDetail === "succeeded" && !book && (
        <div className="text-center mt-10">
          <p className="text-gray-500 text-lg font-medium">
            Sorry, this book could not be found.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="mt-4"
            variant="secondary"
          >
            Go Back
          </Button>
        </div>
      )}

      {statusBookDetail === "succeeded" && (
        <div className="relative h-[40vh] md:h-[60vh] w-full">
          {isEpub && book ? (
            <ReaderEpub url={book} />
          ) : (
            <div className="flex flex-col justify-center items-center  text-center px-4">
              <p className="text-gray-600 text-lg font-medium mb-4">
                This book is not in EPUB format and cannot be viewed in the
                reader.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadBook;
