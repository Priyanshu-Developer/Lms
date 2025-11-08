"use client";
import CodeInput from "@/components/inputs/code-input";
import React from "react";
import Verify from "@/components/user/auth/verify";

export default function Page() {
  const [code, setCode] = React.useState("");

  return (
    <div className="w-screen h-screen flex justify-center items-center max-h-full">
      <div className="w-2xl h-3xl bg-amber-950">
        <Verify />
      </div>
    </div>
  );
}