import { FileText, Palette, Download } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "Intelligent Content",
      description: "Advanced AI analyzes your topic and creates compelling, structured content that engages your audience."
    },
    {
      icon: Palette,
      title: "Professional Design",
      description: "Beautiful templates with modern typography and layouts that make your presentations stand out."
    },
    {
      icon: Download,
      title: "Multiple Formats",
      description: "Export to PowerPoint, PDF, or present directly from your browser with perfect formatting."
    }
  ];

  return (
    <section className="bg-[#0a0a0a] py-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-[#fafafa] mb-6">
            Powerful features for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#ec4899]">
              professional presentations
            </span>
          </h2>
          <p className="text-[#a0a0a0] text-lg max-w-3xl mx-auto">
            Our AI-powered platform combines intelligent content generation with professional design to help you create stunning presentations effortlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex w-16 h-16 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#ec4899]/20 border border-[#8b5cf6]/30 items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-7 w-7 text-[#8b5cf6] rounded-full" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#fafafa] mb-3">
                {feature.title}
              </h3>
              <p className="text-[#a0a0a0] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
