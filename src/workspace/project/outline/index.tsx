import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firebaseDb, GeminiAiModel } from "../../../../config/FirebaseConfig";
import SlidersStyle, { type DesignStyle } from "@/components/custom/SlidersStyle";
import OutlineSection from "@/components/custom/OutlineSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2Icon } from "lucide-react";
import { set } from "date-fns";

const OUTLINE_PROMPT = `
Generate a PowerPoint slide outline for the topic {userInput}". Create {noOfSliders} slides in total. Each slide should include a topic name and a 2-line descriptive outline that clearly explains what content the slide will cover.
Include the following structure:
The first slide should be a Welcome screen.
The second slide should be an Agenda screen.
The final slide should be a Thank You screen.
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
};

export type Outline = {
  slideNo: string;
  slidePoint: string;
  outline: string;
};

function Outline() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [updateDbloading, setUpdateDbLoading] = useState(false);
  const [outline, setOutline] = useState<Outline[]>(DUMMY_OUTLINE); 
  const [selectedStyle,setSelectedStyle]=useState<DesignStyle>();

  useEffect(() => {
    if (projectId) {
      GetProjectDetail();
    }
  }, [projectId]);

  const GetProjectDetail = async () => {
    const docRef = doc(firebaseDb, "projects", projectId ?? "");
    const docSnap: any = await getDoc(docRef);

    if (!docSnap.exists()) {
      return;
    }
    console.log("project detail", docSnap.data());
    setProjectDetail(docSnap.data());
    if (!docSnap.data().outline) {
      GenerateSlidersOutline(docSnap.data());
    }
  };

  const GenerateSlidersOutline = async (projectData: Project) => {
    setLoading(true);
    const prompt = OUTLINE_PROMPT.replace(
      "{userInput}",
      projectData?.userInputPrompt
    ).replace("{noOfSliders}", projectData?.noOfSlides);
    const result = await GeminiAiModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);
    const rawJson = text.replace("```json", "").replace("```", "");
    const JSONData = JSON.parse(rawJson);
    setOutline(JSONData);
    setLoading(false);
  };

  const handleUpdateOutline = (index: string, value: Outline) => {
    setOutline((prev) =>
      prev.map((item) =>
        item.slideNo === index ? { ...item, ...value } : item
      )
    );
  };

  const onGenerateSlider = async () => {
  // database update 
  setUpdateDbLoading(true);
  await setDoc(doc(firebaseDb, 'projects', projectId ?? ''), {
    designStyle: selectedStyle,
    outline: outline
  }, {
    merge: true
  });
  setUpdateDbLoading(false);

  //navigate to slider editor page
  


};


  return (
    <div className="flex justify-center">
      <div className="max-w-3xl w-full">
        <h2 className="font-bold text-2xl">Setting and Slider Outline </h2>
        <SlidersStyle selectStyle={(value:DesignStyle)=>setSelectedStyle(value)} />
        <OutlineSection
          loading={loading}
          outline={outline || []}
          handleUpdateOutline={(index: string, value: Outline) =>
            handleUpdateOutline(index, value)
          }
        />
      </div>
      <Button size={'lg'} className='fixed bottom-6 transform left-1/2 -translate-x-1/2 ' 
      onClick={onGenerateSlider}
      disabled={updateDbloading || loading}
      >
      {updateDbloading && <Loader2Icon className="animate-spin"/>}
              Generate Slider <ArrowRight />
          </Button>
    </div>
  );
}

export default Outline;
