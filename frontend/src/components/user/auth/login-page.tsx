"use client";
import { LoginFormBase } from "@/components/user/auth/login-form";
import { useState } from "react";
import api from "@/lib/api/api";
import { toast, Toaster } from "sonner";
import { AxiosError } from "axios";

export interface UserCredentials {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<UserCredentials>({
    email: "",
    password: "",
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("hy")
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      }, {
        withCredentials: true,
      });
      if (response.status === 200) {
        if (response.data.verify){
          setIsVerifying(true);
          return;
        }
        toast.success("Login successful!", {
          style: { color: "white", backgroundColor: "#52c41a" },
        });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 403) {
          if (err.response.data.allowed === false) {
            toast.error(err.response.data.message, {
              style: { color: "white", backgroundColor: "#ff4d4f" },
            });
          }
        }
        if (err.response?.status === 401) {
          if (err.response.data.verified === false) {
            setIsVerifying(true);
            toast.error(err.response.data.message, {
              style: { color: "black", backgroundColor: "#fadb14" },
            });
          }
        }
      }
      else {
        toast.error("An unexpected error occurred. Please try again.", {
          style: { color: "white", backgroundColor: "#ff4d4f" },
        });
      }
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginFormBase
          onInputChange={handleInputChange}
          formData={formData}
          handleSubmit={handleSubmit}
          isVerifying={isVerifying}
          setIsVerifying={setIsVerifying}
        />
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}
