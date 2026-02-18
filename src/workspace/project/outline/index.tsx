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
    <div className="flex justify-center px-6 py-8 relative bg-[#0A0118]">
      <div className="max-w-3xl w-full relative z-10">
        <div className="mb-6">
          <h2 className="font-heading font-bold text-2xl text-[#F5F3FF]">Settings & Outline</h2>
          <p className="text-sm text-[#C4B5FD] mt-1">Choose a style and review your slide outline</p>
        </div>
        <SlidersStyle
          selectStyle={(value: DesignStyle) => setSelectedStyle(value)}
        />
        <OutlineSection
          loading={loading}
          outline={outline || []}
          handleUpdateOutline={(index: string, value: Outline) =>
            handleUpdateOutline(index, value)
          }
        />
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0118] via-[#0A0118]/95 to-transparent pointer-events-none" />
        <div className="relative flex justify-center pb-6 pt-12">
          <Button
            variant="cta"
            size={"lg"}
            className="gap-2 px-8 shadow-[0_0_32px_-8px_rgba(168,85,247,0.5)]"
            onClick={onGenerateSlider}
            disabled={updateDbloading || loading || !selectedStyle}
          >
            {updateDbloading && <Loader2Icon className="animate-spin h-4 w-4" />}
            {!selectedStyle ? "Select a Style First" : "Generate Slides"} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CreditLimitDialog openAlert={openAlert} setOpenAlert={setOpenAlert} />
    </div>
  );
}

export default Outline;
