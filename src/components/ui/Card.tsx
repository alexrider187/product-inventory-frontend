import React, { type ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  shadow?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverable = true,
  shadow = "shadow-md",
}) => {
  return (
    <div
      className={`bg-dashboard-card border border-dashboard-border rounded-lg p-4 transition-all duration-300 ${shadow} ${
        hoverable ? "hover:shadow-xl hover:scale-[1.02]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export interface CardSubProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardSubProps> = ({ children, className = "" }) => (
  <div className={`mb-2 font-bold text-dashboard-text text-lg ${className}`}>{children}</div>
);

export const CardBody: React.FC<CardSubProps> = ({ children, className = "" }) => (
  <div className={`text-dashboard-text ${className}`}>{children}</div>
);

export const CardFooter: React.FC<CardSubProps> = ({ children, className = "" }) => (
  <div className={`mt-4 text-dashboard-muted text-sm ${className}`}>{children}</div>
);
