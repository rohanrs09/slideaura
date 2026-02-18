import OutlineSection from "@/components/custom/OutlineSection";
import {
  firebaseDb,
  GeminiAiLiveModel,
} from "../../../../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import type { Project } from "../outline";
import SliderFrame from "@/components/custom/SliderFrame";
import InlineSlideEditor from "@/components/custom/InlineSlideEditor";
import * as htmlToImage from "html-to-image";
import PptxGenJS from "pptxgenjs";
import { Loader2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { showToast } from "@/lib/toast";

const SLIDER_PROMPT = `You are a world-class presentation designer. Create a UNIQUE, professionally designed slide that looks like it was made by a human designer, not AI.

SELECTED DESIGN: {DESIGN_STYLE}
COLORS: {COLORS_CODE}
CONTENT: {METADATA}

⚠️ CRITICAL: Create UNIQUE, NON-GENERIC designs. Avoid AI-looking patterns.

🎨 PROFESSIONAL BLUE - Corporate Excellence:
- Use asymmetrical layouts with visual hierarchy
- Add subtle geometric patterns (CSS: background-image: linear-gradient(45deg, transparent 48%, rgba(10,102,194,0.05) 50%, transparent 52%))
- Include data visualization elements (progress bars, charts)
- Use professional photography with proper composition
- Typography: Inter font, tight letter-spacing, strategic emphasis

🎨 MINIMAL WHITE - Scandinavian Design:
- Use generous whitespace (30% of slide)
- Create visual tension with selective bold elements
- Add subtle grid patterns (CSS: background-image: repeating-linear-gradient(0deg, #f0f0f0, #f0f0f0 1px, transparent 1px, transparent 20px))
- Include monochromatic images with high contrast
- Typography: Helvetica Neue, elegant line-height (1.6)

🎨 MODERN GRADIENT - Tech Innovation:
- Create dynamic overlapping elements with depth
- Use glassmorphism (backdrop-blur(12px), rgba(255,255,255,0.1))
- Add animated gradient backgrounds (CSS: background-size: 200% 200%)
- Include futuristic imagery with neon accents
- Typography: SF Pro Display, medium weight, letter-spacing -0.02

🎨 ELEGANT DARK - Luxury Premium:
- Use sophisticated gold accents (#D4AF37, #B8860B)
- Create visual hierarchy with serif/sans combinations
- Add subtle texture patterns (CSS: background-image: url("data:image/svg+xml,%3Csvg width='40' height='40'..."))
- Include premium lifestyle photography
- Typography: Playfair Display for headings, system-ui for body

🎨 CREATIVE PASTEL - Brand Design:
- Use organic shapes and curved paths
- Create playful compositions with asymmetry
- Add hand-drawn elements (SVG paths)
- Include colorful, vibrant photography
- Typography: Circular Std, rounded letterforms

🎨 STARTUP PITCH - Data-Driven:
- Create clean infographics and data visualization
- Use isometric illustrations and icons
- Add micro-interactions and hover states
- Include professional business photography
- Typography: Roboto, condensed for data, regular for text

📐 LAYOUT SYSTEMS (Choose based on content type):

TITLE SLIDE:
- Centered composition with visual anchor
- Large typography (60-72px) with elegant spacing
- Single impactful image with proper composition
- Brand elements and subtle details

CONTENT SLIDE:
- 60/40 split with visual hierarchy
- Data visualization integrated naturally
- Professional imagery with proper sizing
- Clear call-to-action elements

DATA SLIDE:
- Clean infographic design
- Chart.js integration for dynamic visuals
- Icon-based data representation
- Color-coded information architecture

🖼️ IMAGE REQUIREMENTS:
- Use: https://ik.imagekit.io/ikmedia/ik-genimg-prompt-DESCRIPTION/image.jpg?tr=w-800,h-450,fo-auto,q-85
- Professional photography style
- Proper composition and subject matter
- High-quality, non-stock-looking images

✨ DESIGN PRINCIPLES:
- Visual hierarchy through size, color, and placement
- Proper white space and breathing room
- Consistent alignment and grid systems
- Professional color harmony
- Typography that enhances readability

🚫 AVOID:
- Generic templates and layouts
- AI-looking patterns and repetitions
- Poor image quality or composition
- Inconsistent spacing and alignment
- Overused design clichés

Generate a UNIQUE, professionally designed slide that looks human-crafted:`

function Editor() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectDetail, setProjectDetail] = useState<Project>();
  const [loading, setLoading] = useState(false);
  const [sliders, setSliders] = useState<Array<{ code: string }>>([]);
  const [isSlidesGenerated, setIsSlidesGenerated] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);

  useEffect(() => {
    if (projectId) {
      GetProjectDetail();
    }
  }, [projectId]);

  const GetProjectDetail = async () => {
    setLoading(true);
    try {
      const docRef = doc(firebaseDb, "projects", projectId ?? "");
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.error("❌ Project not found");
        setLoading(false);
        return;
      }
      
      const projectData = docSnap.data();
      
      // Check if required data exists
      if (!projectData.outline || !projectData.designStyle) {
        console.error("❌ Missing outline or designStyle. Redirecting to outline page...");
        navigate(`/workspace/project/${projectId}/outline`);
        return;
      }
      
      setProjectDetail(projectData as Project);
    } catch (error) {
      console.error("❌ Error loading project:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectDetail && !projectDetail?.slides?.length) {
      GenerateSlides();
    } else if (projectDetail?.slides) {
      // Fix existing slides with invisible text and apply theme colors
      const colors = projectDetail?.designStyle?.colors || {};
      const fixedSlides = projectDetail.slides.map((slide) => {
        if (!slide.code) return slide;
        
        let fixedCode = slide.code;
        
        // Replace white text with primary color for visibility
        if (fixedCode.includes('color: white')) {
          fixedCode = fixedCode.replace(/color:\s*white/g, `color: ${colors.primary || '#000000'}`);
        }
        
        // Ensure background color is applied
        if (colors.background && !fixedCode.includes(`background: ${colors.background}`)) {
          fixedCode = fixedCode.replace(/background:\s*#[A-Fa-f0-9]{6}/g, `background: ${colors.background}`);
        }
        
        return { ...slide, code: fixedCode };
      });
      setSliders(fixedSlides);
    }
  }, [projectDetail]);

  const GenerateSlides = async () => {
    if (!projectDetail?.outline || projectDetail.outline.length === 0) {
      showToast.error("Missing Outline", "Please create an outline first before generating slides.");
      return;
    }

    const actualSlides = projectDetail.outline.length;
    showToast.info("Generating Slides", `Creating ${actualSlides} professional slides with images...`);

    // Initialize sliders array and progress
    setSliders(new Array(actualSlides).fill(null));
    setGenerationProgress({ current: 0, total: actualSlides });
    
    try {
      for (let index = 0; index < projectDetail.outline.length; index++) {
        const slideData = projectDetail.outline[index];
        const colors = projectDetail?.designStyle?.colors || {};
        const designStyle = projectDetail?.designStyle?.styleName || "Professional Blue";
        
        // Enhanced metadata with slide type detection
        const isFirstSlide = index === 0;
        const slideType = isFirstSlide ? "title" : "content";
        
        const metadata = {
          slideNumber: index + 1,
          totalSlides: projectDetail.outline.length,
          slideType: slideType,
          title: slideData.slidePoint || `Slide ${index + 1}`,
          content: slideData.outline || '',
          designTemplate: designStyle,
          // Add specific image prompt based on content
          suggestedImageTopic: slideData.slidePoint?.toLowerCase().includes('team') ? 'team collaboration' :
                               slideData.slidePoint?.toLowerCase().includes('data') ? 'data analytics' :
                               slideData.slidePoint?.toLowerCase().includes('growth') ? 'business growth' :
                               slideData.slidePoint?.toLowerCase().includes('tech') ? 'modern technology' :
                               'professional business'
        };
        
        const prompt = SLIDER_PROMPT
          .replace("{DESIGN_STYLE}", designStyle)
          .replace("{COLORS_CODE}", JSON.stringify(colors))
          .replace("{METADATA}", JSON.stringify(metadata));

        console.log(`🎨 Generating slide ${index + 1}/${actualSlides} - ${designStyle}`);
        console.log(`📊 Colors:`, colors);
        console.log(`📝 Metadata:`, metadata);
        console.log(`💡 Prompt preview:`, prompt.substring(0, 500) + "...");
        
        setGenerationProgress({ current: index + 1, total: projectDetail.outline.length });
        await GeminiSlideCall(prompt, index);
      }

      setIsSlidesGenerated(Date.now());
      showToast.success("Slides Generated!", `Successfully created ${actualSlides} slides with images and proper design`);
      
    } catch (error) {
      console.error("❌ Failed to generate slides:", error);
      showToast.error("Generation Failed", "Slide generation encountered an issue. Please try again.");
    }
  };

  const GeminiSlideCall = async (prompt: string, index: number) => {
    let session = null;
    
    try {
      session = await GeminiAiLiveModel.connect();
      await session.send(prompt);

      let text = "";
      let retryCount = 0;
      const maxRetries = 3;

      // Read stream with retry logic
      while (retryCount < maxRetries) {
        try {
          for await (const message of session.receive()) {
            if (message.type === "serverContent") {
              const parts = message.modelTurn?.parts;
              if (parts && parts.length > 0) {
                text += parts?.map((p) => p.text).join("");

                const finalText = text
                  .replace(/```html/g, "")
                  .replace(/```/g, "")
                  .replace(/<[^>]*>/g, '') // Remove any HTML tags to check content
                  .trim();

                // Validate that we have meaningful content
                if (finalText.length < 10) {
                  console.warn(`⚠️ AI response too short for slide ${index + 1}:`, finalText);
                  continue; // Skip this update and wait for more content
                }

                // Re-add HTML tags for display
                const displayText = text
                  .replace(/```html/g, "")
                  .replace(/```/g, "")
                  .trim();

                // Validate that it contains a proper div structure
                if (!displayText.includes('<div') || !displayText.includes('</div>')) {
                  console.warn(`⚠️ Invalid HTML structure for slide ${index + 1}`);
                  continue;
                }

                console.log(`✅ Valid slide content for slide ${index + 1}:`, displayText.substring(0, 100) + "...");

                // Live update the slider
                setSliders((prev) => {
                  const updated = prev ? [...prev] : [];
                  updated[index] = { code: displayText };
                  return updated;
                });
              }

              // Check for completion - use @ts-expect-error for API limitation
              // @ts-expect-error - turnComplete exists but not in current types
              if (message.modelTurn?.turnComplete) {
                // Slide generation complete
                break;
              }
            }
          }
          break; // Success, exit retry loop
        } catch (streamError) {
          retryCount++;
          console.warn(`⚠️ Stream error for slide ${index + 1}, retry ${retryCount}/${maxRetries}:`, streamError);
          
          if (retryCount >= maxRetries) {
            throw new Error(`Failed to generate slide ${index + 1} after ${maxRetries} attempts: ${streamError instanceof Error ? streamError.message : 'Unknown error'}`);
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      // Validate that we got content - be more lenient
      if (!text || text.trim().length < 20) {
        throw new Error(`Generated content for slide ${index + 1} is empty or too short`);
      }
      
      // Ensure we have a valid div structure
      if (!text.includes('<div') || !text.includes('</div>')) {
        throw new Error(`Generated content for slide ${index + 1} is not valid HTML`);
      }

      // Slide generated successfully
      
    } catch (error) {
      console.error(`❌ Error generating slide ${index + 1}:`, error);
      
      // Show user-friendly error message
      if (error instanceof Error && error.message.includes('handshake failed')) {
        showToast.error("AI Connection Failed", "Unable to connect to AI service. Please try again in a moment.");
      } else {
        showToast.error("Slide Generation Error", `Error generating slide ${index + 1}. Using fallback content.`);
      }
      
      // Create a proper fallback slide with actual content and image
      const slideData = projectDetail?.outline?.[index];
      const colors = projectDetail?.designStyle?.colors || {};
      
      // Generate relevant image based on content
      const imageTopic = slideData?.slidePoint?.toLowerCase().includes('team') ? 'team%20collaboration' :
                        slideData?.slidePoint?.toLowerCase().includes('data') ? 'data%20analytics' :
                        slideData?.slidePoint?.toLowerCase().includes('growth') ? 'business%20growth' :
                        slideData?.slidePoint?.toLowerCase().includes('tech') ? 'modern%20technology' :
                        'professional%20business';
      
      const designStyle = projectDetail?.designStyle?.styleName || "Professional Blue";
      
      let fallbackSlide = '';
      
      if (designStyle.includes('Professional Blue')) {
        fallbackSlide = `
          <div class="w-[800px] h-[500px] relative overflow-hidden" style="background: ${colors.background || '#FFFFFF'}; background-image: linear-gradient(135deg, ${colors.background || '#FFFFFF'} 0%, rgba(10,102,194,0.03) 100%);">
            <div class="absolute inset-0" style="background-image: linear-gradient(45deg, transparent 48%, rgba(10,102,194,0.05) 50%, transparent 52%); background-size: 20px 20px;"></div>
            <div class="relative z-10 flex items-center h-full p-12">
              <div class="w-3/5 pr-8">
                <div class="mb-4">
                  <div class="w-16 h-1" style="background: ${colors.primary || '#0A66C2'};"></div>
                </div>
                <h1 class="text-5xl font-bold mb-6 leading-tight" style="color: ${colors.primary || '#0A66C2'}; font-family: Inter, sans-serif; letter-spacing: -0.02em;">
                  ${slideData?.slidePoint || `Slide ${index + 1}`}
                </h1>
                <p class="text-lg leading-relaxed mb-8" style="color: ${colors.secondary || '#4B5563'}; font-family: Inter, sans-serif; line-height: 1.6;">
                  ${slideData?.outline || 'Content is being generated...'}
                </p>
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: ${colors.primary || '#0A66C2'};">
                    <span class="text-white font-bold">${index + 1}</span>
                  </div>
                  <div class="h-8 w-32 rounded" style="background: linear-gradient(90deg, ${colors.primary || '#0A66C2'} 0%, ${colors.accent || '#E8F0FE'} 100%);"></div>
                </div>
              </div>
              <div class="w-2/5 pl-4">
                <div class="relative">
                  <img src="https://ik.imagekit.io/ikmedia/ik-genimg-prompt-${imageTopic}/slide.jpg?tr=w-400,h-300,fo-auto,q-90" 
                       alt="${slideData?.slidePoint || 'Business'}" 
                       class="rounded-2xl shadow-2xl w-full object-cover" 
                       style="height: 300px;">
                  <div class="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl" style="background: ${colors.accent || '#E8F0FE'};"></div>
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (designStyle.includes('Minimal White')) {
        fallbackSlide = `
          <div class="w-[800px] h-[500px] relative overflow-hidden" style="background: ${colors.background || '#FFFFFF'}; background-image: repeating-linear-gradient(0deg, #f5f5f5, #f5f5f5 1px, transparent 1px, transparent 20px);">
            <div class="flex items-center justify-center h-full p-16">
              <div class="text-center max-w-3xl">
                <div class="mb-8">
                  <span class="text-sm font-medium tracking-widest uppercase" style="color: ${colors.secondary || '#999999'};">Slide ${index + 1}</span>
                </div>
                <h1 class="text-6xl font-light mb-8 leading-tight" style="color: ${colors.primary || '#000000'}; font-family: 'Helvetica Neue', sans-serif; letter-spacing: -0.03em;">
                  ${slideData?.slidePoint || `Slide ${index + 1}`}
                </h1>
                <div class="w-24 h-0.5 mx-auto mb-8" style="background: ${colors.primary || '#000000'};"></div>
                <p class="text-xl leading-relaxed" style="color: ${colors.secondary || '#666666'}; font-family: 'Helvetica Neue', sans-serif; line-height: 1.6;">
                  ${slideData?.outline || 'Content is being generated...'}
                </p>
                <div class="mt-12">
                  <img src="https://ik.imagekit.io/ikmedia/ik-genimg-prompt-${imageTopic}/slide.jpg?tr=w-300,h-200,fo-auto,q-90" 
                       alt="${slideData?.slidePoint || 'Business'}" 
                       class="mx-auto rounded-lg object-cover" 
                       style="width: 300px; height: 200px; filter: grayscale(100%);">
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (designStyle.includes('Modern Gradient')) {
        fallbackSlide = `
          <div class="w-[800px] h-[500px] relative overflow-hidden" style="background: linear-gradient(135deg, ${colors.primary || '#8A2BE2'} 0%, ${colors.secondary || '#00C9FF'} 100%);">
            <div class="absolute inset-0" style="background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%);"></div>
            <div class="relative z-10 flex items-center h-full p-12">
              <div class="w-1/2 pr-8">
                <div class="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h1 class="text-4xl font-bold mb-4 text-white leading-tight" style="font-family: 'SF Pro Display', sans-serif; letter-spacing: -0.02em;">
                    ${slideData?.slidePoint || `Slide ${index + 1}`}
                  </h1>
                  <p class="text-white/90 leading-relaxed" style="font-family: 'SF Pro Display', sans-serif;">
                    ${slideData?.outline || 'Content is being generated...'}
                  </p>
                </div>
              </div>
              <div class="w-1/2 pl-4">
                <div class="relative backdrop-blur-lg bg-white/10 rounded-2xl p-4 border border-white/20">
                  <img src="https://ik.imagekit.io/ikmedia/ik-genimg-prompt-${imageTopic}/slide.jpg?tr=w-350,h-250,fo-auto,q=90" 
                       alt="${slideData?.slidePoint || 'Business'}" 
                       class="rounded-xl object-cover w-full" 
                       style="height: 250px;">
                  <div class="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (designStyle.includes('Elegant Dark')) {
        fallbackSlide = `
          <div class="w-[800px] h-[500px] relative overflow-hidden" style="background: ${colors.background || '#0D0D0D'}; background-image: url('data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(212,175,55,0.1)" stroke-width="1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grid)" /%3E%3C/svg%3E');">
            <div class="flex items-center justify-center h-full p-16">
              <div class="text-center max-w-3xl">
                <div class="mb-6">
                  <div class="w-16 h-0.5 mx-auto" style="background: #D4AF37;"></div>
                </div>
                <h1 class="text-5xl font-serif mb-6 leading-tight text-white" style="font-family: 'Playfair Display', serif; letter-spacing: 0.02em;">
                  ${slideData?.slidePoint || `Slide ${index + 1}`}
                </h1>
                <div class="w-32 h-0.5 mx-auto mb-6" style="background: linear-gradient(90deg, transparent, #D4AF37, transparent);"></div>
                <p class="text-lg leading-relaxed text-gray-300 mb-8" style="font-family: system-ui; line-height: 1.7;">
                  ${slideData?.outline || 'Content is being generated...'}
                </p>
                <div class="flex items-center justify-center gap-8">
                  <img src="https://ik.imagekit.io/ikmedia/ik-genimg-prompt-${imageTopic}/slide.jpg?tr=w-280,h-200,fo-auto,q=90" 
                       alt="${slideData?.slidePoint || 'Business'}" 
                       class="rounded-lg object-cover" 
                       style="width: 280px; height: 200px; border: 2px solid #D4AF37;">
                  <div class="text-left">
                    <div class="text-2xl font-serif text-yellow-500 mb-2">${index + 1}</div>
                    <div class="text-sm text-gray-400">Premium Design</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      } else {
        // Default professional layout
        fallbackSlide = `
          <div class="w-[800px] h-[500px] relative overflow-hidden flex items-center p-8" style="background: ${colors.background || '#FFFFFF'};">
            <div class="grid grid-cols-2 gap-6 w-full h-full">
              <div class="flex flex-col justify-center">
                <h1 class="text-4xl font-bold mb-4" style="color: ${colors.primary || '#1C1C1C'};">
                  ${slideData?.slidePoint || `Slide ${index + 1}`}
                </h1>
                <p class="text-lg leading-relaxed" style="color: ${colors.secondary || '#666666'};">
                  ${slideData?.outline || 'Content is being generated...'}
                </p>
              </div>
              <div class="flex items-center justify-center">
                <img src="https://ik.imagekit.io/ikmedia/ik-genimg-prompt-${imageTopic}/slide.jpg?tr=w-600,h-400,fo-auto,q-80" 
                     alt="${slideData?.slidePoint || 'Business'}" 
                     class="rounded-lg object-cover w-full shadow-lg" 
                     style="max-height: 350px;">
              </div>
            </div>
          </div>
        `;
      }
      
      setSliders((prev) => {
        const updated = prev ? [...prev] : [];
        updated[index] = { code: fallbackSlide };
        return updated;
      });
      
    } finally {
      if (session) {
        try {
          await session.close();
        } catch (closeError) {
          console.warn(`⚠️ Error closing session for slide ${index + 1}:`, closeError);
        }
      }
    }
  };

  useEffect(() => {
    if (isSlidesGenerated) SaveAllSlides();
  }, [isSlidesGenerated]);

  const SaveAllSlides = async () => {
    if (!sliders || sliders.length === 0) {
      console.log("⚠️ No slides to save");
      return;
    }
    
    try {
      // Saving slides to Firebase
      await setDoc(
        doc(firebaseDb, "projects", projectId ?? ""),
        {
          slides: sliders,
        },
        {
          merge: true,
        }
      );
      // Slides saved successfully
    } catch (error) {
      console.error("❌ Error saving slides:", error);
    }
  };

  const updateSliderCode = (updateSlideCode: string, index: number) => {
    setSliders((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        code: updateSlideCode,
      };
      return updated;
    });
    setIsSlidesGenerated(Date.now());
  };

  // Handle outline updates and save to Firebase
  const handleOutlineUpdate = async (slideNo: string, updatedData: { slidePoint: string; outline: string }) => {
    if (!projectDetail || !projectId) return;
    
    const updatedOutline = projectDetail.outline.map((item) =>
      item.slideNo === slideNo ? { ...item, ...updatedData } : item
    );
    
    // Update local state
    setProjectDetail({ ...projectDetail, outline: updatedOutline });
    
    // Save to Firebase
    try {
      await setDoc(
        doc(firebaseDb, "projects", projectId),
        { outline: updatedOutline },
        { merge: true }
      );
      console.log("✅ Outline updated and saved");
    } catch (error) {
      console.error("❌ Error saving outline:", error);
    }
  };

  const exportAllIframesToPPT = async () => {
    if (!containerRef.current) return;
    setDownloadLoading(true);
    const pptx = new PptxGenJS();
    const iframes = containerRef.current.querySelectorAll("iframe");

    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i] as HTMLIFrameElement;
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) continue;

      // Grab the main slide element inside the iframe (usually <body> or inner div)
      const slideNode = iframeDoc.querySelector("body > div") || iframeDoc.body;
      if (!slideNode) continue;

      // Exporting slide
      // @ts-expect-error - html2image types are incomplete but the function works
      const dataUrl = await htmlToImage.toPng(slideNode, { quality: 1 });

      const slide = pptx.addSlide();
      slide.addImage({
        data: dataUrl,
        x: 0,
        y: 0,
        w: 10,
        h: 5.625,
      });
    }
    setDownloadLoading(false);
    pptx.writeFile({ fileName: "MyProjectSlides.pptx" });
  };

  return (
    <div className="relative bg-[#0A0118] min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#A855F7] mx-auto mb-4" />
            <p className="text-[#C4B5FD]">Preparing your workspace...</p>
          </div>
        </div>
      ) : !projectDetail ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-[#C4B5FD] mb-4">Project not found</p>
            <Button onClick={() => navigate('/workspace')}>Back to Workspace</Button>
          </div>
        </div>
      ) : (
        <>
          {/* Editor grid */}
          <div className="flex flex-col lg:flex-row gap-6 p-6 pb-32">
            {/* Left panel - Outline */}
            <div className="w-full lg:w-2/5 h-[calc(100vh-160px)] overflow-auto">
              <div className="bg-[#150828] rounded-2xl border border-[#A855F7]/20 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Slide Outline</h2>
                <OutlineSection
                  outline={projectDetail?.outline ?? []}
                  handleUpdateOutline={handleOutlineUpdate}
                  loading={false}
                  editable={true}
                />
              </div>
            </div>
            
            {/* Right panel - Slides */}
            <div className="w-full lg:w-3/5 h-[calc(100vh-160px)] overflow-auto" ref={containerRef}>
              <div className="space-y-6">
                {/* Generation Progress */}
                {generationProgress.total > 0 && generationProgress.current < generationProgress.total && (
                  <div className="bg-[#150828] border border-[#A855F7]/30 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Loader2 className="h-6 w-6 animate-spin text-[#A855F7]" />
                      <div className="flex-1">
                        <h3 className="text-[#F5F3FF] font-semibold mb-1">
                          Generating Professional Slides with {projectDetail?.designStyle?.styleName || 'Design'}
                        </h3>
                        <p className="text-[#8B7AB8] text-sm">
                          Creating slide {generationProgress.current} of {generationProgress.total} with images and proper styling...
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-[#1F0E3A] rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#A855F7] h-3 rounded-full transition-all duration-500 animate-pulse"
                        style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Slides  */}
                {!sliders || sliders.length === 0 ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                      <Loader2 className="h-12 w-12 animate-spin text-[#A855F7] mx-auto mb-4" />
                      <p className="text-[#C4B5FD] text-lg font-semibold mb-2">Initializing slide generation...</p>
                      <p className="text-[#8B7AB8] text-sm">Setting up your presentation workspace</p>
                    </div>
                  </div>
                ) : (
                  sliders.map((slide, index: number) => {
                    const outlineData = projectDetail?.outline?.[index];
                    return (
                      <div key={index} className="space-y-4">
                        {/* Inline Editor */}
                        {editingSlideIndex === index && outlineData ? (
                          <InlineSlideEditor
                            slideData={outlineData}
                            slideIndex={index}
                            onUpdate={(idx, updatedData) => {
                              handleOutlineUpdate(String(idx), updatedData);
                              setEditingSlideIndex(null);
                            }}
                          />
                        ) : (
                          /* Slide with Edit Button */
                          <div className="relative group">
                            <SliderFrame
                              slide={slide}
                              colors={projectDetail?.designStyle?.colors || {}}
                              setUpdateSlider={(updateSlideCode: string) =>
                                updateSliderCode(updateSlideCode, index)
                              }
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Fixed bottom export bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0118] via-[#0A0118]/95 to-transparent pointer-events-none" />
        <div className="relative flex justify-center pb-6 pt-12 px-6">
          <div className="bg-[#150828] rounded-2xl border border-[#A855F7]/20 p-4 shadow-2xl">
            <Button
              onClick={exportAllIframesToPPT}
              variant="cta"
              size={"lg"}
              className="gap-2 px-8 shadow-[0_0_32px_-8px_rgba(168,85,247,0.5)]"
              disabled={downloadLoading}
            >
              {downloadLoading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <FileDown className="h-4 w-4" />
              )}
              Export as PowerPoint
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
