import React, { type ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
  show?: boolean; // control when tooltip should appear
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children, show = true }) => {
  if (!show) return <>{children}</>; // render only the children if tooltip is disabled

  return (
    <div className="relative flex items-center group">
      {children}
      <span
        className="
          absolute left-full top-1/2 -translate-y-1/2
          ml-2 whitespace-nowrap bg-dashboard-card text-dashboard-text text-sm px-2 py-1 rounded
          opacity-0 translate-x-[-5px] group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-200 ease-out shadow-lg z-50
        "
      >
        {text}
      </span>
    </div>
  );
};
