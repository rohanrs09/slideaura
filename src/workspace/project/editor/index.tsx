import OutlineSection from "@/components/custom/OutlineSection";
import {
  firebaseDb,
  GeminiAiLiveModel,
} from "../../../../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { Project } from "../outline";
import SliderFrame from "@/components/custom/SliderFrame";
import * as htmlToImage from "html-to-image";
import PptxGenJS from "pptxgenjs";
import { FileDown, InfoIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
const SLIDER_PROMPT = `Generate HTML (TailwindCSS + Flowbite UI + Lucide Icons) 
code for a 16:9 ppt slider in Modern Dark style.
{DESIGN_STYLE}. No responsive design; use a fixed 16:9 layout for slides.
Use Flowbite component structure. Use different layouts depending on content and style.
Use TailwindCSS colors like primary, accent, gradients, background, etc., and include colors from {COLORS_CODE}.
MetaData for Slider: {METADATA}

- Ensure images are optimized to fit within their container div and do not overflow.
- Use proper width/height constraints on images so they scale down if needed to remain inside the slide.
- Maintain 16:9 aspect ratio for all slides and all media.
- Use CSS classes like 'object-cover' or 'object-contain' for images to prevent stretching or overflow.
- Use grid or flex layouts to properly divide the slide so elements do not overlap.

Generate Image if needed using:
'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg'
Replace {imagePrompt} with relevant image prompt and altImageName with a random image name.  

<!-- Slide Content Wrapper (Fixed 16:9 Aspect Ratio) -->
<div class="w-[800px] h-[500px] relative overflow-hidden">
  <!-- Slide content here -->
</div>
Also do not add any overlay : Avoid this :
    <div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20"></div>


Just provide body content for 1 slider. Make sure all content, including images, stays within the main slide div and preserves the 16:9 ratio.`;

// const DUMMY_SLIDER = ` <!-- Slide Content Wrapper (Fixed 16:9 Aspect Ratio) -->
//     <div class="w-[800px] h-[500px] relative bg-[#0D0D0D] text-white overflow-hidden">
//         <!-- Background Gradient Overlay -->
//         <div class="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] to-[#1F1F1F] opacity-70"></div>

//         <!-- Grid Layout for Content -->
//         <div class="grid grid-cols-2 grid-rows-2 h-full relative z-10">

//             <!-- Left Top - Title & Outline -->
//             <div class="col-span-1 row-span-1 p-8 flex flex-col justify-start items-start">
//                 <h1 class="text-4xl font-serif font-bold text-accent mb-4">
//                     Welcome to Kravix Studio: The Future of Film
//                 </h1>
//                 <p class="text-sm text-gray-300 leading-relaxed">
//                     Welcome to our investor pitch for [App Name], an innovative AI Short Film Generator.<br>
//                     We are revolutionizing content creation, making filmmaking accessible to everyone.
//                 </p>
//             </div>

//             <!-- Right Top - Image/Visual -->
//             <div class="col-span-1 row-span-1 p-4 flex justify-end items-start">
//                 <img src="https://ik.imagekit.io/ikmedia/ik-genimg-prompt-futuristic%20film%20studio%20interior%20black%20gold%20accents/filmStudioAesthetic.jpg" alt="filmStudioAesthetic" class="rounded-lg shadow-lg w-full h-auto object-cover max-h-[200px]">
//             </div>

//             <!-- Left Bottom - Call to Action/Key Benefit -->
//             <div class="col-span-1 row-span-1 p-8 flex flex-col justify-end items-start">
//                 <div class="bg-[#1F1F1F] bg-opacity-60 backdrop-blur-md rounded-lg p-6">
//                     <h2 class="text-2xl font-serif font-semibold mb-2">
//                         Unleash Your Creative Vision
//                     </h2>
//                     <p class="text-gray-200 text-sm leading-relaxed">
//                         Transform ideas into stunning short films with the power of AI. No experience needed.
//                     </p>
//                 </div>
//             </div>

//             <!-- Right Bottom - Slide Number & Subtle Element -->
//             <div class="col-span-1 row-span-1 p-8 flex justify-end items-end">
//                  <div class="flex items-center space-x-2">
//                         <span class="text-gray-400 text-xs font-medium">Slide</span>
//                         <span class="text-accent font-bold text-xl">1</span>
//                     </div>

//             </div>

//             <!-- Subtle Lighting Effect (Optional) -->
//             <div class="absolute inset-0 pointer-events-none">
//                 <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-accent rounded-full blur-3xl opacity-10"></div>
//                 <div class="absolute bottom-1/4 right-1/4 w-24 h-24 bg-primary rounded-full blur-2xl opacity-10"></div>
//             </div>
//         </div>
//     </div>`

function Editor() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project>();
  const [loading, setLoading] = useState(false);
  const [sliders, setSliders] = useState<any>([]);
  const [isSlidesGenerated, setIsSlidesGenerated] = useState<any>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      GetProjectDetail();
    }
  }, [projectId]);

  const GetProjectDetail = async () => {
    setLoading(true);
    const docRef = doc(firebaseDb, "projects", projectId ?? "");
    const docSnap: any = await getDoc(docRef);
    if (!docSnap.exists()) {
      return;
    }
    console.log(JSON.stringify(docSnap.data()));
    setProjectDetail(docSnap.data());
    setLoading(false);
  };

  useEffect(() => {
    if (projectDetail && !projectDetail?.slides?.length) {
      GenerateSlides();
    } else {
      setSliders(projectDetail?.slides);
    }
  }, [projectDetail]);

  const GenerateSlides = async () => {
    if (!projectDetail?.outline || projectDetail.outline.length === 0) return;

    console.log("🚀 Starting slide generation...");

    // Optional: initialize sliders to empty states
    // setSliders(projectDetail.outline.map(() => ({ code: "" })));

    for (
      let index = 0;
      index < projectDetail.outline.length && index < 5;
      index++
    ) {
      const metaData = projectDetail.outline[index];
      const prompt = SLIDER_PROMPT.replace(
        "{DESIGN_STYLE}",
        projectDetail?.designStyle?.designGuide ?? ""
      )
        .replace(
          "{COLORS_CODE}",
          JSON.stringify(projectDetail?.designStyle?.colors)
        )
        .replace("{METADATA}", JSON.stringify(metaData));

      console.log("🧠 Generating slide", index + 1);
      await GeminiSlideCall(prompt, index); // wait for one slide to finish before next
      console.log("✅ Finished slide", index + 1);
    }

    console.log("🎉 All slides generated!");

    setIsSlidesGenerated(Date.now());
  };

  const GeminiSlideCall = async (prompt: string, index: number) => {
    try {
      const session = await GeminiAiLiveModel.connect();
      await session.send(prompt);

      let text = "";

      // Read stream
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
            setSliders((prev: any[]) => {
              const updated = prev ? [...prev] : [];
              updated[index] = { code: finalText };
              return updated;
            });
          }

          if (message.turnComplete) {
            console.log("✅ Slide", index + 1, "complete");
            break; // important: exit loop when done
          }
        }
      }

      session.close();
    } catch (err) {
      console.error("❌ Error generating slide", index + 1, err);
    }
  };

  useEffect(() => {
    if (isSlidesGenerated) SaveAllSlides();
  }, [isSlidesGenerated]);

  const SaveAllSlides = async () => {
    await setDoc(
      doc(firebaseDb, "projects", projectId ?? ""),
      {
        slides: sliders,
      },
      {
        merge: true,
      }
    );
  };

  const updateSliderCode = (updateSlideCode: string, index: number) => {
    setSliders((prev: any) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        code: updateSlideCode,
      };
      return updated;
    });
    setIsSlidesGenerated(Date.now());
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

      console.log(`Exporting slide ${i + 1}...`);
      //@ts-ignore
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
    <div>
      <div className="flex items-center justify-center mt-4">
        <Alert variant="destructive" className="max-w-lg">
          <InfoIcon />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            This is Application Demo, Maximum 4 Slider can generator for demo
          </AlertDescription>
        </Alert>
      </div>
      <div className="grid grid-cols-5 p-10 gap-10 ">
        <div className="col-span-2 h-[90vh] overflow-auto ">
          {/* Outlines  */}
          <OutlineSection
            outline={projectDetail?.outline ?? []}
            handleUpdateOutline={() => console.log()}
            loading={loading}
            editable={false}
          />
        </div>
        <div className="col-span-3 h-screen overflow-auto" ref={containerRef}>
          {/* Slides  */}
          {sliders?.map((slide: any, index: number) => (
            <SliderFrame
              slide={slide}
              key={index}
              colors={projectDetail?.designStyle?.colors}
              setUpdateSlider={(updateSlideCode: string) =>
                updateSliderCode(updateSlideCode, index)
              }
            />
          ))}
        </div>
        {/* Export button */}
        <Button
          onClick={exportAllIframesToPPT}
          size={"lg"}
          className="fixed bottom-6
            transform left-1/2 -translate-x-1/2"
          disabled={downloadLoading}
        >
          {downloadLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <FileDown />
          )}{" "}
          Export PPT
        </Button>
      </div>
    </div>
  );
}

export default Editor;
