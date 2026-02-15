import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, FileText, Globe } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#8b5cf6]/10 to-[#ec4899]/10 border border-[#8b5cf6]/20 mb-6">
              <Sparkles className="h-3 w-3 text-[#8b5cf6] rounded-full" />
              <span className="text-xs font-mono text-[#8b5cf6] tracking-wider">ABOUT</span>
            </div>
            <h1 className="font-display font-bold text-5xl md:text-6xl text-[#fafafa] mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#ec4899]">SlideAura</span>
            </h1>
            <p className="text-xl text-[#a0a0a0] leading-relaxed max-w-3xl mx-auto">
              AI-powered presentation platform that transforms your ideas into professional slides in seconds, not hours.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl font-bold text-[#fafafa] mb-6">Our Mission</h2>
                <p className="text-[#a0a0a0] leading-relaxed mb-6">
                  We created SlideAura to solve a simple problem: creating presentations takes too much time and effort. Most professionals spend hours designing slides when they should be focusing on their message.
                </p>
                <p className="text-[#a0a0a0] leading-relaxed mb-6">
                  Our AI platform handles the heavy lifting - content creation, design selection, and formatting - so you can generate professional presentations in under 60 seconds.
                </p>
                <Link to="/">
                  <Button variant="cta" className="px-6 py-3">
                    Try SlideAura Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-8 rounded-2xl border border-[#3a3a3a]">
                <h3 className="font-display text-xl font-semibold text-[#fafafa] mb-4">What We Solve</h3>
                <ul className="space-y-3 text-[#a0a0a0]">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#8b5cf6] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Time-consuming slide creation process</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#ec4899] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Lack of design skills and resources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#f59e0b] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Inconsistent formatting across slides</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#8b5cf6] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Difficulty organizing content structure</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-[#fafafa] mb-4">Powered by AI</h2>
              <p className="text-[#a0a0a0] max-w-2xl mx-auto">
                Advanced technology that makes presentation creation effortless
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 rounded-2xl border border-[#3a3a3a] hover:border-[#8b5cf6]/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white rounded-full" />
                </div>
                <h3 className="font-display text-xl font-semibold text-[#fafafa] mb-3">Neural Networks</h3>
                <p className="text-[#a0a0a0] leading-relaxed">
                  Advanced AI models understand context and generate relevant content for your specific topic and audience.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 rounded-2xl border border-[#3a3a3a] hover:border-[#ec4899]/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-[#ec4899] to-[#f59e0b] rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-white rounded-full" />
                </div>
                <h3 className="font-display text-xl font-semibold text-[#fafafa] mb-3">Smart Templates</h3>
                <p className="text-[#a0a0a0] leading-relaxed">
                  Professional design templates that adapt to your content while maintaining visual consistency.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 rounded-2xl border border-[#3a3a3a] hover:border-[#f59e0b]/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-white rounded-full" />
                </div>
                <h3 className="font-display text-xl font-semibold text-[#fafafa] mb-3">Cloud Platform</h3>
                <p className="text-[#a0a0a0] leading-relaxed">
                  Access your presentations from anywhere and export in multiple formats with perfect formatting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-12">
            <h2 className="font-display text-3xl font-bold text-[#fafafa] mb-4">
              Start Creating Better Presentations
            </h2>
            <p className="text-[#a0a0a0] mb-8 max-w-2xl mx-auto">
              Join professionals who are saving hours of work with AI-powered presentation creation.
            </p>
            <Link to="/">
              <Button variant="cta" size="lg" className="px-8 py-4">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
