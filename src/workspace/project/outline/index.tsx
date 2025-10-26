
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firebaseDb } from "../../../../config/FirebaseConfig";


type Project = {
  projectId: string;
  userInputPrompt: string;
  createdAt: string;
};

function Outline() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project | null>();

  useEffect(()=>{
    projectId && GetProjectDetail()
  },[projectId])

  const GetProjectDetail = async () => {
    const docRef = doc(firebaseDb, "projects", projectId ?? "");
    const docSnap: any = await getDoc(docRef);

    if (!docSnap.exists()) {
      return;
    }
    console.log("project detail", docSnap.data());
    setProjectDetail(docSnap.data());
  };

  return <div>Outline</div>;
}

export default Outline;
