import  { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowRight, FolderIcon, Presentation, Clock, Layers, Loader2 } from "lucide-react";
import type { Project } from "@/workspace/project/outline";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firebaseDb } from "../../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-react";
import moment from 'moment';
import PPT_ICON from "../../../src/assets/ppt.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function MyProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      GetProjects();
    }
  }, [user]);

  const GetProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const q = query(
        collection(firebaseDb, "projects"),
        where("createdBy", "==", user?.primaryEmailAddress?.emailAddress ?? "")
      );
      const querySnapshot = await getDocs(q);
      const projectsData: Project[] = [];
      
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log("📦 Project:", doc.id, " => ", doc.data());
        projectsData.push({ ...doc.data(), projectId: doc.id } as Project);
      });
      
      console.log(`✅ Loaded ${projectsData.length} projects`);
      setProjects(projectsData);
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
      
      // Handle offline case
      if (error.message?.includes('offline') || error.code === 'unavailable') {
        console.warn("⚠️ Firebase offline - projects may not be available");
        setError("Connection issue - projects may not be available");
        // Don't clear projects on offline error
      } else {
        console.error("❌ Firebase error:", error);
        setError("Failed to load projects");
        setProjects([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const FormatDate=(timestamp:any) =>{
    // Handle both milliseconds and seconds timestamp
    const date = moment(timestamp);
    const formateDate = date.fromNow();
    return formateDate;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="max-w-6xl mx-auto mt-16 px-6"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-[#8b5cf6]/20 to-[#ec4899]/20 border border-[#8b5cf6]/30">
            <Presentation className="h-4 w-4 text-[#8b5cf6] rounded-full" />
          </div>
          <h2 className="font-display font-bold text-xl text-[#fafafa]">My Projects</h2>
        </div>
        {error && (
          <button
            onClick={GetProjects}
            className="text-xs text-[#8b5cf6] hover:text-[#ec4899] transition-colors"
          >
            Retry
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#8b5cf6] mx-auto mb-4" />
              <p className="text-[#a0a0a0]">Loading projects...</p>
            </div>
          </div>
        ) : !projects?.length ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderIcon className="text-[#a0a0a0] rounded-full" />
              </EmptyMedia>
              <EmptyTitle className="text-[#fafafa]">No Projects Yet</EmptyTitle>
              <EmptyDescription className="text-[#a0a0a0]">
                You haven&apos;t created any projects yet. Get started by
                creating your first project.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button>Create Project</Button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={"/workspace/project/" + project.projectId + "/editor"}>
                  <div className="group relative p-5 rounded-3xl bg-[#1a1a1a] border border-[#8b5cf6]/20 hover:border-[#ec4899]/40 transition-all duration-300 hover:bg-[#2a2a2a]">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/5 to-[#ec4899]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative flex items-start gap-4">
                      <div className="p-2.5 rounded-full bg-[#2a2a2a] border border-[#8b5cf6]/20 shrink-0">
                        <img
                          src={PPT_ICON}
                          width={28}
                          height={28}
                          alt="PPT Icon"
                          className="rounded-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-display font-medium text-sm text-[#fafafa] truncate group-hover:text-white transition-colors">
                          {project?.userInputPrompt || "Untitled Project"}
                        </h2>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="inline-flex items-center gap-1 text-xs text-[#a0a0a0]">
                            <Layers className="h-3 w-3 rounded-full" />
                            <span className="font-mono">{project?.slides?.length || 0}</span> slides
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-[#a0a0a0]">
                            <Clock className="h-3 w-3 rounded-full" />
                            {FormatDate(project?.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-3.5 w-3.5 text-[#8b5cf6] rounded-full" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default MyProjects;
