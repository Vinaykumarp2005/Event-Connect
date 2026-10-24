import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  IconArrowRight,
  IconCalendar,
  IconFileSpreadsheet,
  IconLibraryPhoto,
  IconPictureInPicture,
  IconShieldCheck,
  IconSparkles,
  IconTrophy,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const liners = ["Fun", "Learning", "Opportunities", "Events", "Students", "People", "Hackathons", "WorkShops", "Seminars", "Technical Events", "Meetups"];

const features = [
  { icon: IconPictureInPicture, title: "Discover events", text: "Hackathons, workshops, fests and meetups from every club on campus, in one feed." },
  { icon: IconTrophy, title: "Earn rewards", text: "Collect reward points every time you enroll and track them on your dashboard." },
  { icon: IconCalendar, title: "Smart calendars", text: "See every event, or only the ones you joined, in a clean calendar view." },
  { icon: IconLibraryPhoto, title: "Club gallery", text: "Browse clubs by logo and jump straight to everything they are hosting." },
  { icon: IconFileSpreadsheet, title: "Participant exports", text: "Organizers export enrolled students to Excel or PDF in one click." },
  { icon: IconShieldCheck, title: "Verified accounts", text: "Email verification and role-based access keep every account genuine." },
];

// Illustrative cards for the hero, not real data
const previewEvents = [
  { category: "Hackathon", date: "Nov 14", title: "24h Build Sprint", club: "Coding Club", filled: 82 },
  { category: "Workshop", date: "Nov 20", title: "Intro to UI Design", club: "Design Society", filled: 64 },
  { category: "Meetup", date: "Dec 02", title: "Founders Fireside", club: "E-Cell", filled: 45 },
];

const lift = { whileHover: { y: -4 }, transition: { type: "spring", stiffness: 300, damping: 24 } };

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <motion.div {...lift} className="glass h-full rounded-3xl p-6">
      <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
        <Icon size={22} stroke={1.8} />
      </span>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-400">{text}</p>
    </motion.div>
  );
}

function LandingPage() {
  const navigate=useNavigate();
  const container = useRef(null);
  const [index,setIndex]=useState(0);

  useEffect(()=>{
    const interval=setInterval(()=>{setIndex((prev)=>(prev+1)%liners.length)},2200);
    return ()=>clearInterval(interval)
  },[])

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // One-time intro: hero copy, then the sample cards
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-item", { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 })
        .from(".preview-card", { y: 40, opacity: 0, duration: 0.9, stagger: 0.1 }, "-=0.5");

      // Sections fade up once as they scroll into view
      gsap.from(".feature-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".features", start: "top 80%" },
      });
      gsap.from(".cta-panel", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cta-panel", start: "top 85%" },
      });
    });

    return () => mm.revert();
  }, { scope: container });

  return (
   <div ref={container} className="relative -mx-3 -mt-24 overflow-hidden px-4 pt-24 sm:-mx-6 sm:px-6">
      {/* Backdrop: faint grid + two soft lights (static) */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:44px_44px]",
            "[background-image:linear-gradient(to_right,rgb(var(--c-white)/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--c-white)/0.06)_1px,transparent_1px)]",
            "[mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]",
          )}
        />
        <div className="absolute -top-24 left-[10%] h-72 w-72 rounded-full bg-white/[0.10] blur-[100px] sm:h-96 sm:w-96" />
        <div className="absolute right-[5%] top-[30%] h-64 w-64 rounded-full bg-neutral-400/[0.10] blur-[110px] sm:h-[28rem] sm:w-[28rem]" />
      </div>

      {/* Hero */}
      <section className="relative z-10 flex min-h-[calc(100svh-6rem)] flex-col items-center justify-center gap-12 py-12">
        <div className="flex w-full max-w-3xl flex-col items-center text-center">
          <span className="hero-item mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-300">
            <IconSparkles size={13} stroke={1.8} />
            Campus events, reimagined
          </span>

          <h1 className="hero-item text-gradient text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Find{" "}
            <span className="relative inline-flex justify-center align-bottom">
              <AnimatePresence mode="wait">
                <motion.strong
                  key={liners[index]}
                  initial={{ y: 16, opacity: 0, filter: "blur(6px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -16, opacity: 0, filter: "blur(6px)" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block font-extrabold text-white"
                >
                  {liners[index]}
                </motion.strong>
              </AnimatePresence>
            </span>
            <br />
            near you
          </h1>

          <p className="hero-item mt-6 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-lg">
            Hackathons, workshops, fests and meetups — all in one place.
            <br className="hidden sm:block" />{" "}
            Discover, enroll and earn rewards.
          </p>

          <div className="hero-item mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={()=>navigate('/signup')}
              className="btn-primary group w-full px-6 py-3 sm:w-auto"
            >
              Explore Events
              <IconArrowRight size={16} stroke={2} className="transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={()=>navigate('/signin')}
              className="btn-ghost w-full px-6 py-3 sm:w-auto"
            >
              I already have an account
            </motion.button>
          </div>
        </div>

        {/* Sample event cards */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {previewEvents.map((event, i) => (
            <div key={event.title} className={`preview-card ${i > 0 ? "hidden sm:block" : ""}`}>
              <motion.div {...lift} className="glass rounded-3xl p-5 text-left">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-black">{event.category}</span>
                  <span className="text-xs text-neutral-500">{event.date}</span>
                </div>
                <h3 className="mb-1 font-semibold text-white">{event.title}</h3>
                <p className="mb-4 text-xs text-neutral-400">{event.club}</p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-white" style={{ width: `${event.filled}%` }} />
                </div>
                <p className="mt-2 text-[11px] text-neutral-500">{event.filled}% seats filled</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features relative z-10 mx-auto max-w-6xl py-16 sm:py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">Everything in one place</p>
          <h2 className="text-gradient text-3xl font-bold tracking-tight sm:text-4xl">Built for students, clubs and admins</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="relative z-10 mx-auto max-w-4xl pb-16 sm:pb-24">
        <div className="cta-panel glass-strong flex flex-col items-center rounded-[28px] px-6 py-12 text-center sm:px-12">
          <h2 className="text-gradient mb-3 text-2xl font-bold tracking-tight sm:text-4xl">Your next event is waiting</h2>
          <p className="mb-8 max-w-md text-sm text-neutral-400 sm:text-base">
            Join as a student to enroll and earn rewards, or as an organizer to publish events.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={()=>navigate('/signup')}
            className="btn-primary px-8 py-3"
          >
            Get Started
          </motion.button>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
