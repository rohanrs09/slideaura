import { PricingTable } from '@clerk/clerk-react'
import { motion } from "framer-motion";
import { Sparkles } from 'lucide-react'
import Header from "./Header";
import Footer from "./Footer";

function Pricing() {
return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-start px-6 py-6 pt-16 relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gradient-radial from-[#A855F7]/10 to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl text-center relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#A855F7]/20 bg-gradient-to-r from-[#A855F7]/10 to-[#EC4899]/10 mb-6">
          <Sparkles className="h-3.5 w-3.5 text-[#A855F7]" />
          <span className="text-xs font-medium bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent tracking-wide uppercase">Upgrade</span>
        </div>
        <h2 className="font-heading font-bold text-4xl text-[#F5F3FF] mb-3">Simple, transparent pricing</h2>
        <p className="text-[#C4B5FD] mb-12 text-lg">
          Unlock unlimited presentations with one plan
        </p>
        <div className="flex justify-center">
          <PricingTable />
        </div>
      </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default Pricing;
