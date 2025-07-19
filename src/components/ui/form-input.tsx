import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  registration: UseFormRegisterReturn;
}

export function FormInput({
  error,
  registration,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <input
        {...registration}
        {...props}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
