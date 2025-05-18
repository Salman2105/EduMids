import React from "react";
import Index from "../pages/index";

export default function AuthLayout({ children }) {
  return (
    <div>
      
      <Index />
      <div>{children}</div>
    </div>
  );
}           
