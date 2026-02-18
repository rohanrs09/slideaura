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

const SLIDER_PROMPT = `YOU ARE A PRESENTATION DESIGN EXPERT. FOLLOW THE SELECTED DESIGN STYLE EXACTLY.

SELECTED DESIGN STYLE:
{DESIGN_STYLE}

MANDATORY COLORS TO USE:
{COLORS_CODE}

SLIDE CONTENT:
{METADATA}

CRITICAL: The selected design style is NOT a suggestion - it is a REQUIREMENT. You MUST create slides that match the selected style exactly.

DEMANDS:
1. Return ONLY the HTML div element (no markdown, no explanations, no code blocks)
2. Use this structure: <div class="w-[800px] h-[500px] flex flex-col p-8" style="background: [background color]">
3. Follow the design guide EXACTLY - read it carefully and implement it
4. Use the EXACT colors provided - no other colors allowed
5. Match the aesthetic described in the design guide

STYLE-SPECIFIC REQUIREMENTS:

PROFESSIONAL BLUE :
- Clean corporate layout with blue accents
- Sans-serif fonts (font-sans)
- Subtle shadows and borders
- Professional business imagery
- Grid-based layouts
- Blue primary color, white background

MINIMAL WHITE :
- Maximum whitespace
- Black text on white background
- Simple typography
- Minimal decorations
- Clean lines and borders
- No gradients or complex effects

MODERN GRADIENT :
- Vibrant gradient backgrounds
- Glassmorphism effects (backdrop-blur)
- Colorful accents
- Modern typography
- Dynamic layouts
- Use gradient from colors

ELEGANT DARK :
- Black/dark background
- Gold/yellow accents
- Serif fonts (font-serif)
- Luxury feel
- Subtle lighting effects
- Premium imagery

CREATIVE PASTEL :
- Soft pastel colors
- Rounded corners (rounded-2xl)
- Playful illustrations
- Light backgrounds
- Fun, creative layouts
- Use accent colors prominently

STARTUP PITCH :
- Bold headings
- Data-focused layouts
- Clean charts and stats
- Blue-green color scheme
- Investor-friendly design
- Professional but modern

FUTURISTIC NEON :
- Dark background with neon accents
- Glowing text effects
- Cyberpunk aesthetic
- Modern sans-serif fonts
- High-tech imagery
- Cyan/magenta color scheme

INFOGRAPHIC STYLE :
- Data visualization focus
- Bold colors and icons
- Clear hierarchy
- Charts and graphs
- Statistical layouts
- Professional data presentation

TEXT COLOR RULES:
- Dark backgrounds: text-white, text-gray-100
- Light backgrounds: text-gray-900, text-gray-800
- Use accent colors for highlights
- Ensure high contrast

IMAGE REQUIREMENTS (CRITICAL):
- ALWAYS include relevant images in slides
- Use ImageKit: https://ik.imagekit.io/ikmedia/ik-genimg-prompt-DESCRIPTION/image.jpg
- Replace DESCRIPTION with relevant keywords (spaces = %20)
- Examples:
  * Business: https://ik.imagekit.io/ikmedia/ik-genimg-prompt-business%20presentation/slide.jpg
  * Technology: https://ik.imagekit.io/ikmedia/ik-genimg-prompt-modern%20technology/tech.jpg
  * Team: https://ik.imagekit.io/ikmedia/ik-genimg-prompt-professional%20team/team.jpg
- Add transformations: ?tr=w-600,h-400,fo-auto,q-80
- Image HTML: <img src="URL" class="rounded-lg object-cover" style="max-width: 100%; max-height: 350px;" alt="description">
- Place images in appropriate layout positions

LAYOUT WITH IMAGES:
- Title slides: Optional decorative image
- Content slides: MUST have image (60% text, 40% image in grid)
- List slides: Optional icon or small image
- Data slides: Charts or infographic images

Generate the slide now - MUST match style AND include images:`

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

    // Get slide count (no need to verify - AI optimizes structure)
    const actualSlides = projectDetail.outline.length;

    // Starting slide generation

    // Show immediate feedback
    showToast.info("Generating Slides", `Creating ${actualSlides} beautiful slides for you...`);

    // Initialize sliders array and progress
    setSliders(new Array(actualSlides).fill(null));
    setGenerationProgress({ current: 0, total: actualSlides });
    
    try {
      for (let index = 0; index < projectDetail.outline.length; index++) {
        const slideData = projectDetail.outline[index];
        
        // Generate professional prompt with all placeholders
        const colors = projectDetail?.designStyle?.colors || {};
        const metadata = {
          slideNumber: index + 1,
          totalSlides: projectDetail.outline.length,
          title: slideData.slidePoint || `Slide ${index + 1}`,
          content: slideData.outline || '',
          style: projectDetail?.designStyle?.styleName || "Professional"
        };
        
        const prompt = SLIDER_PROMPT
          .replace("{DESIGN_STYLE}", projectDetail?.designStyle?.styleName || "Professional")
          .replace("{COLORS_CODE}", JSON.stringify(colors))
          .replace("{METADATA}", JSON.stringify(metadata));

        setGenerationProgress({ current: index + 1, total: projectDetail.outline.length });
        await GeminiSlideCall(prompt, index);
      }

      // All slides generated successfully
      setIsSlidesGenerated(Date.now());
      
      // Show success message
      showToast.success("Slides Generated!", `Successfully created ${actualSlides} beautiful slides`);
      
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
                  .trim();

                // Live update the slider
                setSliders((prev) => {
                  const updated = prev ? [...prev] : [];
                  updated[index] = { code: finalText };
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
      
      // Create a proper fallback slide with actual content
      const slideData = projectDetail?.outline?.[index];
      const colors = projectDetail?.designStyle?.colors || {};
      const fallbackSlide = `
        <div class="w-[1280px] h-[720px] p-16 flex flex-col justify-center items-center text-center" style="background: ${colors.background || '#1a1a2e'}; color: white;">
          <h1 class="text-6xl font-bold mb-6">${slideData?.slidePoint || `Slide ${index + 1}`}</h1>
          <div class="text-2xl max-w-3xl mb-8 leading-relaxed">
            ${slideData?.outline || 'Content is being generated...'}
          </div>
          <div class="text-lg text-gray-300 mt-4">
            <p>Slide ${index + 1} of ${projectDetail?.outline?.length || 1}</p>
          </div>
        </div>
      `;
      
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
                {/* Slides  */}
                {!sliders || sliders.length === 0 ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                      <Loader2 className="h-12 w-12 animate-spin text-[#A855F7] mx-auto mb-4" />
                      <p className="text-[#C4B5FD] text-lg font-semibold mb-2">Creating your beautiful slides...</p>
                      {generationProgress.total > 0 && (
                        <>
                          <div className="w-full bg-[#1F0E3A] rounded-full h-2 mb-2">
                            <div 
                              className="bg-gradient-to-r from-[#A855F7] to-[#EC4899] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                            />
                          </div>
                          <p className="text-[#8B7AB8] text-sm">
                            Slide {generationProgress.current} of {generationProgress.total}
                          </p>
                        </>
                      )}
                      <p className="text-[#8B7AB8] text-sm mt-2">This usually takes less than a minute</p>
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
