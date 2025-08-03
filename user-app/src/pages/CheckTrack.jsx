import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { MdCheckCircle } from "react-icons/md";

const CheckTrack = () => {
  const navigate = useNavigate();

  const handleTrackOrder = () => {
    navigate("/track-order");
  };

  return (
    <div className="flex flex-col items-center justify-center my-32 space-y-4 text-center">
      <div className="rounded-full p-4 bg-green-100 text-green-600">
        <MdCheckCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-semibold">Payment is Successful</h2>
      <p className="text-sm text-muted-foreground px-12 md:px-0 md:max-w-sm">
        Your book order payment is successful. Please do not forget to keep
        track of your order.
      </p>
      <Button onClick={handleTrackOrder}>Track Order</Button>
    </div>
  );
};

export default CheckTrack;
