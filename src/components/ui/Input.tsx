import React, { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  multiline?: boolean;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export const Input: React.FC<InputProps> = ({
  multiline = false,
  textareaProps,
  className = "",
  ...props
}) => {
  const baseClasses =
    "w-full bg-dashboard-card border border-dashboard-border rounded-lg p-2 text-dashboard-text placeholder-dashboard-muted focus:ring-2 focus:ring-dashboard-primary focus:outline-none transition-all duration-200";

  if (multiline) {
    // Only pass textareaProps and className to textarea
    return <textarea className={`${baseClasses} ${className}`} {...textareaProps} />;
  }

  // Only pass input props and className to input
  return <input className={`${baseClasses} ${className}`} {...props} />;
};
