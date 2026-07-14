import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, Phone } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/home-3")({
  component: NeonLabsHome,
});

function NeonLabsHome() {
  useEffect(() => {
    // Add Inter font dynamically for this page
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="theme-neonlabs min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      {/* Background grid and glows */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(oklch(1 0 0 / 0.1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          backgroundPosition: 'center top'
        }}
      />
      
      {/* Top left blue glow streak */}
      <div 
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#3b4cf7] opacity-[0.15] blur-[140px] pointer-events-none transform -rotate-45"
      />
      <div 
        className="absolute top-0 left-0 w-[40%] h-[30%] bg-[#4f6bff] opacity-[0.15] blur-[100px] pointer-events-none transform -rotate-45"
      />

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-bold text-lg">
            N
          </div>
          <span className="font-semibold text-xl tracking-tight">Neon Labs</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-1 bg-[#151522] border border-white/5 rounded-full px-2 py-1.5">
          <Link to="/home-3" className="px-5 py-2 rounded-full bg-[#202030] text-sm font-medium text-white">Home</Link>
          <Link to="/about" className="px-5 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-white transition-colors">About</Link>
          <Link to="/services" className="px-5 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-white transition-colors">Services</Link>
          <Link to="/works" className="px-5 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-white transition-colors">Case Study</Link>
          <Link to="/contact" className="px-5 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-white transition-colors">Contact</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/contact" className="hidden sm:flex items-center gap-2 bg-[#3b4cf7] hover:bg-[#4f6bff] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors">
            Book a Call <Phone className="w-4 h-4" />
          </Link>
          <button className="p-2 text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-32 px-6 max-w-[1400px] mx-auto">
        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6">
            Crafting Digital Experiences <br/> That Inspire & Convert
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mb-10 leading-relaxed">
            We are a creative agency specializing in UI/UX design, branding, and digital solutions to elevate your brand's online presence.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-[#3b4cf7] hover:bg-[#4f6bff] text-white px-8 py-4 rounded-full font-medium transition-colors">
            Start a Project <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Portfolio Cards */}
        <div className="mt-24 grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-[24px] overflow-hidden border border-white/10 bg-[#0d0d16] p-2 aspect-[4/5] md:aspect-[3/4] relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] to-transparent opacity-50 z-10 pointer-events-none" />
            <img src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=800&q=80" alt="Dark UI Dashboard" className="w-full h-full object-cover rounded-[20px] transition-transform duration-700 group-hover:scale-105" />
          </div>
          
          {/* Card 2 */}
          <div className="rounded-[24px] overflow-hidden border border-white/10 bg-[#0d0d16] p-2 aspect-[4/5] md:aspect-[3/4] relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] to-transparent opacity-50 z-10 pointer-events-none" />
            <div className="w-full h-full rounded-[20px] bg-[#2a0e4e] relative overflow-hidden transition-transform duration-700 group-hover:scale-105 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4e1b8c] to-[#1a0533]" />
              <div className="relative z-10 text-center text-white px-8">
                <h3 className="text-4xl font-bold mb-2 tracking-tight">AI CRAFT MAGIC.</h3>
                <p className="text-sm text-white/70">Elevate your product with advanced AI.</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-[24px] overflow-hidden border border-white/10 bg-[#0d0d16] p-2 aspect-[4/5] md:aspect-[3/4] relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] to-transparent opacity-50 z-10 pointer-events-none" />
             <div className="w-full h-full rounded-[20px] bg-[#0c1412] relative overflow-hidden transition-transform duration-700 group-hover:scale-105 flex flex-col pt-12 px-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#12221e] to-[#070b0a]" />
              <div className="relative z-10 text-white">
                 <h3 className="text-3xl font-semibold mb-2">Quantolio</h3>
                 <p className="text-white/60">Quantolio Insights Supercharge your operations</p>
                 <div className="mt-8 bg-white/5 rounded-xl h-48 border border-white/10"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

