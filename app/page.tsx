"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type WaitlistType = "buyer" | "seller";

type Feature = {
  title: string;
  text: string;
  icon: string;
};

type StatItem = {
  value: string;
  label: string;
};

type LandingPageContent = {
  brandName: string;
  brandTagline: string;
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroText: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  stats: StatItem[];
  features: Feature[];
  categories: string[];
  buyersTitle: string;
  buyersText: string;
  sellersTitle: string;
  sellersText: string;
  howTitle: string;
  ctaTitle: string;
  ctaText: string;
};

const fallbackContent: LandingPageContent = {
  brandName: "American EggHub",
  brandTagline: "Fresh local eggs",
  heroBadge: "Built for local farms, homesteads, and backyard sellers",
  heroTitle: "Fresh local eggs.",
  heroHighlight: "Direct from trusted sellers.",
  heroText:
    "American EggHub is preparing a local egg marketplace where buyers can find fresh eggs nearby and sellers can grow with a simple storefront.",
  primaryButtonText: "Find Eggs Near Me",
  secondaryButtonText: "Become a Seller",
  stats: [
    { value: "Coming", label: "Soon" },
    { value: "Local", label: "Pickup & delivery" },
    { value: "Free", label: "Early waitlist" },
  ],
  features: [
    {
      title: "Local Egg Marketplace",
      text: "Buy fresh eggs from farms, homesteads, and backyard sellers near you.",
      icon: "🥚",
    },
    {
      title: "Map-Based Discovery",
      text: "Find nearby sellers, pickup spots, and delivery areas from one simple map.",
      icon: "🗺️",
    },
    {
      title: "Seller Storefronts",
      text: "Approved sellers get a clean storefront to list eggs, chicks, and farm goods.",
      icon: "🏪",
    },
    {
      title: "Pickup & Delivery",
      text: "Sellers can offer local pickup, delivery, or both depending on their setup.",
      icon: "🚚",
    },
  ],
  categories: [
    "Chicken Eggs",
    "Duck Eggs",
    "Quail Eggs",
    "Fertilized Eggs",
    "Chicks",
    "Farm Goods",
  ],
  buyersTitle: "Find fresh eggs without guessing who sells nearby.",
  buyersText:
    "Join the buyer waitlist and get notified when American EggHub launches in your area.",
  sellersTitle: "Turn your eggs into a local storefront.",
  sellersText:
    "Join the seller waitlist and get early access when seller onboarding opens.",
  howTitle: "A simple path from local seller to local buyer.",
  ctaTitle: "American EggHub is launching soon.",
  ctaText:
    "Join the waitlist today and be first to know when local egg buying and selling opens.",
};

export default function Home() {
  const [content, setContent] = useState<LandingPageContent>(fallbackContent);

  const [screen, setScreen] = useState<WaitlistType | null>(null);

  useEffect(() => {
    const ref = doc(db, "siteContent", "landingPage");

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setContent({
          ...fallbackContent,
          ...(snap.data() as Partial<LandingPageContent>),
        });
      }
    });

    return () => unsub();
  }, []);

  if (screen) {
    return (
      <ComingSoonScreen
        type={screen}
        brandName={content.brandName}
        onBack={() => setScreen(null)}
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8e8] text-[#1f241d]">
      <EggBackground />

      <nav className="sticky top-0 z-50 border-b border-black/5 bg-[#fff8e8]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-4">
            <Logo />
            <div>
              <p className="text-xl font-black leading-none">
                {content.brandName}
              </p>
              <p className="mt-1 text-xs font-bold text-black/50">
                {content.brandTagline}
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-black md:flex">
            {["buyers", "sellers", "pricing", "how", "categories"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="capitalize text-black/65 transition hover:text-[#2f6b3b]"
              >
                {item === "how" ? "How it Works" : item}
              </a>
            ))}
          </div>

          <button
            onClick={() => setScreen("seller")}
            className="rounded-full bg-[#2f6b3b] px-5 py-3 text-sm font-black text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-1 hover:bg-[#255832]"
          >
            Seller Waitlist
          </button>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2f6b3b]/15 bg-white/80 px-4 py-2 text-sm font-black text-[#2f6b3b] shadow-sm backdrop-blur">
              <span className="animate-bounce">🚜</span>
              {content.heroBadge}
            </div>
          

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#2f6b3b]/10 px-4 py-2 text-sm font-black text-[#2f6b3b]">
              🌴 Launching First In Southwest Florida
            </div>
            <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-7xl">
              {content.heroTitle}{" "}
              <span className="relative inline-block text-[#2f6b3b]">
                {content.heroHighlight}
                <span className="absolute -bottom-2 left-0 h-3 w-full rounded-full bg-[#f4b400]/35" />
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-black/65 md:text-xl">
              {content.heroText}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => setScreen("buyer")}
                className="rounded-full bg-[#2f6b3b] px-8 py-4 text-center text-base font-black text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-1 hover:bg-[#255832]"
              >
                {content.primaryButtonText}
              </button>

              <button
                onClick={() => setScreen("seller")}
                className="rounded-full border border-black/10 bg-white px-8 py-4 text-center text-base font-black text-[#2f6b3b] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {content.secondaryButtonText}
              </button>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {content.stats.map((stat, index) => (
                <Stat
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  delay={index}
                />
              ))}
            </div>
          </div>

          <HeroPreview />
        </div>
      </section>
<section id="pricing" className="mx-auto max-w-7xl px-6 py-16">
  <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
    <div className="rounded-[2.3rem] bg-white/90 p-8 shadow-2xl shadow-black/5 backdrop-blur md:p-12">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#2f6b3b]/10 px-4 py-2 text-sm font-black text-[#2f6b3b]">
        💸 Simple Seller Pricing
      </div>

      <h2 className="max-w-3xl text-4xl font-black md:text-5xl">
        No monthly fees to start selling locally.
      </h2>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-black/60">
        American EggHub is built to help local farms, homesteads, and backyard
        egg sellers get started without upfront cost. We only make money when
        sellers make money.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <PricingMiniCard value="$0" label="Monthly fee to start" />
        <PricingMiniCard value="5%" label="Marketplace fee per sale" />
        <PricingMiniCard value="Free" label="Early waitlist access" />
      </div>

      <button
        onClick={() => setScreen("seller")}
        className="mt-8 rounded-full bg-[#2f6b3b] px-8 py-4 font-black text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-1 hover:bg-[#255832]"
      >
        Join Seller Waitlist
      </button>
    </div>

    <div className="rounded-[2.3rem] bg-[#2f6b3b] p-8 text-white shadow-2xl shadow-green-950/20 md:p-10">
      <p className="font-black text-[#ffe8a3]">Why this works</p>

      <div className="mt-7 space-y-5">
        <PricingReason
          title="Low risk for sellers"
          text="No subscription pressure before they make sales."
        />
        <PricingReason
          title="Built for small & large farms"
          text="Perfect for backyard sellers and homesteads starting small or already big."
        />
        <PricingReason
          title="Growth-friendly"
          text="Later, sellers can upgrade with featured placement and boosted map visibility."
        />
      </div>
    </div>
  </div>
</section>
      <section id="buyers" className="mx-auto max-w-7xl px-6 py-16">
        <AnimatedCard>
          <p className="font-black text-[#2f6b3b]">For Buyers</p>
          <h2 className="mt-3 text-4xl font-black">{content.buyersTitle}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-black/60">
            {content.buyersText}
          </p>
          <button
            onClick={() => setScreen("buyer")}
            className="mt-7 rounded-full bg-[#2f6b3b] px-7 py-4 font-black text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-1"
          >
            Join Buyer Waitlist
          </button>
        </AnimatedCard>
      </section>

      <section id="sellers" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-[#2f6b3b] p-8 text-white shadow-xl shadow-green-950/20 transition hover:-translate-y-1 md:p-12">
            <p className="font-black text-[#ffe8a3]">For Sellers</p>
            <h2 className="mt-3 text-4xl font-black">{content.sellersTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-white/75">
              {content.sellersText}
            </p>

            <button
              onClick={() => setScreen("seller")}
              className="mt-8 inline-block rounded-full bg-[#f4b400] px-7 py-4 font-black text-black shadow-lg shadow-black/10 transition hover:-translate-y-1"
            >
              Join Seller Waitlist
            </button>
          </div>

          <div className="grid gap-5">
            {content.features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-[1.6rem] bg-white/85 p-6 shadow-lg shadow-black/5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[1.4rem] bg-[#ffe8a3] text-3xl transition group-hover:rotate-6 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{feature.title}</h3>
                    <p className="mt-1 text-black/60">{feature.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-6 py-16">
        <p className="font-black text-[#2f6b3b]">Marketplace Categories</p>
        <h2 className="mt-2 text-4xl font-black">
          More than just chicken eggs.
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.categories.map((category) => (
            <div
              key={category}
              className="group rounded-[1.8rem] border border-black/5 bg-white/85 p-6 shadow-sm backdrop-blur transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="mb-5 grid h-16 w-16 place-items-center rounded-[1.5rem] bg-gradient-to-br from-[#ffe8a3] to-[#f4b400] text-4xl transition group-hover:rotate-6">
                🥚
              </div>
              <h3 className="text-xl font-black">{category}</h3>
              <p className="mt-2 text-sm leading-6 text-black/55">
                Coming soon for local sellers and buyers.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[2.3rem] bg-[#171a14] p-8 text-white shadow-2xl shadow-black/20 md:p-12">
          <p className="font-black text-[#f4b400]">How It Works</p>
          <h2 className="mt-2 text-4xl font-black">{content.howTitle}</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Step
              number="01"
              title="Join the waitlist"
              text="Buyers and sellers can sign up early before full launch."
            />
            <Step
              number="02"
              title="Get launch updates"
              text="We will notify you when American EggHub opens in your area."
            />
            <Step
              number="03"
              title="Start local"
              text="Buyers find fresh eggs. Sellers open storefronts and reach nearby customers."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#f4b400] p-8 text-center shadow-2xl shadow-yellow-900/20 md:p-14">
          <h2 className="relative text-4xl font-black md:text-5xl">
            {content.ctaTitle}
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg font-semibold text-black/65">
            {content.ctaText}
          </p>

          <div className="relative mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => setScreen("buyer")}
              className="rounded-full bg-[#2f6b3b] px-8 py-4 font-black text-white shadow-xl shadow-green-900/20"
            >
              Find Eggs Soon
            </button>
            <button
              onClick={() => setScreen("seller")}
              className="rounded-full bg-white px-8 py-4 font-black text-[#2f6b3b] shadow-xl"
            >
              Sell Eggs Soon
            </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-black/5 bg-white/60 px-6 py-8 backdrop-blur">
  <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
    <div className="flex items-center gap-3">
      <Logo small />
      <div>
        <p className="font-black text-[#2f6b3b]">American EggHub</p>
        <p className="text-sm font-semibold text-black/50">
          Fresh local eggs in Southwest Florida.
        </p>
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-center gap-5 text-sm font-black text-black/60">
      <Link href="/privacy-policy" className="transition hover:text-[#2f6b3b]">
        Privacy Policy
      </Link>

      <Link href="/terms" className="transition hover:text-[#2f6b3b]">
        Terms of Service
      </Link>

      <a href="#buyers" className="transition hover:text-[#2f6b3b]">
        Buyers
      </a>

      <a href="#sellers" className="transition hover:text-[#2f6b3b]">
        Sellers
      </a>
    </div>
  </div>
</footer>

      <GlobalStyles />
    </main>
  );
}

function PricingMiniCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[1.6rem] bg-[#fff8e8] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <p className="text-4xl font-black text-[#2f6b3b]">{value}</p>
      <p className="mt-2 text-sm font-black text-black/55">{label}</p>
    </div>
  );
}

function PricingReason({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl bg-white/10 p-5">
      <p className="font-black">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/70">{text}</p>
    </div>
  );
}

function ComingSoonScreen({
  type,
  brandName,
  onBack,
}: {
  type: WaitlistType;
  brandName: string;
  onBack: () => void;
}) {
  const isBuyer = type === "buyer";

  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [farmName, setFarmName] = useState("");
  const [location, setLocation] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [message, setMessage] = useState("");

  const page = useMemo(() => {
    if (isBuyer) {
      return {
        badge: "Buyer Early Access",
        title: "Fresh local eggs for Southwest Florida.",
        text: "Join the buyer waitlist and we’ll notify you when American EggHub launches near your area.",
        button: "Join Buyer Waitlist",
        icon: "🥚",
        bullets: [
          "Find fresh eggs from local Southwest Florida farms and homesteads.",
          "Discover pickup and delivery options",
          "Support local farms and homesteads",
          "Get notified when your area opens",
        ],
      };
    }

    return {
      badge: "Seller Early Access",
      title: "Southwest Florida egg sellers — your marketplace is coming.",
      text: "Join the seller waitlist and get notified when American EggHub opens seller onboarding.",
      button: "Join Seller Waitlist",
      icon: "🐔",
      bullets: [
        "Get your own seller storefront",
        "List eggs, chicks, and farm goods",
        "Reach nearby buyers",
        "Prepare before full marketplace launch",
      ],
    };
  }, [isBuyer]);

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanZip = zipCode.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setMessage("Please enter a valid email.");
      return;
    }

    if (!cleanZip) {
      setMessage("Please enter your City or ZIP Code.");
      return;
    }

    try {
      setIsJoining(true);
      setMessage("");

      const safeEmailId = cleanEmail.replaceAll(".", "_").replaceAll("@", "_");

      await setDoc(
        doc(db, "waitlist", `${type}_${safeEmailId}`),
        {
          email: cleanEmail,
          type,
          zipCode: cleanZip,
          farmName: farmName.trim(),
          location: location.trim(),
          source: isBuyer ? "buyer_coming_soon" : "seller_coming_soon",
          isActive: true,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );

      await setDoc(
        doc(db, "emailSubscribers", safeEmailId),
        {
          email: cleanEmail,
          audience: type,
          source: isBuyer ? "buyer_coming_soon" : "seller_coming_soon",
          zipCode: cleanZip,
          isActive: true,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );

      await setDoc(doc(collection(db, "mail")), {
        to: cleanEmail,
        message: {
          subject: `You're on the ${brandName} waitlist`,
          html: `
            <div style="font-family:Arial,sans-serif;background:#fff8e8;padding:30px;">
              <div style="max-width:620px;margin:auto;background:white;border-radius:24px;padding:30px;border:1px solid #eee;">
                <h1 style="color:#2f6b3b;margin-top:0;">Welcome to ${brandName} 🥚</h1>
                <p>Thanks for joining the ${isBuyer ? "buyer" : "seller"} waitlist.</p>
                <p>We'll keep you updated as American EggHub gets ready to launch in your area.</p>
                <p style="margin-top:30px;font-size:12px;color:#777;">
                  You received this because you joined the American EggHub waitlist.
                </p>
              </div>
            </div>
          `,
        },
        createdAt: serverTimestamp(),
      });

      setEmail("");
      setZipCode("");
      setFarmName("");
      setLocation("");
      setMessage("You're on the waitlist! Check your email.");
    } catch (error: any) {
      console.error(error);
      setMessage(error?.message ?? "Something went wrong.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8e8] text-[#1f241d]">
      <EggBackground />

      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <button
          onClick={onBack}
          className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#2f6b3b] shadow-sm transition hover:-translate-y-1"
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          <Logo small />
          <p className="font-black">{brandName}</p>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_460px] lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2f6b3b]/15 bg-white/80 px-4 py-2 text-sm font-black text-[#2f6b3b] shadow-sm backdrop-blur">
            <span>{page.icon}</span>
            {page.badge}
          </div>

          <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-7xl">
            {page.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/65 md:text-xl">
            {page.text}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {page.bullets.map((bullet) => (
              <div
                key={bullet}
                className="rounded-2xl bg-white/85 p-5 font-bold text-black/65 shadow-sm"
              >
                <span className="mr-2 text-[#2f6b3b]">✓</span>
                {bullet}
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleJoinWaitlist}
          className="rounded-[2.5rem] bg-white/90 p-6 shadow-2xl shadow-black/10 backdrop-blur md:p-8"
        >
          <div className="mb-6 grid h-20 w-20 place-items-center rounded-[2rem] bg-[#ffe8a3] text-4xl">
            {page.icon}
          </div>

          <h2 className="text-3xl font-black">Join the waitlist</h2>
          <p className="mt-2 text-sm font-semibold text-black/50">
            We’ll email you when early access opens.
          </p>

          <div className="mt-7 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="min-h-[56px] w-full rounded-2xl border border-black/10 bg-[#fff8e8] px-5 font-bold outline-none transition focus:border-[#2f6b3b] focus:ring-4 focus:ring-[#2f6b3b]/10"
            />

            <input
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="City or ZIP Code"
              className="min-h-[56px] w-full rounded-2xl border border-black/10 bg-[#fff8e8] px-5 font-bold outline-none transition focus:border-[#2f6b3b] focus:ring-4 focus:ring-[#2f6b3b]/10"
            />

            {!isBuyer && (
              <>
                <input
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="Farm / business name"
                  className="min-h-[56px] w-full rounded-2xl border border-black/10 bg-[#fff8e8] px-5 font-bold outline-none transition focus:border-[#2f6b3b] focus:ring-4 focus:ring-[#2f6b3b]/10"
                />

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City / service area"
                  className="min-h-[56px] w-full rounded-2xl border border-black/10 bg-[#fff8e8] px-5 font-bold outline-none transition focus:border-[#2f6b3b] focus:ring-4 focus:ring-[#2f6b3b]/10"
                />
              </>
            )}

            <button
              type="submit"
              disabled={isJoining}
              className="min-h-[58px] w-full rounded-full bg-[#2f6b3b] px-7 font-black text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-1 hover:bg-[#255832] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isJoining ? "Joining..." : page.button}
            </button>

            {message && (
              <p className="rounded-2xl bg-[#fff8e8] p-4 text-sm font-black text-black/60">
                {message}
              </p>
            )}
          </div>
        </form>
      </section>

      <GlobalStyles />
    </main>
  );
}

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#ffe8a3] to-[#f4b400] p-1 shadow-lg shadow-yellow-900/10 ${
        small ? "h-12 w-12" : "h-16 w-16"
      }`}
    >
      <div className="grid h-full w-full place-items-center rounded-[1.25rem] bg-white/70">
        <img
          src="/assets/images/american_egghub.png"
          alt="American EggHub logo"
          className={
            small ? "h-10 w-10 object-contain" : "h-14 w-14 object-contain"
          }
        />
      </div>
    </div>
  );
}

function EggBackground() {
  return (
    <>
      <div className="pointer-events-none absolute left-[-120px] top-20 h-80 w-80 rounded-full bg-[#f4b400]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-[420px] h-96 w-96 rounded-full bg-[#2f6b3b]/15 blur-3xl" />
      <div className="egg-float pointer-events-none absolute left-[8%] top-[210px] hidden h-20 w-14 rotate-12 rounded-[50%] bg-white/45 shadow-xl md:block" />
      <div className="egg-float pointer-events-none absolute right-[12%] top-[160px] hidden h-16 w-11 -rotate-12 rounded-[50%] bg-[#ffe8a3]/55 shadow-xl md:block" />
    </>
  );
}

function HeroPreview() {
  return (
    <div className="rounded-[2.5rem] bg-[#2f6b3b] p-4 shadow-2xl shadow-green-950/25">
      <div className="overflow-hidden rounded-[2rem] bg-[#fff8e8]">
        <div className="bg-[#ffe8a3] p-5">
          <p className="text-sm font-black text-[#2f6b3b]">Coming Soon</p>
          <h3 className="text-2xl font-black">Local Egg Discovery</h3>
        </div>

        <div className="space-y-4 p-5">
          <div className="h-48 rounded-3xl bg-[#2f6b3b] p-4 text-white">
            <div className="flex h-full flex-col justify-between">
              <div className="flex gap-2">
                <Badge>Buyer waitlist</Badge>
                <Badge>Seller waitlist</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <MapPin name="Fresh Eggs" />
                <MapPin name="Local Farms" />
                <MapPin name="Pickup Soon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  delay = 0,
}: {
  value: string;
  label: string;
  delay?: number;
}) {
  return (
    <div
      className="rounded-2xl bg-white/85 p-4 shadow-lg shadow-black/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
      style={{ animation: `fadeUp .7s ease ${delay * 100}ms both` }}
    >
      <p className="text-xl font-black text-[#2f6b3b]">{value}</p>
      <p className="text-xs font-bold text-black/50">{label}</p>
    </div>
  );
}

function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[2rem] bg-white/85 p-8 shadow-xl shadow-black/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl md:p-12">
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black">
      {children}
    </span>
  );
}

function MapPin({ name }: { name: string }) {
  return (
    <div className="rounded-2xl bg-white/15 p-3 text-center">
      <div className="text-2xl">📍</div>
      <p className="mt-1 text-xs font-black">{name}</p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl bg-white/10 p-6">
      <p className="text-sm font-black text-[#f4b400]">{number}</p>
      <h3 className="mt-3 text-2xl font-black">{title}</h3>
      <p className="mt-3 leading-7 text-white/65">{text}</p>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      @keyframes floatEgg {
        0%,
        100% {
          transform: translateY(0) rotate(0deg);
        }
        50% {
          transform: translateY(-18px) rotate(6deg);
        }
      }

      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(24px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-up {
        animation: fadeUp 0.8s ease both;
      }

      .egg-float {
        animation: floatEgg 5s ease-in-out infinite;
      }
    `}</style>
  );
}
