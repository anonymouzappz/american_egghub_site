"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#fff8e8]/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-black text-xl">
          🥚 American EggHub
        </Link>

        <div className="hidden md:flex gap-6 font-semibold">
          <Link href="/buyers">Buyers</Link>
          <Link href="/sellers">Sellers</Link>
          <Link href="/blog">Blog</Link>
        </div>

        <div className="hidden md:flex gap-3">
          <a href="https://app.americanegghub.us" className="font-bold">
            Login
          </a>
          <a
            href="https://app.americanegghub.us/seller-register"
            className="bg-green-700 text-white px-4 py-2 rounded-full font-bold"
          >
            Start Selling
          </a>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3">
          <Link href="/buyers">Buyers</Link>
          <Link href="/sellers">Sellers</Link>
          <Link href="/blog">Blog</Link>
        </div>
      )}
    </nav>
  );
}