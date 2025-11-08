"use client";
import CodeInput from "@/components/inputs/code-input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api/api";
import { useState } from "react";

export default function Verify() {
  const [code,setCode]= useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }
    setLoading(true);
    try{
      const response = await api.post("/auth/verify", { code }, { withCredentials: true });
      if (response.status === 200) {
        // Handle successful verification (e.g., redirect to dashboard)
      }
    }
    catch(error){
      setError("Verification failed. Please try again.");
    }
    setLoading(false);
  }
  return (
    <div className=" w-full h-full max-h-full">
      <div className="flex flex-col items-center gap-2 text-center mb-5">
         <h2 className="text-2xl font-bold">
          Verify Your Email
        </h2>
        <p className="text-muted-foreground text-balance mb-4">
          Please check your inbox for the verification code.
        </p>
      </div>
      <div className="flex flex-col items-center">
        
        <form className="space-y-6 flex flex-col items-center" onSubmit={handleSubmit}>
            <label
              htmlFor="verification-code"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code
            </label>
             {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            <CodeInput id="verification-code" length={6} code={code} onChangeCode={setCode}/>
            <div className="mt-4">
              <Button type="submit" className="w-[200px]">
                Verify
              </Button>
            </div>
        </form>
       
      </div>      
    </div>
  );
}