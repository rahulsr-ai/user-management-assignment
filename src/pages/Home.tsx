import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  FaSpinner,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { HiPencil, HiTrash } from "react-icons/hi";
import Header from "../components/Header";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: {
    city: string;
  };
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch users from JSONPlaceholder API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users..."); // Debug log
        
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        
        console.log("Response status:", response.status); // Debug log
        console.log("Response ok:", response.ok); // Debug log

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched users:", data); // Debug log
        
        setUsers(data);
        
        toast.success(`Loaded ${data.length} users successfully!`, {
          duration: 2000,
          position: "top-right",
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users. Please check console for details.", {
          duration: 4000,
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle delete user
  const handleDelete = async (userId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    setDeletingId(userId);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      toast.success("User deleted successfully!", {
        duration: 2000,
        position: "top-right",
        style: {
          background: "#10b981",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.", {
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Handle edit user
  const handleEdit = (user: User) => {
    navigate("/create-user", {
      state: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.address?.city || "",
        },
        isEdit: true,
      },
    });
  };

 

  if (loading) {
    return (
      <>
        <Toaster />
        <div className="min-h-screen bg-gray-50">
          <Header isListingPage={true} />
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <div className="text-center">
              <FaSpinner className="animate-spin text-5xl text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading users...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50 w-full">
        <Header isListingPage={true} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header Section */}
          

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Phone
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-sm text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <FaUserCircle className="text-gray-300 text-5xl mb-3" />
                          <p className="text-base font-medium text-gray-900 mb-1">
                            No users found
                          </p>
                          <p className="text-sm text-gray-500">
                            Get started by creating a new user.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <FaUserCircle className="text-blue-600 text-xl" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {user.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 cursor-pointer"
                              title="Edit"
                            >
                              <HiPencil className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              disabled={deletingId === user.id}
                              className={`inline-flex items-center p-2 rounded-lg transition-colors duration-200
                                cursor-pointer ${
                                deletingId === user.id
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-red-600 hover:text-red-800 hover:bg-red-50"
                              }`}
                              title="Delete"
                            >
                              {deletingId === user.id ? (
                                <FaSpinner className="animate-spin text-lg" />
                              ) : (
                                <HiTrash className="text-lg" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {users.length === 0 ? (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-12 text-center">
                <FaUserCircle className="text-gray-300 text-5xl mb-3 mx-auto" />
                <p className="text-base font-medium text-gray-900 mb-1">
                  No users found
                </p>
                <p className="text-sm text-gray-500">
                  Get started by creating a new user.
                </p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUserCircle className="text-blue-600 text-2xl" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-base font-semibold text-gray-900">
                          {user.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaEnvelope className="text-gray-400 mr-2 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaPhone className="text-gray-400 mr-2 flex-shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(user)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                      <HiPencil className="mr-1.5 text-base" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                      className={`flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        deletingId === user.id
                          ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                          : "text-red-600 bg-red-50 hover:bg-red-100"
                      }`}
                    >
                      {deletingId === user.id ? (
                        <>
                          <FaSpinner className="animate-spin mr-1.5 text-base" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <HiTrash className="mr-1.5 text-base" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {users.length > 0 && (
            <div className="mt-4 px-2">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{users.length}</span> user
                {users.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
