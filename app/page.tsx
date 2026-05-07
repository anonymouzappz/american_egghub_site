"use client";

import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  appUrl: string;
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
  appUrl: "https://app.americanegghub.us",
  brandName: "American EggHub",
  brandTagline: "Fresh local eggs",
  heroBadge: "Built for local farms, homesteads, and backyard sellers",
  heroTitle: "Fresh local eggs.",
  heroHighlight: "Direct from trusted sellers.",
  heroText:
    "American EggHub connects buyers with local egg sellers through map-based discovery, storefronts, pickup, delivery, and seller approval for a safer local marketplace.",
  primaryButtonText: "Find Eggs Near Me",
  secondaryButtonText: "Become a Seller",
  stats: [
    { value: "100+", label: "Seller goal" },
    { value: "5%", label: "Platform fee" },
    { value: "Local", label: "Pickup & delivery" },
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
      text: "Every approved seller gets a clean storefront to list eggs, chicks, and farm goods.",
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
    "Browse approved sellers, view storefronts, check pickup and delivery options, and discover local egg sources from a clean map.",
  sellersTitle: "Turn your eggs into a local storefront.",
  sellersText:
    "Create your store, add your location, upload banners and logos, list categories, and get discovered by buyers in your area.",
  howTitle: "A simple path from local seller to local buyer.",
  ctaTitle: "Ready to join American EggHub?",
  ctaText:
    "Buyers can find fresh eggs nearby. Sellers can build a real local storefront without building a website from scratch.",
};

// keep your same types + fallbackContent here...

export default function Home() {
  const [content, setContent] = useState<LandingPageContent>(fallbackContent);
  const sellersRef = useRef<HTMLElement | null>(null);
  const [showSellers, setShowSellers] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState("");

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSellers(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );

    if (sellersRef.current) {
      observer.observe(sellersRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const appUrl = content.appUrl;

  const seedFirebaseContent = async () => {
    try {
      await setDoc(
        doc(db, "siteContent", "landingPage"),
        {
          ...fallbackContent,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      alert("Seeded successfully!");
    } catch (error: any) {
      alert(error?.message ?? "Seed failed");
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
  e.preventDefault();

  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes("@")) {
    setSubscribeMessage("Please enter a valid email.");
    return;
  }

  try {
    setIsSubscribing(true);
    setSubscribeMessage("");

    await addDoc(collection(db, "emailSubscribers"), {
      email: cleanEmail,
      source: "landing_page",
      isActive: true,
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, "mail"), {
      to: cleanEmail,
      message: {
        subject: "Welcome to American EggHub",
        html: `
          <h1>Welcome to American EggHub 🥚</h1>
          <p>Thanks for subscribing!</p>
          <p>We'll keep you updated as we launch.</p>
        `,
      },
      createdAt: serverTimestamp(),
    });

    setEmail("");
    setSubscribeMessage("You're subscribed! Check your email.");
  } catch (error: any) {
    console.error("Subscribe error:", error);
    setSubscribeMessage(error?.message ?? "Subscribe failed.");
  } finally {
    setIsSubscribing(false);
  }
};

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8e8] text-[#1f241d]">
      <EggBackground />

      <nav className="sticky top-0 z-50 border-b border-black/5 bg-[#fff8e8]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#ffe8a3] to-[#f4b400] p-1 shadow-lg shadow-yellow-900/10 transition duration-300 group-hover:scale-105 group-hover:rotate-3">
              <div className="grid h-full w-full place-items-center rounded-[1.25rem] bg-white/70">
                <img
                  src="/assets/images/american_egghub.png"
                  alt="American EggHub logo"
                  className="h-14 w-14 object-contain"
                />
              </div>
            </div>

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
            {["buyers", "sellers", "how", "categories"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="capitalize text-black/65 transition hover:text-[#2f6b3b]"
              >
                {item === "how" ? "How it Works" : item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={appUrl}
              className="hidden rounded-full px-5 py-3 text-sm font-black text-[#2f6b3b] transition hover:bg-white md:block"
            >
              Sign In
            </Link>

            <Link
              href={`${appUrl}/seller-register`}
              className="rounded-full bg-[#2f6b3b] px-5 py-3 text-sm font-black text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-1 hover:bg-[#255832]"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2f6b3b]/15 bg-white/80 px-4 py-2 text-sm font-black text-[#2f6b3b] shadow-sm backdrop-blur">
              <span className="animate-bounce">🚜</span>
              {content.heroBadge}
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
              <Link
                href={appUrl}
                className="rounded-full bg-[#2f6b3b] px-8 py-4 text-center text-base font-black text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-1 hover:bg-[#255832]"
              >
                {content.primaryButtonText}
              </Link>

              <Link
                href={`${appUrl}/seller-register`}
                className="rounded-full border border-black/10 bg-white px-8 py-4 text-center text-base font-black text-[#2f6b3b] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {content.secondaryButtonText}
              </Link>
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

      <section id="buyers" className="mx-auto max-w-7xl px-6 py-16">
        <AnimatedCard>
          <p className="font-black text-[#2f6b3b]">For Buyers</p>
          <h2 className="mt-3 text-4xl font-black">{content.buyersTitle}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-black/60">
            {content.buyersText}
          </p>
        </AnimatedCard>
      </section>

      <section
        ref={sellersRef}
        id="sellers"
        className="mx-auto max-w-7xl px-6 py-16"
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div
            className={`rounded-[2rem] bg-[#2f6b3b] p-8 text-white shadow-xl shadow-green-950/20 transition hover:-translate-y-1 md:p-12 ${
              showSellers ? "animate-slide-left" : "opacity-0"
            }`}
          >
            <p className="font-black text-[#ffe8a3]">For Sellers</p>
            <h2 className="mt-3 text-4xl font-black">{content.sellersTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-white/75">
              {content.sellersText}
            </p>

            <Link
              href={`${appUrl}/seller-register`}
              className="mt-8 inline-block rounded-full bg-[#f4b400] px-7 py-4 font-black text-black shadow-lg shadow-black/10 transition hover:-translate-y-1"
            >
              Apply as Seller
            </Link>
          </div>

          <div className="grid gap-5">
            {content.features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group rounded-[1.6rem] bg-white/85 p-6 shadow-lg shadow-black/5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  showSellers ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 120 + 250}ms` }}
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
                Sellers can organize storefronts by category so buyers can find
                what they need faster.
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
              title="Seller creates store"
              text="Add logo, banner, location, pickup, delivery, and categories."
            />
            <Step
              number="02"
              title="Admin approves"
              text="Seller accounts can be reviewed before marketplace access."
            />
            <Step
              number="03"
              title="Buyers discover"
              text="Buyers browse the map, open storefronts, and connect locally."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white/90 p-8 shadow-2xl shadow-black/5 backdrop-blur md:p-12">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#f4b400]/25 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#2f6b3b]/15 blur-2xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <p className="font-black text-[#2f6b3b]">Stay Updated</p>
              <h2 className="mt-2 text-4xl font-black">
                Get notified when American EggHub launches near you.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-black/60">
                Join the early list for local egg updates, seller openings,
                marketplace news, and launch announcements.
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="rounded-[2rem] bg-[#fff8e8] p-4 shadow-inner"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="min-h-[56px] flex-1 rounded-full border border-black/10 bg-white px-5 text-base font-bold outline-none transition focus:border-[#2f6b3b] focus:ring-4 focus:ring-[#2f6b3b]/10"
                />

                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="min-h-[56px] rounded-full bg-[#2f6b3b] px-7 font-black text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-1 hover:bg-[#255832] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubscribing ? "Joining..." : "Subscribe"}
                </button>
              </div>

              {subscribeMessage && (
                <p className="mt-3 text-sm font-bold text-black/60">
                  {subscribeMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#f4b400] p-8 text-center shadow-2xl shadow-yellow-900/20 md:p-14">
          <div className="absolute -left-10 -top-10 h-32 w-24 rotate-12 rounded-[50%] bg-white/30" />
          <div className="absolute -bottom-12 right-10 h-40 w-28 -rotate-12 rounded-[50%] bg-white/25" />

          <h2 className="relative text-4xl font-black md:text-5xl">
            {content.ctaTitle}
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg font-semibold text-black/65">
            {content.ctaText}
          </p>
        </div>
      </section>

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
    </main>
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
          <p className="text-sm font-black text-[#2f6b3b]">Nearby Storefront</p>
          <h3 className="text-2xl font-black">K & P Farm</h3>
        </div>

        <div className="space-y-4 p-5">
          <div className="h-48 rounded-3xl bg-[#2f6b3b] p-4 text-white">
            <div className="flex h-full flex-col justify-between">
              <div className="flex gap-2">
                <Badge>Map View</Badge>
                <Badge>3 sellers nearby</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <MapPin name="Farm Stand" />
                <MapPin name="Duck Eggs" />
                <MapPin name="Pickup" />
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
