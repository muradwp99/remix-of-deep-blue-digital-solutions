import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { BentoShowcase } from "@/components/bento-features";
import { useScrollReveal } from "@/lib/animations";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowUpRight,
  Zap,
  ShieldCheck,
  Layers,
  Code2,
  Palette,
  Smartphone,
  Brain,
  ShoppingCart,
  Building2,
  Stethoscope,
  Coins,
  Check,
  X,
  BadgeCheck,
  Star,
  Bookmark,
  Flame,
  Clock,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Northline — Premium Software Agency" },
      {
        name: "description",
        content:
          "Boutique software studio designing and engineering websites, apps, ecommerce, and SaaS products for ambitious teams.",
      },
    ],
  }),
  component: HomePage,
});

const clients = ["Meridian", "Halcyon", "Northwind", "Orbital", "Cascade", "Vantage", "Ridgeline"];

const capabilities = [
  { icon: Code2, title: "Custom Software", desc: "Web platforms engineered for speed, scale and reliability." },
  { icon: Palette, title: "UI/UX Design", desc: "Interfaces that feel obvious. Systems that scale." },
  { icon: Smartphone, title: "Mobile Apps", desc: "iOS, Android, and cross-platform, built to ship." },
  { icon: Brain, title: "AI Solutions", desc: "LLM-powered workflows integrated where it matters." },
];

const solutions = [
  { icon: ShoppingCart, title: "Ecommerce", desc: "Headless and platform stores that convert." },
  { icon: Layers, title: "SaaS Products", desc: "MVP to scale — auth, billing, dashboards." },
  { icon: Building2, title: "Fintech", desc: "Compliant, secure, and beautifully designed." },
  { icon: Stethoscope, title: "Healthcare", desc: "HIPAA-ready portals, apps, and dashboards." },
];

const process = [
  { n: "01", t: "Discovery", d: "Deep-dive workshops to align on goals, users, and success metrics." },
  { n: "02", t: "Design", d: "Wireframes, prototypes, and pixel-perfect interfaces validated with users." },
  { n: "03", t: "Build", d: "Engineering-first execution with weekly demos and transparent progress." },
  { n: "04", t: "Scale", d: "Launch, measure, iterate. Long-term partnership beyond delivery." },
];

const work = [
  {
    name: "Northwind SaaS",
    tag: "SaaS Rebrand",
    result: "+184% signups",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=70",
  },
  {
    name: "Halcyon Health",
    tag: "Mobile App",
    result: "4.9★ App Store",
    img: "https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?auto=format&fit=crop&w=1200&q=70",
  },
  {
    name: "Meridian Retail",
    tag: "Ecommerce",
    result: "3.1× revenue",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=70",
  },
  {
    name: "Orbital Cloud",
    tag: "Marketing Site",
    result: "98 Lighthouse",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=70",
  },
];

const testimonials = [
  {
    q: "Northline shipped in weeks what our previous partner promised in quarters. The bar for craft is off the charts.",
    a: "Emily Carter",
    r: "CTO, Northwind",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=70",
  },
  {
    q: "They think like founders. Every trade-off was made with our business outcome in mind — rare and invaluable.",
    a: "Marcus Chen",
    r: "Founder, Halcyon",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=70",
  },
  {
    q: "The team is genuinely senior. Code quality, design polish, communication — all top-tier.",
    a: "Priya Shah",
    r: "VP Product, Meridian",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=70",
  },
];

const kickoff = [
  {
    day: "Day 1",
    t: "Kickoff & access",
    d: "Shared Slack, repo, and board set up. You meet the whole pod — no bait and switch.",
  },
  {
    day: "Day 3",
    t: "Clickable prototype",
    d: "The core flow, tappable in your browser. Direction validated before code is written.",
  },
  {
    day: "Day 7",
    t: "First live demo",
    d: "Real features running in staging. Weekly demos from here on out.",
  },
  {
    day: "Day 14",
    t: "Shippable slice",
    d: "A production-quality vertical slice, plus a costed roadmap for the rest.",
  },
];

const compareTypical = [
  "Sales closes the deal, then juniors do the work",
  "Monthly PDF status reports",
  "Design thrown over the wall to developers",
  "A change order for every tweak",
  "Code you can't take with you",
];

const compareNorthline = [
  "The seniors you meet are the ones who build",
  "Weekly live demos in staging",
  "One pod — design and engineering together",
  "Transparent scope and pricing up front",
  "Full IP and repo handover from day one",
];

const faqs = [
  { q: "How quickly can we start?", a: "Typically within 1–2 weeks. We'll scope discovery and align on a start date on our first call." },
  { q: "Do you work with startups or enterprise?", a: "Both. We tailor process and team composition — the craft standard doesn't change." },
  { q: "What's your pricing model?", a: "Fixed-scope projects, monthly retainers, and dedicated pods. We recommend the fit after discovery." },
  { q: "Who owns the code and IP?", a: "You do. Full transfer on delivery, with clean docs and repository handover." },
  { q: "Do you offer post-launch support?", a: "Yes — 84% of our clients continue on a Care plan for maintenance, iteration, and growth." },
];

function HomePage() {
  useScrollReveal();

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yCards = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <SiteShell>
      <div ref={containerRef} className="relative bg-background">
        {/* New Hero from home-5 */}
        <div className="relative flex flex-col items-center overflow-hidden pt-24 pb-4">
          
        {/* Background glowing gradient and grid */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[800px] h-[500px] bg-lime opacity-[0.15] blur-[120px] rounded-[100%] pointer-events-none" />
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
            backgroundPosition: 'center center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

        {/* Trust Badge */}
        <div className="flex items-center gap-3 mb-8 relative z-10">
           <span className="text-sm font-medium text-foreground/80">Trusted By</span>
           <div className="flex -space-x-3">
             {[
               "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=70",
               "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=70",
               "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=70",
               "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=70",
               "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=70",
             ].map((a, i) => (
               <img key={i} src={a} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
             ))}
           </div>
           <span className="text-sm font-medium text-foreground/80">25+ Founders & Leaders</span>
           <div className="flex items-center gap-0.5 ml-2">
             {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-lime text-lime" />)}
           </div>
        </div>

        {/* Hero Copy */}
        <h1 className="text-center text-4xl md:text-5xl lg:text-[4.5rem] font-display font-semibold leading-[1.1] tracking-tight max-w-[1100px] mb-6 relative z-10">
          <span className="block text-foreground">BOOST YOUR STARTUP'S</span>
          <span className="block text-foreground">CONVERSION RATE – OR IT'S FREE</span>
        </h1>
        
        <p className="text-center text-lg text-muted-foreground max-w-3xl mb-10 leading-relaxed font-normal relative z-10">
          Join dozens of founders who've doubled their conversion rates with our<br className="hidden md:block" /> 2-week redesign process — risk-free, with guaranteed results.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 relative z-10 mb-16">
          <Link to="/contact" className="bg-lime hover:bg-lime/90 text-black px-10 py-4 rounded-full font-display font-bold uppercase tracking-wider text-sm flex items-center gap-2 transition-colors">
            FREE WEBSITE AUDIT <ArrowUpRight className="w-4 h-4" />
          </Link>
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Summer Ending Special — Only 2 Slots Left!</span>
        </div>

        {/* Feature Cards Section */}
        <motion.div 
          style={{ y: yCards }}
          className="relative z-10 w-full proj-marquee mt-4"
        >
          {/* We keep the marquee mask so it fades nicely on the edges */}
          <div 
            className="w-full"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
          >
            <div className="proj-marquee-track flex gap-6 px-4">
              {[0, 1].map((setIndex) => (
                <div key={setIndex} className="flex gap-6 shrink-0">
                  {/* Card 1: Analytics */}
                  <div className="bg-[#0c0f18] rounded-[32px] overflow-hidden group relative flex flex-col p-6 w-[340px] md:w-[380px] h-[550px] shrink-0 border border-white/5 hover:border-white/10 transition-colors">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Dashboard" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    <div className="relative z-20 flex justify-between items-start mb-auto">
                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium text-sm">
                        Engineering
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer">
                        <Bookmark className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="relative z-20 mt-auto flex flex-col">
                      <h3 className="text-white font-display font-bold text-3xl leading-tight mb-4">
                        Analytics Dashboards For Scale
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-6">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80" alt="Avatar" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                        <span className="text-white/90 text-sm font-medium">Data Architecture</span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                            99.9%
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Uptime</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Clock className="w-5 h-5 text-white fill-white" />
                            14
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Days</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Plus className="w-5 h-5 text-purple-400 fill-purple-400 bg-purple-400/20 rounded-md p-0.5" />
                            A+
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Rating</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: AI Magic */}
                  <div className="bg-[#1a0b2e] rounded-[32px] overflow-hidden group relative flex flex-col p-6 w-[340px] md:w-[380px] h-[550px] shrink-0 border border-white/5 hover:border-white/10 transition-colors">
                    <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80" alt="AI Abstract" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090214] via-[#090214]/60 to-transparent" />
                    
                    <div className="relative z-20 flex justify-between items-start mb-auto">
                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium text-sm">
                        AI / ML
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer">
                        <Bookmark className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="relative z-20 mt-auto flex flex-col">
                      <h3 className="text-white font-display font-bold text-3xl leading-tight mb-4">
                        Embed Generative Contextual AI
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-6">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Avatar" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                        <span className="text-white/90 text-sm font-medium">Machine Learning</span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                            10x
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Speed</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Clock className="w-5 h-5 text-white fill-white" />
                            21
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Days</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Plus className="w-5 h-5 text-purple-400 fill-purple-400 bg-purple-400/20 rounded-md p-0.5" />
                            PRO
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Level</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Cloud Infrastructure */}
                  <div className="bg-[#0b1626] rounded-[32px] overflow-hidden group relative flex flex-col p-6 w-[340px] md:w-[380px] h-[550px] shrink-0 border border-white/5 hover:border-white/10 transition-colors">
                    <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" alt="Global Network" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020509] via-[#020509]/60 to-transparent" />
                    
                    <div className="relative z-20 flex justify-between items-start mb-auto">
                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium text-sm">
                        DevOps
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer">
                        <Bookmark className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="relative z-20 mt-auto flex flex-col">
                      <h3 className="text-white font-display font-bold text-3xl leading-tight mb-4">
                        Cloud Scale Architecture
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-6">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Avatar" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                        <span className="text-white/90 text-sm font-medium">Cloud Platform</span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                            1M+
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Users</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Clock className="w-5 h-5 text-white fill-white" />
                            30
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Days</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Plus className="w-5 h-5 text-purple-400 fill-purple-400 bg-purple-400/20 rounded-md p-0.5" />
                            AAA
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Tier</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Mobile Experiences */}
                  <div className="bg-[#18181b] rounded-[32px] overflow-hidden group relative flex flex-col p-6 w-[340px] md:w-[380px] h-[550px] shrink-0 border border-white/5 hover:border-white/10 transition-colors">
                    <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80" alt="Mobile UI" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    
                    <div className="relative z-20 flex justify-between items-start mb-auto">
                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium text-sm">
                        Product
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer">
                        <Bookmark className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="relative z-20 mt-auto flex flex-col">
                      <h3 className="text-white font-display font-bold text-3xl leading-tight mb-4">
                        Native iOS & Android Apps
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-6">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80" alt="Avatar" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                        <span className="text-white/90 text-sm font-medium">App Development</span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                            4.9
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Stars</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Clock className="w-5 h-5 text-white fill-white" />
                            21
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Days</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Plus className="w-5 h-5 text-purple-400 fill-purple-400 bg-purple-400/20 rounded-md p-0.5" />
                            TOP
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Rank</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 5: Cybersecurity */}
                  <div className="bg-[#0a1f16] rounded-[32px] overflow-hidden group relative flex flex-col p-6 w-[340px] md:w-[380px] h-[550px] shrink-0 border border-white/5 hover:border-white/10 transition-colors">
                    <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80" alt="Cyber Code" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020a06] via-[#020a06]/60 to-transparent" />
                    
                    <div className="relative z-20 flex justify-between items-start mb-auto">
                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium text-sm">
                        Security
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer">
                        <Bookmark className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="relative z-20 mt-auto flex flex-col">
                      <h3 className="text-white font-display font-bold text-3xl leading-tight mb-4">
                        Enterprise Infrastructure
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-6">
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80" alt="Avatar" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                        <span className="text-white/90 text-sm font-medium">Cyber Ops</span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                            SOC2
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Ready</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Clock className="w-5 h-5 text-white fill-white" />
                            14
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Days</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Plus className="w-5 h-5 text-purple-400 fill-purple-400 bg-purple-400/20 rounded-md p-0.5" />
                            MAX
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Sec</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 6: Commerce Solutions */}
                  <div className="bg-[#1f1012] rounded-[32px] overflow-hidden group relative flex flex-col p-6 w-[340px] md:w-[380px] h-[550px] shrink-0 border border-white/5 hover:border-white/10 transition-colors">
                    <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80" alt="Commerce Terminal" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0405] via-[#0d0405]/60 to-transparent" />
                    
                    <div className="relative z-20 flex justify-between items-start mb-auto">
                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium text-sm">
                        Fintech
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer">
                        <Bookmark className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="relative z-20 mt-auto flex flex-col">
                      <h3 className="text-white font-display font-bold text-3xl leading-tight mb-4">
                        Frictionless E-Commerce
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-6">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Avatar" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                        <span className="text-white/90 text-sm font-medium">Growth Team</span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                            3x
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Revenue</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Clock className="w-5 h-5 text-white fill-white" />
                            21
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Days</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                            <Plus className="w-5 h-5 text-purple-400 fill-purple-400 bg-purple-400/20 rounded-md p-0.5" />
                            ROI
                          </div>
                          <span className="text-white/60 text-xs uppercase tracking-wider">Growth</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>


      {/* Clients marquee */}
      <section className="border-y border-border/60 bg-surface/40">
        <div className="container-page py-8 flex items-center gap-10">
          <span className="shrink-0 text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Trusted by teams at
          </span>
          <div className="marquee flex-1">
            <div className="marquee-track">
              {[...clients, ...clients].map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="mx-8 font-display text-2xl font-medium text-foreground/60 whitespace-nowrap"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="container-page py-28" data-reveal-group>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              Core capabilities
            </p>
            <h2
              className="mt-4 font-display text-5xl md:text-6xl leading-tight max-w-2xl font-semibold"
              data-split
            >
              End-to-end services, delivered by one senior team.
            </h2>
          </div>
          <Link
            to="/services"
            className="text-sm text-foreground hover:text-lime inline-flex items-center gap-1.5"
            data-reveal-child
          >
            All services <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-cards>
          {capabilities.map((c) => (
            <div
              key={c.title}
              className="group glare-card lift gradient-card rounded-2xl p-7"
              data-card
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-lime/20 to-accent/20 border border-white/10">
                <c.icon className="h-5 w-5 text-lime" />
              </div>
              <h3 className="mt-8 font-display text-2xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proof in numbers — bold gold color band */}
      <section className="block-bold" data-reveal-group>
        <div className="container-page py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {[
            { v: "120+", l: "Products designed, built, and shipped" },
            { v: "98", l: "Median Lighthouse score at launch" },
            { v: "84%", l: "Of clients stay on a Care plan" },
            { v: "14", l: "Days to your first shippable slice" },
          ].map((s) => (
            <div key={s.l} data-reveal-child>
              <div className="font-display text-6xl md:text-7xl font-semibold tracking-tight" data-counter>
                {s.v}
              </div>
              <div className="mt-3 h-px w-10 bg-lime/60" />
              <p className="mt-3 text-sm text-muted-foreground max-w-[24ch]">{s.l}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* How an engagement feels — illustrated bento */}
      <BentoShowcase
        eyebrow="The Northline way"
        title={
          <>
            What working with us actually <span className="text-gold">feels</span> like.
          </>
        }
        subtitle="No status-meeting theater. You watch the product take shape in real time — every build, every deploy, every decision visible."
        cards={[
          {
            title: "Build faster",
            desc: "Ship features 2× quicker with one senior pod. From idea to production in weeks, not months.",
            tone: "warm",
            visual: { kind: "gauge", stat: "46%", statLabel: "faster time to first launch", value: 0.46 },
          },
          {
            title: "Deploy with confidence",
            desc: "Automated security checks, CI/CD pipelines, and instant rollbacks. Ship safely, every time.",
            tone: "cool",
            visual: {
              kind: "checklist",
              rows: ["Code reviewed", "Tests passed", "Security scan clean"],
            },
          },
          {
            title: "Stay in sync",
            desc: "Real-time notifications for deploys, builds, and team activity. Never chase a status update again.",
            tone: "cool",
            visual: {
              kind: "inbox",
              tabs: [
                { label: "All", count: 3 },
                { label: "Team", count: 2, active: true },
                { label: "System", count: 1 },
              ],
              rows: [
                "Sarah deployed to production",
                "Friday demo recording ready",
                "Dependency update available",
              ],
            },
          },
          {
            title: "Command everything",
            desc: "Trigger deployments, inspect build logs, and manage workflows from a single command palette.",
            tone: "warm",
            visual: {
              kind: "command",
              actions: [
                { label: "Deploy to Production", kbd: "V" },
                { label: "View Build Logs", kbd: "B" },
                { label: "Rollback Last Deploy", kbd: "M" },
              ],
            },
          },
        ]}
      />

      {/* Solutions */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="mb-14">
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
            Industry solutions
          </p>
          <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight max-w-3xl font-semibold" data-reveal-child>
            Purpose-built for the industries we know deeply.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-cards>
          {solutions.map((s) => (
            <div
              key={s.title}
              className="glare-card lift gradient-card-gold rounded-2xl p-7"
              data-card
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-gold/30 to-transparent border border-gold/20">
                <s.icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mt-8 font-display text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              How we work
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              A transparent, iterative process.
            </h2>
            <p className="mt-6 text-muted-foreground max-w-md" data-reveal-child>
              Weekly demos, shared boards, and honest trade-offs. No surprises, no
              hand-offs to strangers.
            </p>
          </div>
          <div className="space-y-3">
            {process.map((p) => (
              <div
                key={p.n}
                className="glare-card glass rounded-2xl p-6 flex gap-5 hover:bg-white/5 transition-colors"
                data-reveal-child
              >
                <span className="font-display text-3xl font-semibold text-gradient-lime shrink-0">
                  {p.n}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{p.t}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything a launch needs — scattered elements assemble on scroll */}
      <section className="container-page py-28 border-t border-border/60 overflow-hidden">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-16 items-center">
          <div data-reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-lime">In every build</p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold">
              Scattered concerns,{" "}
              <span className="text-gold">assembled</span> into one
              launch.
            </h2>
            <p className="mt-6 text-muted-foreground max-w-md">
              Auth, payments, analytics, SEO, monitoring — the unglamorous parts most
              agencies bolt on late. We wire them in from sprint one, so launch day is a
              formality, not a fire drill.
            </p>
          </div>
          <div className="relative" data-scatter>
            <div
              className="absolute -top-24 -right-16 h-72 w-72 rounded-full opacity-30 pointer-events-none"
              style={{ background: "var(--gradient-lime)", filter: "blur(100px)" }}
              data-parallax="-0.15"
            />
            <div className="relative flex flex-wrap justify-center gap-3">
              {[
                "Design system",
                "Auth & SSO",
                "Payments",
                "CI/CD",
                "Analytics",
                "SEO & schema",
                "Error monitoring",
                "A/B testing",
                "Accessibility",
                "Email flows",
                "Docs & handover",
                "Load testing",
                "i18n-ready",
                "Backups & DR",
              ].map((chip, i) => (
                <span
                  key={chip}
                  data-scatter-item
                  className={`rounded-full px-5 py-2.5 text-sm font-medium border will-change-transform ${
                    i % 5 === 0
                      ? "gradient-card-gold border-gold/25 text-foreground"
                      : "glass border-white/10 text-foreground/85"
                  }`}
                >
                  {chip}
                </span>
              ))}
            </div>
            <p className="mt-8 text-center text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Included in every engagement — never a change order
            </p>
          </div>
        </div>
      </section>

      {/* Works */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="flex items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              Selected work
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-split>
              Recent case studies.
            </h2>
          </div>
          <Link
            to="/works"
            className="text-sm hover:text-lime inline-flex items-center gap-1.5"
            data-reveal-child
          >
            All works <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {work.map((w) => (
            <div
              key={w.name}
              className="group glare-card relative rounded-2xl overflow-hidden aspect-4/3 border border-white/10"
              data-reveal-child
            >
              <img
                src={w.img}
                alt={w.name}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                data-parallax-img
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="relative h-full p-8 flex flex-col justify-end">
                <span className="text-xs uppercase tracking-[0.24em] text-lime">
                  {w.tag}
                </span>
                <div className="mt-2 flex items-end justify-between gap-6">
                  <div>
                    <h3 className="font-display text-3xl md:text-4xl font-semibold">
                      {w.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{w.result}</p>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-full glass shrink-0 group-hover:bg-lime group-hover:text-lime-foreground transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* First 14 days */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
            After you say go
          </p>
          <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-split>
            Your first 14 days with us.
          </h2>
        </div>
        <div className="relative">
          <div className="timeline-line hidden md:block" data-timeline-line />
          <div className="grid gap-10 md:grid-cols-4">
            {kickoff.map((step) => (
              <div key={step.day} data-reveal-child>
                <div className="timeline-dot hidden md:block" />
                <p className="md:mt-5 text-xs uppercase tracking-[0.24em] text-gold">{step.day}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{step.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-[30ch]">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              Why Northline
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              A studio, not a factory.
            </h2>
            <div
              className="relative mt-10 overflow-hidden rounded-3xl border border-white/10"
              data-reveal-child
            >
              <img
                src="/images/canva/studio-workspace.jpg"
                alt="Laptop in a dark studio with glowing lime circuit lines — code in progress"
                loading="lazy"
                className="aspect-16/10 w-full object-cover"
              />
              <div className="absolute inset-0 bg-background/30" />
            </div>
          </div>
          <div className="space-y-4">
            {[
              { icon: Zap, title: "Senior team, always", desc: "No juniors farmed out. Principal designers and engineers on every project." },
              { icon: Layers, title: "Design + engineering", desc: "One team, one brief. We build what we design, so quality doesn't fall through." },
              { icon: ShieldCheck, title: "Long-term partners", desc: "84% of our clients continue with a Care plan after launch." },
              { icon: Coins, title: "Transparent pricing", desc: "Clear scope, honest budgets, no surprises. Try the calculator on the left." },
            ].map((f) => (
              <div
                key={f.title}
                className="glare-card glass rounded-2xl p-6 flex gap-5"
                data-reveal-child
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-lime/20 to-transparent border border-lime/20">
                  <f.icon className="h-5 w-5 text-lime" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison — white band */}
      <section className="block-light">
        <div className="container-page py-28">
        <div className="mb-14" data-reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-lime">Why teams switch</p>
          <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight max-w-3xl font-semibold">
            The usual way, or the Northline way.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div
            className="rounded-3xl border border-black/10 bg-surface p-8 md:p-10"
            data-slide="left"
          >
            <h3 className="font-display text-2xl font-semibold text-muted-foreground">
              A typical agency
            </h3>
            <ul className="mt-8 space-y-5">
              {compareTypical.map((row) => (
                <li key={row} className="flex items-start gap-3 text-muted-foreground">
                  <X className="mt-0.5 h-4 w-4 shrink-0 opacity-50" />
                  <span className="text-sm leading-relaxed">{row}</span>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="glare-card gradient-card-gold rounded-3xl p-8 md:p-10"
            data-slide="right"
          >
            <h3 className="font-display text-2xl font-semibold">Northline</h3>
            <ul className="mt-8 space-y-5">
              {compareNorthline.map((row) => (
                <li key={row} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="text-sm leading-relaxed text-foreground/90">{row}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-9 inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
            >
              Work the Northline way <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <p className="text-xs uppercase tracking-[0.28em] text-lime mb-4" data-reveal-child>
          What partners say
        </p>
        <h2 className="font-display text-5xl md:text-6xl leading-tight max-w-3xl font-semibold mb-14" data-reveal-child>
          Trusted by founders and product leaders.
        </h2>
        <div className="grid md:grid-cols-3 gap-6" data-cards data-cards-stagger="0.12">
          {testimonials.map((t) => (
            <blockquote
              key={t.a}
              className="glare-card gradient-card rounded-2xl p-7"
              data-card
            >
              <p className="font-display text-lg leading-relaxed">"{t.q}"</p>
              <footer className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                <img
                  src={t.img}
                  alt={t.a}
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover border border-white/15"
                />
                <div>
                  <div className="font-semibold text-sm">{t.a}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.r}</div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Pricing snapshot */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              Engagement models
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              Fair, transparent pricing.
            </h2>
          </div>
          <Link to="/pricing" className="text-sm hover:text-lime inline-flex items-center gap-1.5" data-reveal-child>
            Full pricing <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6" data-cards>
          {[
            { t: "Fixed Price", d: "Defined scope, defined budget. Perfect for launches.", p: "from $8k" },
            { t: "Monthly Retainer", d: "Ongoing partnership with a dedicated pod.", p: "from $9k/mo", featured: true },
            { t: "Dedicated Team", d: "Embedded team scaling with your product.", p: "custom" },
          ].map((tier) => (
            <div
              key={tier.t}
              className={`glare-card lift rounded-2xl p-8 border ${
                tier.featured
                  ? "gradient-card-gold border-lime/30"
                  : "gradient-card border-white/10"
              }`}
              data-card
            >
              <h3 className="font-display text-2xl font-semibold">{tier.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tier.d}</p>
              <div className="mt-8 font-display text-3xl font-semibold text-gradient-lime">
                {tier.p}
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {["Senior team", "Weekly demos", "Full IP transfer"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-lime" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              FAQ
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              Answers to common questions.
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="glare-card faq-item glass rounded-2xl p-6 group"
                data-reveal-child
              >
                <summary className="font-display text-lg font-semibold cursor-pointer flex items-center justify-between">
                  {f.q}
                  <span className="text-lime group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Free audit — low-commitment conversion path */}
      <section className="container-page py-24 border-t border-border/60">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div data-slide="left">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">Not ready to commit?</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight font-semibold">
              Get a free 48-hour technical audit instead.
            </h2>
            <p className="mt-5 text-muted-foreground max-w-lg">
              Send us your URL. Within two business days you get a prioritized action plan
              covering speed, SEO, accessibility, and conversion — yours to keep, whoever
              you build with.
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              {[
                "Core Web Vitals breakdown with the three highest-impact fixes",
                "Conversion leaks ranked by estimated revenue impact",
                "A senior engineer's notes — not an automated report",
              ].map((row) => (
                <li key={row} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="text-foreground/85">{row}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative" data-slide="right">
            <div
              className="absolute -top-16 -left-10 h-56 w-56 rounded-full opacity-25 pointer-events-none"
              style={{ background: "var(--gradient-lime)", filter: "blur(90px)" }}
              data-parallax="0.18"
            />
            <div className="glare-card gradient-card-gold relative rounded-3xl p-8 md:p-10">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold">Audit snapshot</span>
                <span className="rounded-full bg-gold/15 border border-gold/30 px-3 py-1 text-xs font-semibold text-gold">
                  48h turnaround
                </span>
              </div>
              <div className="mt-7 space-y-4">
                {[
                  { l: "Performance", w: "w-[62%]", note: "LCP 4.1s → target 1.8s" },
                  { l: "SEO", w: "w-[78%]", note: "Missing schema on 12 pages" },
                  { l: "Conversion", w: "w-[44%]", note: "Checkout drop-off at step 2" },
                ].map((bar) => (
                  <div key={bar.l}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium">{bar.l}</span>
                      <span className="text-xs text-muted-foreground">{bar.note}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10">
                      <div className={`h-full rounded-full bg-gold/80 ${bar.w}`} />
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/contact"
                data-magnetic
                className="mt-9 inline-flex items-center gap-2 rounded-full btn-gold px-6 py-3.5 text-sm font-semibold"
              >
                Claim your free audit
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <p className="mt-4 text-xs text-muted-foreground">
                No sales call required. We email the report either way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-28" data-reveal>
        <div className="relative overflow-hidden rounded-3xl gradient-card p-12 md:p-20 border border-lime/20">
          <div className="absolute inset-0 grain-bg pointer-events-none" />
          <div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-40 pointer-events-none"
            style={{ background: "var(--gradient-lime)", filter: "blur(80px)" }}
          />
          <div className="relative max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime">Let's build</p>
            <h2 className="mt-4 font-display text-5xl md:text-7xl leading-[0.95] font-semibold" data-split>
              Have a project in mind?
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Tell us about it. We reply within one business day with a plan, a timeline, and a fair budget.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/contact"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-navy shine px-6 py-3.5 text-sm font-semibold hover:border-lime/40"
              >
                Start a Project
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/contact"
                data-magnetic="0.25"
                className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-medium hover:bg-white/5"
              >
                Book Discovery Call
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-lime" /> You own all IP and code
              </span>
              <span className="inline-flex items-center gap-2">
                <Zap className="h-4 w-4 text-lime" /> Reply within one business day
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-lime" /> Free technical audit included
              </span>
            </div>
          </div>
        </div>
      </section>
      </div>
    </SiteShell>
  );
}
