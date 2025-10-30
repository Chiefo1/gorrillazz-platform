"use client";

import { WalletProvider } from "@/lib/wallet-context";
import { Suspense } from "react";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <Suspense fallback={null}>{children}</Suspense>
    </WalletProvider>
  );
}
