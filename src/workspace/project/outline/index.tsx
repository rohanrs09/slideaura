import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firebaseDb } from "../../../../config/FirebaseConfig";
import SlidersStyle from "@/components/custom/SlidersStyle";

type Project = {
  projectId: string;
  userInputPrompt: string;
  createdAt: string;
};

function Outline() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project | null>();

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
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-3xl w-full">
        <h2 className="font-bold text-2xl">Setting and Slider Outline </h2>
        <SlidersStyle />
      </div>
    </div>
  );
}

export default Outline;
