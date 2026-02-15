import { motion } from "motion/react";
import { MessageSquare, Sparkles, Palette, Download } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: MessageSquare,
      title: "Describe Your Topic",
      description: "Tell us what your presentation is about. Be as detailed or brief as you like.",
      color: "from-[#A855F7] to-[#EC4899]"
    },
    {
      number: "02",
      icon: Sparkles,
      title: "AI Generates Content",
      description: "Our AI creates a complete outline with relevant content for each slide in seconds.",
      color: "from-[#EC4899] to-[#F97316]"
    },
    {
      number: "03",
      icon: Palette,
      title: "Choose Your Style",
      description: "Select from professional templates and customize colors to match your brand.",
      color: "from-[#F97316] to-[#FBBF24]"
    },
    {
      number: "04",
      icon: Download,
      title: "Export & Present",
      description: "Download as PowerPoint, PDF, or present directly from your browser.",
      color: "from-[#FBBF24] to-[#A855F7]"
    }
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#EC4899]/10 border border-[#EC4899]/20 text-sm font-medium text-[#EC4899] mb-4">
              How It Works
            </span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-[#F5F3FF] mb-4">
              From idea to presentation
              <br />
              <span className="bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent">
                in 4 simple steps
              </span>
            </h2>
            <p className="text-lg text-[#C4B5FD] max-w-2xl mx-auto">
              Creating professional presentations has never been easier
            </p>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-[#A855F7]/30 to-transparent -translate-x-4" />
              )}

              <div className="relative">
                {/* Number badge */}
                <div className="relative inline-flex mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-20 blur-xl rounded-full`} />
                  <div className={`relative px-4 py-2 rounded-full bg-gradient-to-br ${step.color} font-mono font-bold text-white text-sm`}>
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className="mb-4">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color}`}>
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-heading font-bold text-xl text-[#F5F3FF] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#C4B5FD] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-[#C4B5FD] mb-4">Ready to get started?</p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#A855F7]/10 to-[#EC4899]/10 border border-[#A855F7]/20">
            <Sparkles className="h-4 w-4 text-[#A855F7]" />
            <span className="text-sm font-medium text-[#F5F3FF]">
              Average creation time: <span className="text-[#A855F7]">2 minutes</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
