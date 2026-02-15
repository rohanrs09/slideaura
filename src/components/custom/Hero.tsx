import { Button } from "../ui/button";
import { Sparkles, ArrowRight, CheckCircle} from "lucide-react";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const { user } = useUser();

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#8b5cf6]/10 to-[#ec4899]/10 border border-[#8b5cf6]/20 backdrop-blur-sm">
          <Sparkles className="h-3 w-3 text-[#8b5cf6] rounded-full" />
          <span className="text-xs font-medium text-[#fafafa] tracking-wider">AI-POWERED PLATFORM</span>
        </div>
        
        {/* Headline */}
        <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight max-w-4xl">
          <span className="text-[#fafafa]">Create Stunning</span>
          <br />
          <span className="bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f59e0b] bg-clip-text text-transparent">
            Presentations Instantly
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl text-[#a0a0a0] max-w-3xl">
          Transform your ideas into professional presentations with our AI-powered platform. 
          Generate compelling content, beautiful designs, and export in any format - all in minutes.
        </p>

        {/* Action Button */}
        <div className="flex justify-center">
          {!user ? (
            <SignInButton mode="modal">
              <Button variant="cta" size="lg" className="px-8 py-3 font-semibold">
                Start Creating Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </SignInButton>
          ) : (
            <Link to="/workspace">
              <Button variant="cta" size="lg" className="px-8 py-3 font-semibold">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center gap-8 text-sm text-[#a0a0a0]">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-[#8b5cf6] rounded-full" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-[#8b5cf6] rounded-full" />
            <span>Free plan available</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-[#8b5cf6] rounded-full" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>

      {/* How It Works Section - Clean Design */}
      <div className="mt-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-[#fafafa] mb-4">
              How It Works
            </h2>
            <p className="text-[#a0a0a0] max-w-2xl mx-auto">
              Create professional presentations in three simple steps
            </p>
          </div>

          {/* Clean Steps */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center p-6 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#8b5cf6]/50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-[#fafafa] mb-2">Input Your Topic</h3>
              <p className="text-[#a0a0a0] text-sm">
                Simply describe your presentation topic, audience, and key points
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center p-6 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#ec4899]/50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-r from-[#ec4899] to-[#f59e0b] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-[#fafafa] mb-2">AI Creates Magic</h3>
              <p className="text-[#a0a0a0] text-sm">
                Our AI generates structured content with professional design and layouts
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center p-6 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#f59e0b]/50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-[#fafafa] mb-2">Export & Present</h3>
              <p className="text-[#a0a0a0] text-sm">
                Download as PowerPoint, PDF, or present directly from our platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
