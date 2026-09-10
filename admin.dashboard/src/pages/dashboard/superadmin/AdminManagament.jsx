import React, { useEffect, useState } from "react";
import SuperAdminLayout from "./DashboardLayout";
import { KeyRound, Loader2, Search, Trash2 } from "lucide-react";
import TableComponent from "@/components/TableComponent";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllRoles,
  fetchAdmins,
  deleteAdmin,
  updateAdminPassword,
} from "@/redux/slices/usersSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import CreateAdmin from "@/components/forms/CreateAdmin";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const AdminManagament = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialogId, setOpenDialogId] = useState(null);
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const dispatch = useDispatch();
  const { admins, statusAdmins, deletingAdminId } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchAdmins());
    dispatch(fetchAllRoles());
  }, [dispatch]);

  const handleDelete = async (userId) => {
    try {
      const result = await dispatch(deleteAdmin(userId)).unwrap();
      dispatch(fetchAdmins());
      toast.success(result.message || "Admin deleted successfully");
      setOpenDialogId(null); // close the dialog on success
    } catch (err) {
      toast.error(err?.message || "Failed to delete admin");
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (!selectedAdminId) {
      toast.error("Select an admin first");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Enter and confirm the new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const result = await dispatch(
        updateAdminPassword({
          userId: selectedAdminId,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        })
      ).unwrap();
      setNewPassword("");
      setConfirmPassword("");
      toast.success(result?.message || "Password updated and email notification sent");
    } catch (error) {
      toast.error(
        error?.message || error?.error || "Unable to update password. Please try again."
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const filteredAdmins = admins?.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  const userColumns = [
    {
      id: "name",
      header: () => (
        <span className="font-semibold text-gray-700 px-2 py-2">
          Name of Admin
        </span>
      ),
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="text-sm font-medium text-gray-800">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      id: "email",
      header: () => (
        <span className="font-semibold text-gray-700 px-2 py-2">
          Email Address
        </span>
      ),
      accessorKey: "email",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 px-2 py-2">
          {row.original.email}
        </span>
      ),
    },
    {
      id: "role",
      header: () => (
        <span className="font-semibold text-gray-700 px-2 py-2">Role</span>
      ),
      accessorKey: "role",
      cell: ({ row }) => {
        const roleName = row.original.role?.name?.toLowerCase() || "n/a";
        const badgeClass =
          roleName === "super admin"
            ? "bg-green-100 text-green-600 font-[600]"
            : roleName === "admin"
            ? "bg-blue-100 text-blue-600 font-[600]"
            : "bg-gray-200 text-gray-700";

        return (
          <Badge className={`capitalize px-2 py-1 text-xs ${badgeClass}`}>
            {roleName}
          </Badge>
        );
      },
    },
    {
      id: "dateCreated",
      header: () => (
        <span className="font-semibold text-gray-700 px-2 py-2">
          Date Created
        </span>
      ),
      accessorKey: "created_at",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        const formattedDate = date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return (
          <span className="text-sm text-gray-600 px-2 py-2">
            {formattedDate}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="flex justify-center">
          <span className="font-semibold text-gray-700 px-2 py-2">Actions</span>
        </div>
      ),
      cell: ({ row }) => {
        const adminId = row.original.id;
        const isDeleting = deletingAdminId === adminId;

        return (
          <AlertDialog
            open={openDialogId === adminId}
            onOpenChange={(isOpen) => setOpenDialogId(isOpen ? adminId : null)}
          >
            <AlertDialogTrigger asChild>
              <div className="cursor-pointer flex justify-center text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className={`font-gilroy`}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  admin.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDeleting}
                  onClick={() => handleDelete(adminId)}
                  className="cursor-pointer"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Yes, Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];

  return (
    <SuperAdminLayout
      header={
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="px-4 mt-20 md:mt-0 py-6 flex justify-start items-start w-full">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-xl font-bold">Admin Management</h1>
              <p className="text-gray-500 text-sm">
                View and manage Admins
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="md:mt-8 mt-16 mx-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 bg-white mb-4">
          <div className="relative w-full md:w-[400px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              type="text"
              placeholder="Search name and email..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <CreateAdmin />
        </div>

        <div className="bg-white border rounded-lg w-full p-4 shadow-md">
          <TableComponent
            data={filteredAdmins}
            columns={userColumns}
            showPagination
            isLoading={statusAdmins === "loading"}
          />
        </div>

        <section className="mt-6 max-w-xl rounded-lg border bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <KeyRound className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-gray-900">Change password</h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose an admin, set a new password, and notify them by email.
              </p>
            </div>
          </div>

          <form className="mt-5 space-y-4" onSubmit={handlePasswordChange}>
            <div className="space-y-2">
              <Label htmlFor="admin-password-user">Admin</Label>
              <select
                id="admin-password-user"
                value={selectedAdminId}
                onChange={(event) => setSelectedAdminId(event.target.value)}
                disabled={isUpdatingPassword || statusAdmins === "loading"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select an admin</option>
                {(admins || []).map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name} ({admin.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Enter a new password"
                disabled={isUpdatingPassword}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password-confirmation">Confirm new password</Label>
              <Input
                id="new-password-confirmation"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your new password"
                disabled={isUpdatingPassword}
              />
            </div>
            <Button type="submit" disabled={isUpdatingPassword} className="min-w-36">
              {isUpdatingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
            </Button>
          </form>
        </section>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminManagament;
