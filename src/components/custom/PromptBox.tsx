import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group";
import { ArrowUp, Loader2Icon, Layers } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectLabel,
} from "../ui/select";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { firebaseDb } from "../../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function PromptBox() {
  const [userInput, setUserInput] = useState<string>();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [noOfSlides, setNoOfSlides] = useState<string>("4 to 6");
  const navigate = useNavigate();

  const CreateAndSaveProject = async () => {
    //save project to database
    const projectId = uuidv4();
    setLoading(true);
    try {
      await setDoc(doc(firebaseDb, "projects", projectId), {
        projectId: projectId,
        userInputPrompt: userInput,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: Date.now(),
        noOfSlides: noOfSlides,
      });
      console.log("✅ Project saved successfully:", projectId);
      navigate("/workspace/project/" + projectId + "/outline");
    } catch (error) {
      console.error("❌ Error saving project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex items-center justify-center mt-20 px-6"
    >
      <div className="flex flex-col items-center justify-center space-y-5 max-w-3xl w-full">
        <div className="text-center space-y-3">
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-[#fafafa]">
            What will you <span className="bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f59e0b] bg-clip-text text-transparent">present</span> today?
          </h2>
          <p className="text-base text-[#a0a0a0]">
            Describe your topic and we'll craft the slides
          </p>
        </div>

        <div className="w-full relative group">
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-[#8b5cf6]/30 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute -inset-4 bg-[#8b5cf6]/[0.08] rounded-full blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative bg-[#1a1a1a] border border-[#8b5cf6]/20 rounded-3xl overflow-hidden">
            <InputGroup>
              <InputGroupTextarea
                placeholder="e.g. A startup pitch deck for an AI photo editing tool..."
                className="min-h-32 bg-transparent border-0 text-[#fafafa] placeholder:text-[#a0a0a0] text-base resize-none focus:ring-0 focus:outline-none px-5 pt-5 rounded-3xl"
                onChange={(event) => setUserInput(event.target.value)}
              ></InputGroupTextarea>
              <InputGroupAddon align={"block-end"}>
                <div className="flex items-center gap-2 px-4 pb-4">
                  <Layers className="h-4 w-4 text-[#a0a0a0] rounded-full" />
                  <Select onValueChange={(value) => setNoOfSlides(value)}>
                    <SelectTrigger className="w-[160px] h-9 bg-[#2a2a2a] border-[#8b5cf6]/20 text-[#a0a0a0] text-xs rounded-full hover:bg-[#3a3a3a] transition-colors">
                      <SelectValue placeholder="Slide count" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2a2a] border-[#8b5cf6]/20 rounded-2xl">
                      <SelectGroup>
                        <SelectLabel className="text-[#a0a0a0] text-xs rounded-t-2xl">Slides</SelectLabel>
                        <SelectItem value="4 to 6" className="text-[#fafafa] focus:bg-white/[0.06] focus:text-[#fafafa] rounded-lg">4–6 Slides</SelectItem>
                        <SelectItem value="6 to 8" className="text-[#fafafa] focus:bg-white/[0.06] focus:text-[#fafafa] rounded-lg">6–8 Slides</SelectItem>
                        <SelectItem value="8 to 12" className="text-[#fafafa] focus:bg-white/[0.06] focus:text-[#fafafa] rounded-lg">8–12 Slides</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="flex-1" />
                  <InputGroupButton
                    variant={"default"}
                    className="rounded-full ml-auto h-9 w-9 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:opacity-90 shadow-[0_0_20px_-4px_rgba(139,92,246,0.5)] transition-all duration-200"
                    size={"icon-sm"}
                    onClick={() => CreateAndSaveProject()}
                    disabled={!userInput}
                  >
                    {loading ? <Loader2Icon className="animate-spin h-4 w-4 text-white rounded-full" /> : <ArrowUp className="h-4 w-4 text-white rounded-full" />}
                  </InputGroupButton>
                </div>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        <p className="text-xs text-[#8B7AB8] font-mono">
          Press Enter to generate · AI will create outline first
        </p>
      </div>
    </motion.div>
  );
}

export default PromptBox;
