"use client";
import React, { useRef, useEffect } from "react";

interface VerifyProps {
  length: number;
  code: string;
  id: string;
  onChangeCode: React.Dispatch<React.SetStateAction<string>>;
}

export default function Verify({ length, code, id, onChangeCode }: VerifyProps) {
  const [inputs, setInputs] = React.useState<string[]>(
    Array.from({ length }, (_, i) => code[i] || "")
  );

  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    onChangeCode(inputs.join(""));
  }, [inputs, onChangeCode]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9a-zA-Z]?$/.test(value)) return; // optional: restrict to alphanumeric
    const newInputs = [...inputs];
    newInputs[index] = value;

    setInputs(newInputs);

    // Move focus to next input if value entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !inputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length).split("");
    const newInputs = [...inputs];
    pastedData.forEach((char, i) => {
      newInputs[i] = char;
    });
    setInputs(newInputs);
    onChangeCode(newInputs.join(""));

    // Focus the last filled input
    const lastIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" id={id}>
      {inputs.map((value, index) => (
        <input
          key={index}
          ref={(el) => {
            if (el) inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-2xl font-medium border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-all duration-200"
        />
      ))}
    </div>
  );
}
