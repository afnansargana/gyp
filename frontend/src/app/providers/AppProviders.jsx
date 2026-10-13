import React from "react";
import { CartProvider } from "../../Components/CartContext";
import { AppToaster } from "../../Components/ui/Toast";
import { SocketBridge } from "./SocketBridge";

export function AppProviders({ children }) {
  return (
    <CartProvider>
      {children}
      <SocketBridge />
      <AppToaster />
    </CartProvider>
  );
}

export default AppProviders;
