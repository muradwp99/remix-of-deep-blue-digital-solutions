import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/home-4")({
  component: HomoludensHome,
});

function HomoludensHome() {
  useEffect(() => {
    // Add Orbitron and Space Grotesk fonts
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="theme-homoludens min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      
      {/* Background patterned overlay (subtle Celtic knot / sci-fi patterns) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[oklch(0.7_0.2_130)] opacity-[0.05] blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-8 py-6 max-w-[1400px] mx-auto">
        <div className="font-display font-bold text-2xl tracking-widest text-[#a8e63d]">HOMOLUDENS</div>
        
        <nav className="hidden md:flex items-center gap-8 font-display text-xs tracking-widest uppercase font-semibold">
          <Link to="/about" className="text-foreground hover:text-[#a8e63d] transition-colors">About</Link>
          <span className="text-foreground/30">•</span>
          <Link to="/services" className="text-foreground hover:text-[#a8e63d] transition-colors">Services</Link>
          <span className="text-foreground/30">•</span>
          <Link to="/works" className="text-foreground hover:text-[#a8e63d] transition-colors">Projects</Link>
          <span className="text-foreground/30">•</span>
          <Link to="/contact" className="text-foreground hover:text-[#a8e63d] transition-colors">Contacts</Link>
        </nav>
        
        <Link to="/contact" className="hidden sm:inline-flex items-center justify-center bg-[#a8e63d] text-black px-6 py-2.5 font-display text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-white transition-colors">
          Contact Us
        </Link>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 pt-12 pb-24">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-4xl md:text-6xl font-black uppercase leading-[1.1] tracking-wider mb-2">
              <span className="block text-white">DIGITAL</span>
              <span className="block text-white">SOLUTIONS</span>
              <span className="block font-sans italic font-light text-3xl md:text-5xl text-[#a8e63d] normal-case mt-2">from </span>
              <span className="block text-white">ANOTHER</span>
              <span className="block text-white">CIVILIZATION</span>
            </h1>

            <div className="flex gap-4 mt-12">
              {/* About Us Card */}
              <Link to="/about" className="flex-1 bg-[#151a18] border border-white/5 rounded-xl p-5 hover:border-[#a8e63d]/50 transition-colors group relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className="font-display font-semibold text-lg">About Us</span>
                  <ArrowUpRight className="w-5 h-5 text-[#a8e63d] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <div className="flex -space-x-2 relative z-10">
                   {/* mock team avatars */}
                   <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#151a18]" />
                   <div className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-[#151a18]" />
                   <div className="w-8 h-8 rounded-full bg-zinc-600 border-2 border-[#151a18]" />
                </div>
                <p className="text-[10px] text-foreground/50 mt-4 leading-tight relative z-10">
                  We are aliens mastering innovative and reliable services that drive business growth and efficiency.
                </p>
                <div className="absolute inset-0 bg-gradient-to-br from-[#a8e63d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              {/* Services Card */}
              <Link to="/services" className="flex-1 bg-[#151a18] border border-white/5 rounded-xl p-5 hover:border-[#a8e63d]/50 transition-colors group relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className="font-display font-semibold text-lg">Services</span>
                  <ArrowUpRight className="w-5 h-5 text-[#a8e63d] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <div className="flex flex-wrap gap-1 relative z-10 mt-2">
                  <span className="px-2 py-1 bg-white/5 rounded-full text-[9px] uppercase tracking-wider text-foreground/60 border border-white/10">Products</span>
                  <span className="px-2 py-1 bg-white/5 rounded-full text-[9px] uppercase tracking-wider text-foreground/60 border border-white/10">Cyber Sec</span>
                  <span className="px-2 py-1 bg-white/5 rounded-full text-[9px] uppercase tracking-wider text-foreground/60 border border-white/10">Web3</span>
                  <span className="px-2 py-1 bg-white/5 rounded-full text-[9px] uppercase tracking-wider text-foreground/60 border border-white/10">Consulting</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#a8e63d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          {/* Right Column (Alien & Stats) */}
          <div className="relative h-full flex justify-end">
            <div className="absolute right-0 top-0 h-[600px] w-full max-w-[600px] pointer-events-none z-10">
               <img src="/alien.png" alt="Alien Executive" className="w-full h-full object-contain object-right-top drop-shadow-[0_0_50px_rgba(168,230,61,0.2)]" />
            </div>
            
            <div className="absolute right-0 top-20 flex flex-col items-end gap-12 z-20 text-right">
               <p className="text-xs text-[#a8e63d] max-w-[200px] text-right font-light leading-relaxed">
                 We are Homoludens — an alien origin studio delivering design and technology that feels one step ahead of Earth.
               </p>

               <div>
                 <div className="font-display text-4xl md:text-5xl font-black text-[#a8e63d]">400+</div>
                 <div className="text-xs uppercase tracking-widest font-semibold text-foreground/70 mt-1">Projects</div>
               </div>
               
               <div>
                 <div className="font-display text-4xl md:text-5xl font-black text-[#a8e63d]">160+</div>
                 <div className="text-xs uppercase tracking-widest font-semibold text-foreground/70 mt-1">Clients</div>
               </div>
               
               <p className="text-[10px] text-foreground/40 max-w-[150px] text-right mt-10">
                 Senior Digital Strategist, Homoludens
               </p>
            </div>
          </div>
        </div>

        {/* Huge Background Text */}
        <div className="w-full overflow-hidden mt-12 py-10 opacity-10">
           <h2 className="font-display text-[12vw] font-black tracking-widest leading-none text-transparent whitespace-nowrap" style={{ WebkitTextStroke: "2px #a8e63d" }}>
             HOMOLUDENS
           </h2>
        </div>

        {/* Missions Completed */}
        <section className="mt-20">
          <h2 className="font-sans italic font-light text-3xl md:text-4xl text-[#a8e63d] mb-1">Missions</h2>
          <h3 className="font-display font-black text-3xl md:text-4xl tracking-widest uppercase mb-12">we've Completed</h3>
          
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
             {/* Card 1 */}
             <div className="min-w-[450px] max-w-[500px] bg-[#121614] border border-[#202925] rounded-[32px] p-6 flex flex-col justify-between aspect-[16/9] relative overflow-hidden group snap-center cursor-pointer hover:border-[#a8e63d]/40 transition-colors">
                <div className="absolute top-6 right-6 w-1/2 h-[70%] rounded-[24px] overflow-hidden bg-zinc-900 border border-white/5">
                   <img src="https://images.unsplash.com/photo-1639762681485-074b7f4eccd8?auto=format&fit=crop&w=600&q=80" alt="Crypto" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="w-1/2 relative z-10 flex flex-col h-full justify-between pr-4">
                  <h4 className="font-display font-bold text-2xl leading-tight">Crypto<br/>Trading<br/>Platform</h4>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-foreground/50 mb-4">
                      <div className="mb-1">UI</div>
                      <div className="mb-1">Web Design</div>
                      <div>Development</div>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#a8e63d] px-4 py-2 border border-[#a8e63d]/30 rounded-full hover:bg-[#a8e63d] hover:text-black transition-colors">
                      View Mission <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
             </div>

             {/* Card 2 */}
             <div className="min-w-[450px] max-w-[500px] bg-[#121614] border border-[#202925] rounded-[32px] p-6 flex flex-col justify-between aspect-[16/9] relative overflow-hidden group snap-center cursor-pointer hover:border-[#a8e63d]/40 transition-colors">
                <div className="absolute top-6 right-6 w-1/2 h-[70%] rounded-[24px] overflow-hidden bg-zinc-900 border border-white/5">
                   <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80" alt="Notary" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="w-1/2 relative z-10 flex flex-col h-full justify-between pr-4">
                  <h4 className="font-display font-bold text-2xl leading-tight">Online Notary<br/>Service</h4>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-foreground/50 mb-4">
                      <div className="mb-1">UI</div>
                      <div className="mb-1">Web Design</div>
                      <div>Development</div>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#a8e63d] px-4 py-2 border border-[#a8e63d]/30 rounded-full hover:bg-[#a8e63d] hover:text-black transition-colors">
                      View Mission <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* Observation Section */}
        <section className="mt-32 grid md:grid-cols-[1fr_auto] items-center gap-16 border-t border-[#202925] pt-16">
           <h2 className="font-display font-medium text-3xl md:text-5xl leading-tight max-w-3xl text-foreground/90">
             We observe human design patterns from the outside. That's why we see what others overlook.
           </h2>
           <div className="flex flex-col gap-3">
             <span className="px-5 py-3 rounded-full bg-[#151a18] border border-[#202925] text-sm font-semibold flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-[#a8e63d]" /> Non-Human Thinking
             </span>
             <span className="px-5 py-3 rounded-full bg-[#151a18] border border-[#202925] text-sm font-semibold flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-[#a8e63d]" /> Systemic Design
             </span>
             <span className="px-5 py-3 rounded-full bg-[#151a18] border border-[#202925] text-sm font-semibold flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-[#a8e63d]" /> Efficiency Over Noise
             </span>
             <span className="px-5 py-3 rounded-full bg-[#151a18] border border-[#202925] text-sm font-semibold flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-[#a8e63d]" /> Upstream reach
             </span>
           </div>
        </section>

        {/* Calculate Lab Section */}
        <section className="mt-32 relative rounded-[40px] overflow-hidden min-h-[500px] flex flex-col items-center justify-center p-10 text-center">
           <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80" alt="Lab" className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40" />
           <div className="absolute inset-0 bg-[#a8e63d] mix-blend-multiply" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
           
           <div className="relative z-10 flex flex-col items-center w-full">
             <div className="bg-black/90 px-10 py-4 rounded-[32px] inline-flex flex-col items-center mb-8 border border-white/10 shadow-[0_0_100px_rgba(168,230,61,0.5)]">
               <h2 className="font-sans italic font-light text-2xl text-[#a8e63d] -mb-2">We don't guess.</h2>
               <div className="font-display font-black text-5xl md:text-7xl uppercase tracking-widest text-white">We calculate.</div>
             </div>

             <div className="flex flex-col gap-3 w-64 max-w-full">
               <button className="bg-black/80 border border-[#a8e63d]/30 text-white font-display font-bold uppercase tracking-widest text-sm py-4 rounded-full backdrop-blur-md hover:bg-[#a8e63d] hover:text-black transition-colors">Strategy</button>
               <button className="bg-black/80 border border-[#a8e63d]/30 text-white font-display font-bold uppercase tracking-widest text-sm py-4 rounded-full backdrop-blur-md hover:bg-[#a8e63d] hover:text-black transition-colors">Design</button>
               <button className="bg-black/80 border border-[#a8e63d]/30 text-white font-display font-bold uppercase tracking-widest text-sm py-4 rounded-full backdrop-blur-md hover:bg-[#a8e63d] hover:text-black transition-colors">Development</button>
             </div>
             
             <button className="mt-12 bg-[#a8e63d] text-black font-display font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-full hover:bg-white transition-colors">
               About Us
             </button>
           </div>
        </section>

        {/* How We Operate */}
        <section className="mt-32">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-12 border-t border-[#202925] pt-16">
             <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-widest leading-none">
               How <span className="font-sans italic font-light text-[#a8e63d] normal-case block">we</span> Operate
             </h2>
             
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 flex-1">
               {[
                 { icon: "01", t: "Signal Received", d: "We analyze your challenge" },
                 { icon: "02", t: "Alien Strategy", d: "We design a superior architecture" },
                 { icon: "03", t: "Execution Phase", d: "Design & development" },
                 { icon: "04", t: "Launch & Evolution", d: "Support and optimization" },
               ].map(s => (
                 <div key={s.icon} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full border border-[#a8e63d]/30 flex items-center justify-center font-display font-bold text-[#a8e63d] mb-4 bg-[#151a18]">
                      {s.icon}
                    </div>
                    <h3 className="font-display font-bold text-sm tracking-widest uppercase mb-2">{s.t}</h3>
                    <p className="text-xs text-foreground/50">{s.d}</p>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* Ready to Contact Banner */}
        <section className="mt-32">
          <div className="bg-gradient-to-r from-[#121614] to-[#1a221d] border border-[#202925] rounded-[40px] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
             {/* decorative lines */}
             <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
             
             <div className="relative z-10">
               <h2 className="font-display font-black text-5xl md:text-7xl uppercase tracking-widest leading-tight">
                 Ready<br/>
                 <span className="font-sans italic font-light text-[#a8e63d] normal-case">to</span> Contact?
               </h2>
               <p className="text-sm text-foreground/60 mt-4 max-w-sm">
                 If your business feels limited by ordinary solutions — it's time to think beyond Earth.
               </p>
             </div>
             
             <Link to="/contact" className="relative z-10 bg-[#a8e63d] text-black font-display font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white transition-colors whitespace-nowrap">
               Start the Mission
             </Link>
          </div>
        </section>

        {/* Footer Minimal */}
        <footer className="mt-32 pt-16 border-t border-[#202925] flex flex-col md:flex-row justify-between gap-12 pb-8">
           <div className="max-w-xs">
             <h4 className="font-display font-bold text-lg mb-4">Subscribe to our newsletter to stay in touch</h4>
             <div className="flex bg-[#151a18] border border-[#202925] rounded-full p-1 pl-4">
               <input type="email" placeholder="Your e-mail" className="bg-transparent border-none outline-none text-sm w-full" />
               <button className="w-8 h-8 rounded-full bg-[#a8e63d] flex items-center justify-center shrink-0">
                 <ArrowRight className="w-4 h-4 text-black" />
               </button>
             </div>
           </div>
           
           <div className="grid grid-cols-2 gap-12 text-sm text-foreground/60 font-medium">
             <div className="flex flex-col gap-2">
               <Link to="/" className="hover:text-[#a8e63d]">Home</Link>
               <Link to="/about" className="hover:text-[#a8e63d]">Our Studio</Link>
               <Link to="/services" className="hover:text-[#a8e63d]">Services</Link>
               <Link to="/works" className="hover:text-[#a8e63d]">Works</Link>
             </div>
             <div className="flex flex-col gap-2">
               <Link to="/" className="hover:text-[#a8e63d]">Terms & Conditions</Link>
               <Link to="/" className="hover:text-[#a8e63d]">Privacy Policy</Link>
               <Link to="/" className="hover:text-[#a8e63d]">Cookies</Link>
               <Link to="/" className="hover:text-[#a8e63d]">Careers</Link>
             </div>
           </div>
        </footer>
      </main>
    </div>
  );
}

