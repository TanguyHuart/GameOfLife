'use client'

import React, { useState, useEffect } from "react";

export default function ClientOnlyWrapper({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Empêche tout rendu côté serveur
  }

  return <>{children}</>;
}