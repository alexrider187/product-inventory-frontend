import React from "react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  colorClass?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  colorClass = "text-dashboard-primary",
  className = "",
}) => {
  const SIZE_MAP: Record<string, string> = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };
  const dimension = SIZE_MAP[size];

  return (
    <div className={`inline-block ${className}`}>
      <div className={`border-4 border-t-dashboard-primary border-dashboard-border rounded-full animate-spin ${dimension} ${colorClass}`}></div>
    </div>
  );
};
