"use client";

import dynamic from "next/dynamic";

// Dynamic import solo en cliente
const InvestmentModal = dynamic(() => import("./InvestmentModal"), {
  ssr: false,
});

export default function InvestmentModalWrapper() {
  return <InvestmentModal />;
}
