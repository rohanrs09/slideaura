import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group";
import { ArrowUp, Loader2Icon } from "lucide-react";
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
    await setDoc(doc(firebaseDb, "projects", projectId), {
      projectId: projectId,
      userInputPrompt: userInput,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      createdAt: Date.now(),
      noOfSlides: noOfSlides,
    });
    setLoading(false);
    navigate("/workspace/project/" + projectId + "/outline");
  };

  return (
    <div className="w-full flex items-center justify-center mt-28 ">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="font-bold text-4xl">
          Describe your topic, we’ll design the{" "}
          <span className="text-primary ">PPT</span> slides!
        </h2>
        <p className="text-xl text-gray-500">
          Your design will be saved as new project
        </p>
        <InputGroup>
          <InputGroupTextarea
            placeholder="Enter what kind of slider do you what to create ?"
            className="min-h-36"
            onChange={(event) => setUserInput(event.target.value)}
          ></InputGroupTextarea>
          <InputGroupAddon align={"block-end"}>
            {/* <InputGroupButton>
      <PlusIcon />
      </InputGroupButton> */}
            <Select onValueChange={(value) => setNoOfSlides(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select No of Slider" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>No of Slider </SelectLabel>
                  <SelectItem value="4 to 6">4-6 Slider</SelectItem>
                  <SelectItem value="6 to 8">6-8 Slider</SelectItem>
                  <SelectItem value="8 to 12">8-12 Slider</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <InputGroupButton
              variant={"default"}
              className="rounded-full ml-auto"
              size={"icon-sm"}
              onClick={() => CreateAndSaveProject()}
              disabled={!userInput}
            >
              {loading ? <Loader2Icon className="animate-spin" /> : <ArrowUp />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}

export default PromptBox;
