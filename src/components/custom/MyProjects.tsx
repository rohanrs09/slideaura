import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowRight, FolderIcon } from "lucide-react";
import type { Project } from "@/workspace/project/outline";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firebaseDb } from "../../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-react";
import moment from 'moment';
import PPT_ICON from "../../../src/assets/ppt.png";
import { Link } from "react-router-dom";

function MyProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      GetProjects();
    }
  }, [user]);

  const GetProjects = async () => {
    const q = query(
      collection(firebaseDb, "projects"),
      where("createdBy", "==", user?.primaryEmailAddress?.emailAddress ?? "")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setProjects((prev: any) => [...prev, doc.data()]);
    });
  };

  const FormatDate=(timestamp:any) =>{
    const formateDate=moment(timestamp).fromNow();
    return formateDate;


  }

  return (
    <div className="mx-32 mt-20">
  <div className="flex items-center justify-between">
    <h2 className="font-bold text-2xl">My Projects</h2>
    <Button>+ Create New Project</Button>
  </div>
  <div>
    {!projects?.length ? (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderIcon />
          </EmptyMedia>
          <EmptyTitle>No Projects Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any projects yet. Get started by
            creating your first project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button>Create Project</Button>
            {/* <Button variant="outline">Import Project</Button> */}
          </div>
        </EmptyContent>
        <Button
          variant="link"
          asChild
          className="text-muted-foreground"
          size="sm"
        >
          <a href="#">
            Learn More <ArrowRight />
          </a>
        </Button>
      </Empty>
    ) : (
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 p-4">
        {projects.map((project, index) => (
          <Link to={"/workspace/project/" + project.projectId + "/editor"} key={index}>
            <div
              className="p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white"
            >
              <img
                src={PPT_ICON}
                width={50}
                height={50}
                alt="PPT Icon"
                className="mb-3 mx-auto"
              />

              <h2 className="font-semibold text-gray-800 text-center truncate">
                {project?.userInputPrompt || "Untitled Project"}
              </h2>

              <p className="text-sm text-gray-600 text-center mt-1">
                Total{" "}
                <span className="font-medium">{project?.slides?.length}</span>{" "}
                Slides
              </p>

              <p className="text-xs text-gray-400 text-center mt-2">
                {FormatDate(project?.createdAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
</div>

  );
}

export default MyProjects;
