import { useState } from "react";
import ProfessionalSlider from "../../assets/professional.jpg";
import MinWhiteSlider from "../../assets/Minimalist-White.jpg";
import ModernGradientSlider from "../../assets/modern-gradient.jpg";
import DarkSlider from "../../assets/dark.jpg";
import PastelSlider from "../../assets/pastel-ppt.jpg";
import TechSlider from "../../assets/tech.jpg";

const Design_Styles = [
  {
    styleName: "Professional Blue 💼",
    colors: {
      primary: "#0A66C2",
      secondary: "#1C1C1C",
      accent: "#E8F0FE",
      background: "#FFFFFF",
      gradient: "linear-gradient(135deg, #0A66C2, #E8F0FE)",
    },
    designGuide:
      "🧠 Create a professional corporate-style presentation with blue and white tones, modern sans-serif fonts, clean layout, and minimal icons. Use subtle gradients and geometric backgrounds for a trustworthy business feel.",
    icon: "Briefcase",
    bannerImage: ProfessionalSlider,
  },
  {
    styleName: "Minimal White ⚪",
    colors: {
      primary: "#1C1C1C",
      secondary: "#AAAAAA",
      accent: "#EDEDED",
      background: "#FFFFFF",
      gradient: "linear-gradient(135deg, #FFFFFF, #EDEDED)",
    },
    designGuide:
      "🧠 Generate a minimalist slide deck with white backgrounds, black text, and light grey accents. Keep layouts clean, use lots of whitespace, and apply simple typography for a calm, elegant aesthetic.",
    icon: "Square",
    bannerImage: MinWhiteSlider,
  },
  {
    styleName: "Modern Gradient 🌈",
    colors: {
      primary: "#8A2BE2",
      secondary: "#00C9FF",
      accent: "#92FE9D",
      background: "#FFFFFF",
      gradient: "linear-gradient(135deg, #8A2BE2, #00C9FF, #92FE9D)",
    },
    designGuide:
      "🧠 Design a modern gradient-style PPT with vibrant gradient backgrounds, glassmorphism overlays, and smooth transitions. Use modern typography and bright gradients for an innovative, tech-savvy vibe.",
    icon: "Sparkles",
    bannerImage: ModernGradientSlider,
  },
  {
    styleName: "Elegant Dark 🖤",
    colors: {
      primary: "#0D0D0D",
      secondary: "#1F1F1F",
      accent: "#FFD700",
      background: "#0D0D0D",
      gradient: "linear-gradient(135deg, #0D0D0D, #1F1F1F)",
    },
    designGuide:
      "🧠 Create a luxury-style dark presentation with black and gold accents, serif fonts, and subtle lighting effects. Keep it premium, cinematic, and elegant.",
    icon: "Star",
    bannerImage: DarkSlider,
  },
  {
    styleName: "Creative Pastel 🎨",
    colors: {
      primary: "#F6D6FF",
      secondary: "#A0E7E5",
      accent: "#B4F8C8",
      background: "#FFFFFF",
      gradient: "linear-gradient(135deg, #F6D6FF, #A0E7E5, #B4F8C8)",
    },
    designGuide:
      "🧠 Build a creative pastel-style presentation with soft tones, rounded shapes, and hand-drawn illustrations. Ideal for design portfolios or fun workshops.",
    icon: "Palette",
    bannerImage: PastelSlider,
  },
  {
    styleName: "Startup Pitch 🚀",
    colors: {
      primary: "#0052CC",
      secondary: "#36B37E",
      accent: "#172B4D",
      background: "#FFFFFF",
      gradient: "linear-gradient(135deg, #0052CC, #36B37E)",
    },
    designGuide:
      "🧠 Design a sleek startup pitch deck with blue-green tones, bold headings, clean data charts, and a clear problem-solution layout. Keep slides dynamic and investor-friendly.",
    icon: "Rocket",
    bannerImage: TechSlider,
  },
  {
    "styleName": "Futuristic Neon ⚡",
    "colors": {
      "primary": "#00FFFF",
      "secondary": "#FF00FF",
      "accent": "#0A0A0A",
      "background": "#1A1A1A",
      "gradient": "linear-gradient(135deg, #00FFFF, #FF00FF)"
    },
    "designGuide": "🧠 Generate a futuristic neon-style PPT with glowing text, cyberpunk colors, and dark glass backgrounds. Use modern sans-serif fonts and motion-inspired visuals.",
    "icon": "Zap",
    "bannerImage": ""
  },
  {
    "styleName": "Infographic Style 📊",
    "colors": {
      "primary": "#007AFF",
      "secondary": "#FF9500",
      "accent": "#FF3B30",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #007AFF, #FF9500, #FF3B30)"
    },
    "designGuide": "🧠 Create an infographic-style presentation using colorful charts, vector icons, and bold data visuals. Focus on clarity, consistency, and engaging flow for data storytelling.",
    "icon": "BarChart",
    "bannerImage": ""
  }
];

type Props = {
  selectStyle: any;
};

export type DesignStyleType = {
  styleName: string;
  colors: any;
  designGuide: string;
  icon: string;
  bannerImage: any;
};

function SlidersStyle({ selectStyle }: Props) {
  const [selectedStyle, setSelectedStyle] = useState<string>();

  return (
    <div className="mt-8">
      <h2 className="font-heading font-bold text-lg text-[#F5F3FF] mb-4">Select Slide Style</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {Design_Styles.map((design, index) => (
          <div
            key={index}
            className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 ${
              design.styleName === selectedStyle
                ? "border-[#A855F7]/40 bg-[#A855F7]/[0.08] shadow-[0_0_24px_-8px_rgba(168,85,247,0.3)]"
                : "border-[#A855F7]/20 bg-[#150828] hover:border-[#EC4899]/40 hover:bg-[#1F0E3A]"
            }`}
            onClick={() => {
              setSelectedStyle(design.styleName);
              selectStyle(design);
            }}
          >
            <div className="relative overflow-hidden">
              <img
                src={design.bannerImage}
                alt={design.styleName}
                width={300}
                height={300}
                className="w-full h-[110px] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#150828] via-transparent to-transparent" />
              {design.styleName === selectedStyle && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] flex items-center justify-center shadow-[0_0_12px_-2px_rgba(168,85,247,0.6)]">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
            </div>
            <div className="px-3 py-2.5">
              <h2 className="text-sm font-medium text-[#F5F3FF]">{design.styleName}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SlidersStyle;
