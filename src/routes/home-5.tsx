import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Star } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/home-5")({
  component: Studio909Home,
});

const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=70",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=70",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=70",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=70",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=70",
];

function Studio909Home() {
  useEffect(() => {
    // Ensure Inter is loaded
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="theme-studio909 min-h-screen bg-background text-foreground font-sans relative flex flex-col items-center overflow-hidden">
      
      {/* Background glowing gradient and grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[800px] h-[500px] bg-[oklch(0.6_0.2_40)] opacity-[0.25] blur-[120px] rounded-[100%] pointer-events-none" />
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          backgroundPosition: 'center center'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 w-full max-w-[1200px] px-8 py-8 flex items-center justify-between mx-auto">
        <div className="font-bold text-2xl tracking-tighter text-white">STUDIO.909</div>
        
        <nav className="hidden md:flex items-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md overflow-hidden p-1">
          <Link to="/home-5" className="px-4 py-1.5 bg-white text-black text-[11px] font-semibold rounded-full">Benefits</Link>
          <Link to="/home-5" className="px-4 py-1.5 text-white/70 hover:text-white text-[11px] font-semibold transition-colors">Results</Link>
          <Link to="/home-5" className="px-4 py-1.5 text-white/70 hover:text-white text-[11px] font-semibold transition-colors">Process</Link>
          <Link to="/home-5" className="px-4 py-1.5 text-white/70 hover:text-white text-[11px] font-semibold transition-colors">Case Studies</Link>
          <Link to="/home-5" className="px-4 py-1.5 text-white/70 hover:text-white text-[11px] font-semibold transition-colors">Blog</Link>
        </nav>
        
        <Link to="/contact" className="hidden sm:inline-flex items-center justify-center border border-white/20 text-white/90 hover:text-white hover:bg-white/5 px-6 py-2 text-xs font-semibold rounded-md transition-colors">
          Contact Us
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-[1200px] flex-1 flex flex-col items-center justify-center px-6 mt-16 pb-12">
        
        {/* Trust Badge */}
        <div className="flex items-center gap-3 mb-8">
           <span className="text-sm font-medium text-white/80">Trusted By</span>
           <div className="flex -space-x-3">
             {avatars.map((a, i) => (
               <img key={i} src={a} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
             ))}
           </div>
           <span className="text-sm font-medium text-white/80">25+ Founders & Leaders</span>
           <div className="flex items-center gap-0.5 ml-2">
             {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#dca742] text-[#dca742]" />)}
           </div>
        </div>

        {/* Hero Copy */}
        <h1 className="text-center text-5xl md:text-[5.5rem] font-medium leading-[1.05] tracking-tight max-w-[1100px] mb-6">
          <span className="block text-white">BOOST YOUR STARTUP'S</span>
          <span className="block text-white">CONVERSION RATE – OR IT'S FREE</span>
        </h1>
        
        <p className="text-center text-lg text-white/80 max-w-3xl mb-10 leading-relaxed font-normal">
          Join dozens of founders who've doubled their conversion rates with our<br className="hidden md:block" /> 2-week redesign process — risk-free, with guaranteed results.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3">
          <Link to="/contact" className="bg-[#f06824] hover:bg-[#ff7530] text-white px-10 py-4 rounded-md font-bold text-sm flex items-center gap-2 transition-colors">
            FREE WEBSITE AUDIT <ArrowUpRight className="w-4 h-4" />
          </Link>
          <span className="text-[11px] text-white/60">Summer Ending Special — Only 2 Slots Left!</span>
        </div>

      </main>

      {/* Logo Wall */}
      <div className="relative z-10 w-full max-w-[1200px] px-6 pb-20 mx-auto mt-20">
         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            <div className="bg-black/50 border border-white/5 h-20 rounded-lg flex items-center justify-center p-4">
               <span className="font-semibold text-lg text-white/60 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-white/60 inline-block"></span> Golf918
               </span>
            </div>
            
            <div className="bg-black/80 border border-white/10 h-20 rounded-lg flex items-center justify-center p-4">
               <span className="font-bold text-xl text-white">Wholesome Guide</span>
            </div>
            
            <div className="bg-black/50 border border-white/5 h-20 rounded-lg flex items-center justify-center p-4">
               <span className="font-black tracking-tight text-white/70 uppercase">BEN LEAVITT</span>
            </div>
            
            <div className="bg-black/50 border border-white/5 h-20 rounded-lg flex items-center justify-center p-4 flex-col leading-none">
               <span className="font-bold text-white/60 text-xs">HUMBLE</span>
               <span className="font-bold text-white/60 text-[10px]">&</span>
               <span className="font-bold text-white/60 text-xs">FRANK</span>
            </div>
            
            <div className="bg-black/50 border border-white/5 h-20 rounded-lg flex items-center justify-center p-4">
               <span className="font-medium text-white/60 flex items-center gap-2 text-sm">
                 <span className="w-5 h-5 rounded-full bg-white/60 inline-block"></span> Mattha Busby
               </span>
            </div>
            
         </div>
      </div>
    </div>
  );
}

