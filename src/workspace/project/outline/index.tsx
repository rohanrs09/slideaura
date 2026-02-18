import { doc, getDoc, setDoc} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { firebaseDb, GeminiAiModel } from "../../../../config/FirebaseConfig";
import SlidersStyle from "@/components/custom/SlidersStyle";
import OutlineSection from "@/components/custom/OutlineSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2Icon } from "lucide-react";
import { UserDetailContext } from "../../../../context/UserDetailContext";
import { useContext } from "react";
import CreditLimitDialog from "@/components/custom/CreditLimitDialog";
import { useAuth } from "@clerk/clerk-react";

const OUTLINE_PROMPT = `
Generate a PowerPoint slide outline for the topic {userInput}". Create exactly {noOfSlides} slides in total. Each slide should include a topic name and a 2-line descriptive outline that clearly explains what content the slide will cover.
Include the following structure:
The first slide should be a Welcome screen.
The second slide should be an Agenda screen.
The final slide should be a Thank You screen.
IMPORTANT: Generate exactly {noOfSlides} slides - no more, no less.
Return the response only in JSON format, following this schema:
[
 {
 "slideNo": "",
 "slidePoint": "",
 "outline": ""
 }
] `;

const DUMMY_OUTLINE = [
  {
    slideNo: "Slide 1",
    slidePoint: "Welcome to the GI System Overview",
    outline:
      "Welcome attendees to the presentation on the Gastrointestinal (GI) System.\nSet the stage for an engaging exploration of this vital bodily system.",
  },
  {
    slideNo: "Slide 2",
    slidePoint: "Today's Journey Through the GI Tract",
    outline:
      "Present an overview of the topics to be covered in the presentation.\nOutline the key learning objectives and what attendees can expect.",
  },
  {
    slideNo: "Slide 3",
    slidePoint: "The Gastrointestinal System: An Introduction",
    outline:
      "Define the Gastrointestinal (GI) tract and its primary components.\nExplain its fundamental role in digestion, nutrient absorption, and waste elimination.",
  },
  {
    slideNo: "Slide 4",
    slidePoint: "Major Players: Organs and Their Functions",
    outline:
      "Explore the main organs comprising the GI system (e.g., esophagus, stomach, small/large intestine).\nDetail the specific functions each organ performs in the complex digestive process.",
  },
  {
    slideNo: "Slide 5",
    slidePoint: "Common GI Conditions & Maintaining Health",
    outline:
      "Briefly touch upon some common gastrointestinal conditions and their general characteristics.\nProvide practical tips and emphasize the importance of maintaining good digestive health.",
  },
  {
    slideNo: "Slide 6",
    slidePoint: "Thank You & Questions",
    outline:
      "Express gratitude to the audience for their attendance and attention.\nOpen the floor for questions and provide contact information for further inquiries.",
  },
];

export type Project = {
  projectId: string;
  userInputPrompt: string;
  createdAt: string;
  noOfSlides: string;
  outline: Outline[];
  designStyle: DesignStyle;
  slides: any[];
};

export type Outline = {
  slideNo: string;
  slidePoint: string;
  outline: string;
};

export type DesignStyle = {
  colors: any;
  designGuide: string;
  styleName: string;
};

function Outline() {
  const { projectId } = useParams();
  const { has } = useAuth();
  const hasUnlimitedAccess = has && has({ plan: 'unlimited' });
  const [, setProjectDetail] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [updateDbloading, setUpdateDbLoading] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [outline, setOutline] = useState<Outline[]>(DUMMY_OUTLINE);
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>();
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    if (projectId) {
      GetProjectDetail();
    }
  }, [projectId]);

  const GetProjectDetail = async () => {
    try {
      const docRef = doc(firebaseDb, "projects", projectId ?? "");
      const docSnap: any = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error("❌ Project not found");
        return;
      }
      
      const projectData = docSnap.data();
      console.log("📦 Project detail:", projectData);
      setProjectDetail(projectData);
      
      // Load existing outline if available
      if (projectData.outline && projectData.outline.length > 0) {
        console.log("✅ Loading existing outline");
        setOutline(projectData.outline);
      } else {
        console.log("🔄 Generating new outline");
        GenerateSlidersOutline(projectData);
      }
      
      // Load existing design style if available
      if (projectData.designStyle) {
        console.log("✅ Loading existing design style");
        setSelectedStyle(projectData.designStyle);
      }
    } catch (error) {
      console.error("❌ Error loading project:", error);
    }
  };

  const GenerateSlidersOutline = async (projectData: Project) => {
    setLoading(true);
    try {
      const prompt = OUTLINE_PROMPT.replace(
        "{userInput}",
        projectData?.userInputPrompt
      ).replace("{noOfSlides}", projectData?.noOfSlides);
      const result = await GeminiAiModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log(text);
      
      // Clean and parse JSON
      const rawJson = text.replace("```json", "").replace("```", "").trim();
      
      if (!rawJson) {
        throw new Error("Empty response from AI");
      }
      
      const JSONData = JSON.parse(rawJson);
      
      // Validate the parsed data
      if (!Array.isArray(JSONData) || JSONData.length === 0) {
        throw new Error("Invalid outline format");
      }
      
      setOutline(JSONData);
    } catch (err) {
      console.error("❌ Error generating outline:", err);
      
      // Fallback to dummy outline if generation fails
      console.log("🔄 Using fallback outline");
      setOutline(DUMMY_OUTLINE);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOutline = (index: string, value: Outline) => {
    setOutline((prev) =>
      prev.map((item) =>
        item.slideNo === index ? { ...item, ...value } : item
      )
    );
  };

  const onGenerateSlider = async () => {
    console.log(userDetail?.credits);
    
    // Check if style is selected
    if (!selectedStyle) {
      alert("Please select a design style for your slides");
      return;
    }
    
    if (userDetail?.credits <= 0 && !hasUnlimitedAccess) {
      //alert dialog
      setOpenAlert(true);
      return;
    }

    // database update
    setUpdateDbLoading(true);
    console.log("💾 Saving outline and design style...");
    
    try {
      await setDoc(
        doc(firebaseDb, "projects", projectId ?? ""),
        {
          designStyle: selectedStyle,
          outline: outline,
        },
        {
          merge: true,
        }
      );
      console.log("✅ Saved successfully");

      // Update user credits if not unlimited
      if(!hasUnlimitedAccess) {
        await setDoc(
          doc(firebaseDb, "users", userDetail?.email ?? ""),
          {
            credits: userDetail?.credits - 1,
          },
          {
            merge: true,
          }
        );
        
        setUserDetail((prev: any) => ({
          ...prev,
          credits: userDetail?.credits - 1,
        }));
      }

      //navigate to slider editor page
      navigate(`/workspace/project/${projectId}/editor`);
    } catch (error) {
      console.error("❌ Error saving project:", error);
      alert("Failed to save project. Please try again.");
    } finally {
      setUpdateDbLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0118] relative overflow-hidden">
      {/* Organic Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-green-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0118] via-transparent to-[#150828] opacity-50" />
      </div>
      
      {/* Flowing SVG Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="organic" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M0,100 Q50,50 100,100 T200,100" stroke="rgba(168,85,247,0.3)" fill="none" strokeWidth="1"/>
              <path d="M0,150 Q100,100 200,150" stroke="rgba(236,72,153,0.3)" fill="none" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#organic)" />
        </svg>
      </div>
      
      <div className="relative z-10">
        {/* Organic Header */}
        <div className="bg-gradient-to-b from-[#150828]/80 to-transparent backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#A855F7] via-[#EC4899] to-[#A855F7] rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <svg width="32" height="26" viewBox="0 0 32 26" fill="none">
                      <path d="M4 13L12 21L28 5" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#A855F7] to-[#EC4899] rounded-full blur-lg opacity-50 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-[#F5F3FF] to-[#EC4899] bg-clip-text text-transparent mb-3">
                    Create Your Presentation
                  </h1>
                  <p className="text-[#C4B5FD] text-xl">Choose a design style and customize your slide outline</p>
                </div>
              </div>
              
              {/* Organic Progress Indicator */}
              <div className="relative">
                <div className="flex items-center gap-2 bg-[#0A0118]/60 backdrop-blur-xl px-8 py-4 rounded-full border border-[#A855F7]/30">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#A855F7] to-[#EC4899] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div className="w-2 h-2 bg-[#A855F7]/50 rounded-full" />
                    <div className="w-12 h-12 bg-gradient-to-br from-[#A855F7] to-[#EC4899] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div className="w-2 h-2 bg-[#A855F7]/30 rounded-full" />
                    <div className="w-12 h-12 bg-[#A855F7]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#8B7AB8] font-bold">3</span>
                    </div>
                  </div>
                  <div className="text-left ml-4">
                    <p className="text-xs text-[#8B7AB8] uppercase tracking-wider">Step 2 of 3</p>
                    <p className="text-sm font-medium text-[#F5F3FF]">Design & Outline</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organic Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left: Design Style Selection */}
            <div className="lg:col-span-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7]/20 to-[#EC4899]/20 rounded-3xl blur-xl" />
                <div className="relative bg-[#150828]/60 backdrop-blur-xl border border-[#A855F7]/20 rounded-3xl p-10">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#A855F7] via-[#EC4899] to-[#A855F7] rounded-full flex items-center justify-center shadow-2xl">
                        <span className="text-white font-bold text-xl">1</span>
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#A855F7] to-[#EC4899] rounded-full blur-lg opacity-30" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-3">Choose Design Style</h2>
                      <p className="text-[#8B7AB8] text-lg">Select a professional template for your slides</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <SlidersStyle
                      selectStyle={(value: DesignStyle) => setSelectedStyle(value)}
                    />
                    
                    {selectedStyle && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#A855F7]/30 to-[#EC4899]/30 rounded-2xl blur" />
                        <div className="relative border border-[#A855F7]/40 rounded-2xl p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#A855F7] to-[#EC4899] rounded-full flex items-center justify-center shadow-lg">
                              <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                                <path d="M3 9L7 13L17 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div>
                              <p className="text-base font-semibold text-white">Style Selected</p>
                              <p className="text-sm text-[#C4B5FD]">{selectedStyle.styleName}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Outline */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/20 to-[#A855F7]/20 rounded-3xl blur-xl" />
                <div className="relative bg-[#150828]/60 backdrop-blur-xl border border-[#A855F7]/20 rounded-3xl p-10">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#A855F7] via-[#EC4899] to-[#A855F7] rounded-full flex items-center justify-center shadow-2xl">
                        <span className="text-white font-bold text-xl">2</span>
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#A855F7] to-[#EC4899] rounded-full blur-lg opacity-30" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-3">Review Slide Outline</h2>
                      <p className="text-[#8B7AB8] text-lg">Edit or regenerate your presentation structure</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <OutlineSection
                      loading={loading}
                      outline={outline || []}
                      handleUpdateOutline={(index: string, value: Outline) =>
                        handleUpdateOutline(index, value)
                      }
                      editable={true}
                    />
                    
                    {outline.length > 0 && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#A855F7]/20 to-[#EC4899]/20 rounded-2xl blur" />
                        <div className="relative bg-[#0A0118]/50 backdrop-blur-sm border border-[#A855F7]/20 rounded-2xl p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#A855F7]/30 to-[#EC4899]/30 rounded-full flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 2L15 7L20 8L16 12L17 17L12 15L7 17L8 12L4 8L9 7L12 2Z" fill="#A855F7"/>
                                </svg>
                              </div>
                              <p className="text-lg text-[#F5F3FF] font-semibold">
                                {outline.length} slides ready
                              </p>
                            </div>
                            <div className="text-sm text-[#8B7AB8]">
                              {outline.length === 1 ? 'slide' : 'slides'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0118] via-[#0A0118]/95 to-transparent pointer-events-none" />
          <div className="relative flex justify-center pb-8 pt-16">
            <div className="relative max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-[#A855F7]/20 to-[#EC4899]/20 rounded-full blur-xl" />
              <div className="relative bg-[#150828]/80 backdrop-blur-xl border border-[#A855F7]/30 rounded-full p-6">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#A855F7] to-[#EC4899] rounded-full flex items-center justify-center shadow-lg">
                      <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                        <path d="M2 8L7 13L18 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Generate Slides</p>
                      <p className="text-xs text-[#C4B5FD]">
                        {selectedStyle ? selectedStyle.styleName : "Select style first"}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:from-[#9333EA] hover:to-[#DB2777] text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                    onClick={onGenerateSlider}
                    disabled={updateDbloading || loading || !selectedStyle}
                  >
                    {updateDbloading ? (
                      <>
                        <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                        Generating
                      </>
                    ) : !selectedStyle ? (
                      "Select Style"
                    ) : (
                      <>
                        Generate
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CreditLimitDialog openAlert={openAlert} setOpenAlert={setOpenAlert} />
    </div>
  );
}

export default Outline;
