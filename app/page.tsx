// app/page.tsx
"use client";

import dynamic from "next/dynamic";

const FarmScene = dynamic(() => import("./three-farm/FarmScene"), {
  ssr: false,
});

export default function HomePage() {
  return <FarmScene />;
}