import React, { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { FaSave, FaSpinner, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

interface FormData {
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
}

interface LocationState {
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  isEdit?: boolean;
}

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Prefill form if editing
  useEffect(() => {
    if (locationState?.user && locationState?.isEdit) {
      setIsEditMode(true);
      setUserId(locationState.user.id);
      setFormData({
        name: locationState.user.name,
        email: locationState.user.email,
        phone: locationState.user.phone,
        location: locationState.user.location,
      });
    }
  }, [locationState]);

  const validateEmail = (email: string): boolean => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.toLowerCase());
  };

  const validatePhone = (phone: string): boolean => {
    return /^\d{10}$/.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = "City is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#ef4444",
          color: "#fff",
        },
        icon: "❌",
      });
      return;
    }

    setIsLoading(true);
    try {
      const url = isEditMode
        ? `https://jsonplaceholder.typicode.com/users/${userId}`
        : "https://jsonplaceholder.typicode.com/users";
      
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            city: formData.location,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? "update" : "add"} user`);
      }

      const data = await response.json();
      console.log(`User ${isEditMode ? "updated" : "created"} successfully:`, data);

      toast.success(
        `User ${isEditMode ? "updated" : "added"} successfully! 🎉`,
        {
          duration: 2000,
          position: "top-right",
          style: {
            background: "#10b981",
            color: "#fff",
          },
        }
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
      });
      setErrors({});

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Failed to ${isEditMode ? "update" : "add"} user. Please try again.`, {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#ef4444",
          color: "#fff",
        },
        icon: "❌",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 w-full">
      
        <div className="w-full py-8">
          <div className="max-w-2xl mx-auto px-4">
            {/* Back Button */}
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center text-slate-600 hover:text-slate-800 mb-6 transition-colors duration-200
              cursor-pointer"
            >
              <FaArrowLeft className="mr-2" />
              Back to Users
            </button>

            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {isEditMode ? "Edit User" : "Create New User"}
              </h1>
              <p className="text-slate-600">
                {isEditMode
                  ? "Update the user information below"
                  : "Fill in the details below to add a new user to the system"}
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-slate-200">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name Field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:outline-none transition-all duration-200 text-slate-800 ${
                      errors.name
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-300 focus:ring-blue-200 focus:border-blue-400"
                    }`}
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm">{errors.name}</span>
                  )}
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:outline-none transition-all duration-200 text-slate-800 ${
                      errors.email
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-300 focus:ring-blue-200 focus:border-blue-400"
                    }`}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">{errors.email}</span>
                  )}
                </div>

                {/* Phone Field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    className={`w-full px-4 py-3 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:outline-none transition-all duration-200 text-slate-800 ${
                      errors.phone
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-300 focus:ring-blue-200 focus:border-blue-400"
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-sm">{errors.phone}</span>
                  )}
                </div>

                {/* Location Field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="location"
                    className="text-sm font-semibold text-slate-700"
                  >
                    City
                  </label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    placeholder="Enter city name"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:outline-none transition-all duration-200 text-slate-800 ${
                      errors.location
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-300 focus:ring-blue-200 focus:border-blue-400"
                    }`}
                  />
                  {errors.location && (
                    <span className="text-red-500 text-sm">
                      {errors.location}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`mt-4 inline-flex items-center justify-center px-6 py-3.5 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg cursor-pointer ${
                    isLoading
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2 text-lg" />
                      {isEditMode ? "Updating..." : "Adding User..."}
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      {isEditMode ? "Update User" : "Add User"}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUser;
