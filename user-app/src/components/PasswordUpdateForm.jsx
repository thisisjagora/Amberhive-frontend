import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";
import { updatePassword } from "@/store/slice/authSlice";

const PasswordUpdateForm = () => {
  const dispatch = useDispatch();
  const updateStatus = useSelector((state) => state.auth.updatePasswordStatus);
  const errorMessage = useSelector((state) => state.auth.updatePasswordError);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [visibleFields, setVisibleFields] = useState({
    "current-password": false,
    "new-password": false,
    "confirm-password": false,
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (id) => {
    setVisibleFields((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleUpdatePassword = async () => {
    const resultAction = await dispatch(
      updatePassword({
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirmation: passwordData.confirmPassword,
      })
    );

    // console.log(resultAction.payload.message)
    if (updatePassword.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload.message);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      toast.error(resultAction.payload.message);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdatePassword();
        }}
      >
        {[ 
          {
            id: "current-password",
            name: "currentPassword",
            placeholder: "Current Password",
            value: passwordData.currentPassword,
          },
          {
            id: "new-password",
            name: "newPassword",
            placeholder: "New Password",
            value: passwordData.newPassword,
          },
          {
            id: "confirm-password",
            name: "confirmPassword",
            placeholder: "Confirm New Password",
            value: passwordData.confirmPassword,
          },
        ].map(({ id, name, placeholder, value }) => (
          <div key={id} className="relative mb-4">
            <Input
              id={id}
              name={name}
              type={visibleFields[id] ? "text" : "password"}
              placeholder={placeholder}
              className="pr-10"
              value={value}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              onClick={() => togglePasswordVisibility(id)}
            >
              {visibleFields[id] ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        ))}

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              })
            }
          >
            Cancel
          </Button>
          <Button type="submit">
            {updateStatus === "loading" ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordUpdateForm;
