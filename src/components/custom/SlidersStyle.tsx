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

  // Generate slide preview for each style
  const generateSlidePreview = (design: any) => {
    const styleName = design.styleName.split(' ')[0];
    
    if (styleName.includes('Professional')) {
      return `
        <div class="w-full h-full bg-white relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="text-xs font-bold text-blue-600 tracking-wider">PROFESSIONAL</div>
              <div class="text-xs text-gray-500">2024</div>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-3">Business Strategy</h1>
            <p class="text-gray-600 text-sm mb-6">Building sustainable growth through innovation and strategic planning</p>
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div class="text-2xl text-center mb-1">📊</div>
                <p class="text-xs text-center text-gray-600">Analytics</p>
              </div>
              <div class="bg-blue-100 rounded-lg p-3 border border-blue-200">
                <div class="text-2xl text-center mb-1">📈</div>
                <p class="text-xs text-center text-gray-600">Growth</p>
              </div>
              <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div class="text-2xl text-center mb-1">🎯</div>
                <p class="text-xs text-center text-gray-600">Goals</p>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (styleName.includes('Minimal')) {
      return `
        <div class="w-full h-full bg-white relative overflow-hidden">
          <div class="p-8">
            <div class="text-center">
              <div class="inline-block">
                <div class="w-24 h-0.5 bg-black mb-8"></div>
                <h1 class="text-4xl font-light text-black mb-4">Minimal Design</h1>
                <p class="text-gray-500 text-lg mb-8">Less is more</p>
                <div class="w-32 h-0.5 bg-gray-300 mx-auto"></div>
              </div>
            </div>
        </div>
      `;
    } else if (styleName.includes('Modern')) {
      return `
        <div class="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 relative overflow-hidden">
          <div class="absolute inset-0 bg-black/20"></div>
          <div class="relative p-6">
            <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/30">
              <div class="flex items-center justify-between mb-4">
                <div class="text-xs font-bold text-white tracking-wider">MODERN</div>
                <div class="text-xs text-white/80">INNOVATION</div>
              </div>
              <h1 class="text-2xl font-bold text-white mb-3">Future Technology</h1>
              <p class="text-white/90 text-sm mb-6">Cutting-edge solutions for tomorrow's challenges</p>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/20">
                  <div class="text-center">
                    <div class="w-12 h-12 bg-white/30 rounded-lg mx-auto mb-2"></div>
                    <p class="text-xs text-white/80">AI Powered</p>
                  </div>
                </div>
                <div class="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                  <div class="text-center">
                    <div class="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2"></div>
                    <p class="text-xs text-white/80">Cloud Native</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (styleName.includes('Elegant')) {
      return `
        <div class="w-full h-full bg-black relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
          <div class="p-8">
            <div class="text-center">
              <div class="inline-block">
                <div class="w-32 h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 mb-8"></div>
                <h1 class="text-4xl font-serif text-white mb-4">Elegant Design</h1>
                <p class="text-gray-300 text-lg mb-8">Luxury meets simplicity</p>
                <div class="flex justify-center gap-6">
                  <div class="w-16 h-16 border border-yellow-500/50 rounded-lg"></div>
                  <div class="w-16 h-16 bg-yellow-500/20 rounded-full"></div>
                  <div class="w-16 h-16 border border-yellow-500/30 rounded-full"></div>
                </div>
              </div>
            </div>
        </div>
      `;
    } else if (styleName.includes('Creative')) {
      return `
        <div class="w-full h-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-full bg-white/30"></div>
          <div class="relative p-6">
            <div class="bg-white/90 backdrop-blur-md rounded-3xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="text-xs font-bold text-purple-800 tracking-wider">CREATIVE</div>
                <div class="text-xs text-purple-600">ARTISTIC</div>
              </div>
              <h1 class="text-2xl font-bold text-purple-900 mb-3">Creative Freedom</h1>
              <p class="text-purple-700 text-sm mb-6">Express your imagination without limits</p>
              <div class="flex justify-center gap-3">
                <div class="w-14 h-14 bg-pink-400 rounded-2xl transform rotate-12"></div>
                <div class="w-14 h-14 bg-purple-400 rounded-full"></div>
                <div class="w-14 h-14 bg-blue-400 rounded-xl transform -12"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (styleName.includes('Startup')) {
      return `
        <div class="w-full h-full bg-gradient-to-br from-blue-600 via-teal-500 to-green-600 relative overflow-hidden">
          <div class="p-6">
            <div class="bg-white rounded-2xl p-6 shadow-xl">
              <div class="flex items-center justify-between mb-4">
                <div class="text-xs font-bold text-gray-800 tracking-wider">STARTUP</div>
                <div class="text-xs text-gray-600">PITCH</div>
              </div>
              <h1 class="text-2xl font-bold text-gray-900 mb-3">Growth Strategy</h1>
              <p class="text-gray-600 text-sm mb-6">Data-driven approach to scaling your business</p>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="text-xs font-bold text-green-600 w-12">Q1</div>
                  <div class="flex-1 h-6 bg-green-100 rounded-full overflow-hidden">
                    <div class="h-full bg-green-500 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="text-xs font-bold text-blue-600 w-12">Q2</div>
                  <div class="flex-1 h-6 bg-blue-100 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full" style={{width: '65%'}}></div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="text-xs font-bold text-purple-600 w-12">Q3</div>
                  <div class="flex-1 h-6 bg-purple-100 rounded-full overflow-hidden">
                    <div class="h-full bg-purple-500 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (styleName.includes('Futuristic')) {
      return `
        <div class="w-full h-full bg-black relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-full">
            <div class="absolute top-0 left-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl"></div>
            <div class="absolute top-20 right-0 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
            <div class="absolute bottom-0 left-0 w-28 h-28 bg-pink-500/20 rounded-full blur-2xl"></div>
          </div>
          <div class="relative p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="text-xs font-bold text-cyan-400 tracking-wider">FUTURISTIC</div>
              <div class="text-xs text-cyan-300">NEON</div>
            </div>
            <h1 class="text-2xl font-bold text-cyan-400 mb-3">Digital Evolution</h1>
            <p class="text-gray-400 text-sm mb-6">Tomorrow's technology today</p>
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-cyan-500/20 rounded-lg border border-cyan-500/50 p-3">
                <div class="text-center">
                  <div class="w-8 h-8 bg-cyan-500/40 rounded mx-auto mb-2"></div>
                  <p class="text-xs text-cyan-300">AI</p>
                </div>
              </div>
              <div class="bg-purple-500/20 rounded-lg border border-purple-500/50 p-3">
                <div class="text-center">
                  <div class="w-8 h-8 bg-purple-500/40 rounded mx-auto mb-2"></div>
                  <p class="text-xs text-purple-300">VR</p>
                </div>
              </div>
              <div class="bg-pink-500/20 rounded-lg border border-pink-500/50 p-3">
                <div class="text-center">
                  <div class="w-8 h-8 bg-pink-500/40 rounded mx-auto mb-2"></div>
                  <p class="text-xs text-pink-300">IoT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (styleName.includes('Infographic')) {
      return `
        <div class="w-full h-full bg-white relative overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h1 class="text-2xl font-bold text-gray-900">Data Insights</h1>
              <div class="text-xs text-gray-500 font-semibold">ANALYTICS</div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">Revenue Growth</p>
                    <div class="w-full h-4 bg-blue-100 rounded-full overflow-hidden mt-1">
                      <div class="h-full bg-blue-500 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">B</div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">User Engagement</p>
                    <div class="w-full h-4 bg-green-100 rounded-full overflow-hidden mt-1">
                      <div class="h-full bg-green-500 rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">C</div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">Market Share</p>
                    <div class="w-full h-4 bg-orange-100 rounded-full overflow-hidden mt-1">
                      <div class="h-full bg-orange-500 rounded-full" style={{width: '45%'}}></div>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">D</div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">Conversion Rate</p>
                    <div class="w-full h-4 bg-purple-100 rounded-full overflow-hidden mt-1">
                      <div class="h-full bg-purple-500 rounded-full" style={{width: '30%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    return `
      <div class="w-full h-full bg-gray-100 p-8 flex items-center justify-center">
        <div class="text-center">
          <div class="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <p class="text-gray-600 font-medium">Design Template</p>
        </div>
      </div>
    `;
  };

  return (
    <div className="w-full">
      {/* Enhanced Header */}
      <div className="relative mb-8">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7]/10 to-[#EC4899]/10 rounded-full blur-3xl" />
        
        <div className="relative bg-[#150828]/40 backdrop-blur-xl border border-[#A855F7]/20 rounded-2xl p-6">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A855F7] to-[#EC4899] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#F5F3FF] to-[#EC4899] bg-clip-text text-transparent">
                Choose Design Style
              </h2>
              <p className="text-sm text-[#C4B5FD]">Select a professional template for your slides</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Design Styles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Design_Styles.map((design, index) => (
          <div
            key={index}
            className={`group relative cursor-pointer transition-all duration-500 transform hover:scale-[1.03] ${
              design.styleName === selectedStyle
                ? "ring-4 ring-[#A855F7]/40 shadow-[0_0_30px_-12px_rgba(168,85,247,0.6)]"
                : "shadow-2xl hover:shadow-3xl"
            }`}
            onClick={() => {
              setSelectedStyle(design.styleName);
              selectStyle(design);
            }}
          >
            {/* Card Container */}
            <div className="bg-[#150828]/70 backdrop-blur-xl border border-[#A855F7]/30 rounded-2xl overflow-hidden">
              {/* Slide Preview */}
              <div className="relative h-56 overflow-hidden bg-white">
                <div 
                  className="w-full h-full transform transition-transform duration-700 group-hover:scale-[1.05]"
                  dangerouslySetInnerHTML={{ __html: generateSlidePreview(design) }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#150828]/95 via-transparent to-transparent" />
                
                {/* Selected Badge */}
                {design.styleName === selectedStyle && (
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] flex items-center justify-center shadow-[0_0_24px_-8px_rgba(168,85,247,0.8)] animate-pulse">
                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                      <path d="M2 8L7 13L18 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#A855F7]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#F5F3FF] mb-2 leading-tight">
                      {design.styleName.split(' ')[0]}
                    </h3>
                    <p className="text-sm text-[#C4B5FD] leading-relaxed">
                      {design.styleName.includes('Professional') ? 'Corporate & Business Presentations' :
                       design.styleName.includes('Minimal') ? 'Clean & Simple Elegance' :
                       design.styleName.includes('Modern') ? 'Tech & Innovation' :
                       design.styleName.includes('Elegant') ? 'Luxury & Premium Quality' :
                       design.styleName.includes('Creative') ? 'Artistic & Fun Expression' :
                       design.styleName.includes('Startup') ? 'Bold & Data-Driven Pitch' :
                       design.styleName.includes('Futuristic') ? 'Neon & Cyberpunk Style' :
                       design.styleName.includes('Infographic') ? 'Data & Charts Visualization' : 'Professional Template'}
                    </p>
                  </div>
                </div>
                
                {/* Color Palette Preview */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#8B7AB8] font-medium">Colors:</span>
                    <div className="flex -space-x-2">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-[#A855F7]/40 shadow-md transition-transform hover:scale-110" 
                        style={{ backgroundColor: design.colors.primary }}
                      />
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-[#A855F7]/40 shadow-md transition-transform hover:scale-110" 
                        style={{ backgroundColor: design.colors.secondary }}
                      />
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-[#A855F7]/40 shadow-md transition-transform hover:scale-110" 
                        style={{ backgroundColor: design.colors.accent }}
                      />
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  {design.styleName === selectedStyle && (
                    <div className="flex items-center gap-2 text-xs text-[#A855F7] font-medium">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Selection Info */}
      {selectedStyle && (
        <div className="mt-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#A855F7]/20 to-[#EC4899]/20 rounded-full blur-2xl" />
          <div className="relative bg-[#150828]/70 backdrop-blur-xl border border-[#A855F7]/30 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center shadow-2xl">
                <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                  <path d="M2 8L7 13L18 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#F5F3FF] mb-1">Design Style Selected</p>
                <p className="text-sm text-[#C4B5FD]">{selectedStyle}</p>
                <p className="text-xs text-[#A855F7] mt-1">Your slides will use this professional template</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SlidersStyle;
