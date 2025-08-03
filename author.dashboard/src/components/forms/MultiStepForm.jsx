import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FiUploadCloud } from "react-icons/fi";
import AmberHiveLogo from "@/assets/Amberhive.png";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchAllBanks,
  setupAuthorProfile,
  verifyBankAccount,
} from "@/redux/slices/profileSlice";

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    // bankName: "",
    accountNumber: "",
    bank: "",
    bank_code: "",
    accountName: "",
    country: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    bio: "",
    website: "",
    facebook: "",
    x: "",
    linkedin: "",
    instagram: "",
    profile_image: null,
  });

  const [user, setUser] = useState({ name: "", email: "" });
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [resolvingAccountName, setResolvingAccountName] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { banks } = useSelector((state) => state.profile);

  // console.log(banks);

  useEffect(() => {
    dispatch(fetchAllBanks());
  }, [dispatch]);

  // Load name from localStorage
  useEffect(() => {
    // Fetch user from localStorage and parse it
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.name,
          email: parsedUser.email,
        });
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (formData.accountNumber.length === 10 && formData.bank_code) {
      dispatch(
        verifyBankAccount({
          account_number: formData.accountNumber,
          bank_code: formData.bank_code,
        })
      ).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          handleChange("accountName", res.payload.account_name);
        }
      });
    }
  }, [formData.accountNumber, formData.bank]);

  const handleDropdownOpen = async (open) => {
    setDropdownOpen(open);
    if (open && countries.length === 0 && !loadingCountries) {
      setLoadingCountries(true);
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2"
        );
        const data = await response.json();
        const sortedCountries = data
          .map((country) => ({
            name: country.name.common,
            code: country.cca2.toLowerCase(),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error loading countries:", error);
        toast.error("Failed to load countries");
      } finally {
        setLoadingCountries(false);
      }
    }
  };
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "accountNumber") {
      const isValid = value.length === 10 && formData.bank_code;
      if (isValid) {
        setResolvingAccountName(true);
        try {
          const res = await fetchAccountName(value, formData.bank_code);
          setFormData((prev) => ({ ...prev, accountName: res.account_name }));
        } catch (err) {
          setFormData((prev) => ({ ...prev, accountName: "" }));
        } finally {
          setResolvingAccountName(false);
        }
      }
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setUploadError(true);
        setPreviewImage(null);
        handleChange("profile_image", null);

        toast.error("Only JPEG and PNG images are allowed.");
        return;
      }

      setUploadError(false); // Reset error
      handleChange("profile_image", file);

      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  // Access Redux state for profile setup
  const { status, error } = useSelector((state) => state.profile);

  // Local state for disabling button during submission
  const [submitting, setSubmitting] = useState(false);

  const validateStep = () => {
    if (step === 2) {
      if (!formData.bio.trim()) {
        toast.error("Biography is required.");
        return false;
      }
    }

    if (step === 3) {
      const requiredFields = [
        { field: "country", label: "Country" },
        { field: "address1", label: "Address Line 1" },
        { field: "city", label: "City" },
        { field: "state", label: "State" },
        { field: "zip", label: "ZIP Code" },
        { field: "phone", label: "Phone Number" },
      ];

      for (const { field, label } of requiredFields) {
        if (!formData[field]?.toString().trim()) {
          toast.error(`${label} is required.`); // Specific error per field
          return false;
        }
      }
    }

    if (step === 4) {
      const requiredFields = [
        { field: "accountNumber", label: "Account Number" },
        { field: "bank", label: "Bank Name" },
        { field: "bank_code", label: "Bank Code" },
        { field: "accountName", label: "Account Name" },
      ];

      for (const { field, label } of requiredFields) {
        if (!formData[field]?.toString().trim()) {
          toast.error(`${label} is required.`); // Specific error per field
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const groupedData = {
      bio: formData.bio,

      website: formData.website,
      facebook: formData.facebook,
      x: formData.x,
      linkedin: formData.linkedin,
      instagram: formData.instagram,
      profile_image: formData.profile_image,
      // royaltyPercentage: formData.royaltyPercentage,

      bank_details: {
        accountNumber: formData.accountNumber,
        bank: formData.bank,
        // paymentMethod: formData.paymentMethod,
        accountName: formData.accountName,
        bank_code: formData.bank_code,
      },
      address_details: {
        country: formData.country,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        phone: formData.phone,
      },
    };

    // console.log(groupedData);
    setSubmitting(true);
    try {
      // Dispatch the async thunk
      const resultAction = await dispatch(setupAuthorProfile(groupedData));

      navigate("/loading-profile");

      if (setupAuthorProfile.fulfilled.match(resultAction)) {
        toast.success("Form submitted successfully!");
        setTimeout(() => {
          navigate("/loading-profile");
        }, 2000);
      } else {
        // rejected
        toast.error(resultAction.payload || "Submission failed.");
      }
    } catch (error) {
      toast.error("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex justify-center gap-2 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`h-1 w-44 rounded ${
            i <= step ? "bg-[#F6A920]" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-50 font-gilroy">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full bg-white z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="mt-4">
            <Link to="/">
              <img
                src={AmberHiveLogo}
                alt="Amber Hive Logo"
                className="mb-6 w-36 h-auto"
              />
            </Link>
          </div>
        </div>
      </header>
      {/* Card Content */}

      <main className="w-full max-w-xl mx-auto my-8 p-6 mt-20 pb-10 overflow-auto ">
        <StepIndicator />

        {step === 1 && (
          <div className="space-y-6 flex flex-col items-center">
            {/* Progress Heading */}
            <div className="text-center space-y-4 mt-8">
              <h2 className="text-xl font-semibold text-gray-800">
                Hi {user.name.split(" ")[0]}{" "}
                <span className="inline-block">👋</span>
              </h2>
              <h1 className="text-2xl font-bold">
                Welcome to <span className="text-[#F6A920]">AmberHive</span>
              </h1>
              <p className="text-sm text-gray-500">
                Please complete your sign up process
              </p>
            </div>

            {/* Upload Preview Circle */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative border-2 border-dashed border-gray-300 p-1 rounded-full bg-gray-50 hover:bg-gray-100 transition w-32 h-32 flex items-center justify-center">
                <input
                  type="file"
                  id="file-upload"
                  accept="image/png, image/jpeg"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer w-full h-full flex items-center justify-center rounded-full"
                >
                  {uploadError ? (
                    <div className="text-center text-red-500 text-sm">
                      <img
                        src="/error-icon.png"
                        alt="Error"
                        className="w-10 h-10 mx-auto mb-1"
                      />
                      Invalid file type
                    </div>
                  ) : previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FiUploadCloud className="text-3xl text-gray-400" />
                  )}
                </label>
              </div>

              {/* Upload text */}
              <p className="text-sm text-gray-600">Upload Profile Picture</p>
            </div>

            {/* Navigation Button */}
            <div className="mt-24 w-full flex justify-center px-4">
              <Button
                className="bg-black text-white py-2 cursor-pointer rounded-md w-full max-w-sm hover:bg-gray-800 transition"
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center mb-4">
              Your Profile
            </h2>

            <div className="space-y-4">
              <Label htmlFor="bio">Profile</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <h3 className="text-md font-semibold mt-6 mb-2">
              Social Profiles (Optional)
            </h3>

            <div className="space-y-4">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                placeholder="Enter your website"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="facebook">Facebook (Optional)</Label>
              <Input
                id="facebook"
                placeholder="Enter your Facebook profile"
                value={formData.facebook}
                onChange={(e) => handleChange("facebook", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="x">X / Twitter (Optional)</Label>
              <Input
                id="x"
                placeholder="Enter your X (Twitter) profile"
                value={formData.x}
                onChange={(e) => handleChange("x", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
              <Input
                id="linkedin"
                placeholder="Enter your LinkedIn profile"
                value={formData.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="instagram">Instagram (Optional)</Label>
              <Input
                id="instagram"
                placeholder="Enter your Instagram profile"
                value={formData.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
              />
            </div>

            <Button className="w-full mt-4 cursor-pointer" onClick={handleNext}>
              Next
            </Button>

            <Button
              variant="secondary"
              className="w-full cursor-pointer"
              onClick={handleBack}
            >
              Back
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center mb-4">
              Address Details
            </h2>

            <div className="space-y-4">
              <Label htmlFor="country">
                Country <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.country}
                onValueChange={(val) => handleChange("country", val)}
                onOpenChange={handleDropdownOpen}
              >
                <SelectTrigger
                  id="country"
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <SelectValue placeholder="Select Country" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {countries.length > 0 ? (
                    <>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                      <span className="text-sm text-gray-500">
                        Loading countries...
                      </span>
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="address1">Address Line 1 <span className="text-red-500">*</span></Label>
              <Input
                id="address1"
                placeholder="Enter address line 1"
                value={formData.address1}
                onChange={(e) => handleChange("address1", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="address2">Address Line 2</Label>
              <Input
                id="address2"
                placeholder="Enter address line 2 (optional)"
                value={formData.address2}
                onChange={(e) => handleChange("address2", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
              <Input
                id="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
              <Input
                id="state"
                placeholder="Enter state"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="zip">Zip Code <span className="text-red-500">*</span> </Label>
              <Input
                id="zip"
                placeholder="Enter zip code"
                value={formData.zip}
                onChange={(e) => handleChange("zip", e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[+0-9\b]*$/.test(value)) {
                    handleChange("phone", value);
                  }
                }}
              />
            </div>
            <Button className="w-full mt-4 cursor-pointer" onClick={handleNext}>
              Next
            </Button>

            <Button
              variant="secondary"
              className="w-full cursor-pointer"
              onClick={handleBack}
            >
              Back
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center mb-4">
              Add Your Account Details
            </h2>

            <div className="space-y-4">
              <Label htmlFor="bank" className="font-semibold">
                Bank <span className="text-red-500">*</span>
              </Label>

              <Select
                onValueChange={(code) => {
                  const selectedBank = banks.find((bank) => bank.code === code);
                  handleChange("bank_code", code);
                  handleChange("bank", selectedBank?.name || "");
                }}
                value={formData.bank_code}
                required
              >
                <SelectTrigger id="bank" className="w-full">
                  <SelectValue placeholder="Select Bank" />
                </SelectTrigger>
                <SelectContent className="w-full font-gilroy">
                  {banks.length > 0 ? (
                    banks.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        {bank.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
                      <span className="text-sm text-gray-500">
                        Loading banks...
                      </span>
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Account Number Input with Loader */}
            <div className="space-y-4">
              <Label
                htmlFor="accountNumber"
                className="font-semibold flex items-center gap-2"
              >
                Account Number <span className="text-red-500">*</span>
                {/* Show Loader if Resolving */}
                {resolvingAccountName && (
                  <span className="ml-2 animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full" />
                )}
              </Label>
              <Input
                id="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={(e) => handleChange("accountNumber", e.target.value)}
                required
              />
            </div>

            {/* Account Name — Only shown if fetched */}
            <div className="space-y-4">
              <Label htmlFor="accountName" className="font-semibold">
                Account Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="accountName"
                placeholder="Account name"
                value={resolvingAccountName ? "" : formData.accountName}
                readOnly
              />
            </div>

            <Button
              variant="secondary"
              className="w-full cursor-pointer"
              onClick={handleBack}
            >
              Back
            </Button>

            <Button
              className="w-full mt-4 cursor-pointer"
              onClick={handleSubmit}
            >
              {submitting || status === "loading" ? "Submitting..." : "Submit"}
            </Button>
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 py-4">
        &copy; {new Date().getFullYear()} AmberHive.
      </footer>
    </div>
  );
}
