import React from "react";
import { AppToaster } from "../../components/ui/Toast";

/**
 * Global providers shell. Auth/socket providers will nest here in later phases.
 */
export function AppProviders({ children }) {
  return (
    <>
      {children}
      <AppToaster />
    </>
  );
}

export default AppProviders;
