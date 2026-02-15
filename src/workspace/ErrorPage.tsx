import { Link, useRouteError } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkspaceErrorPage() {
  const error: any = useRouteError();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0A0118] px-6 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-[#A855F7]/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-[#EC4899]/10 to-transparent blur-3xl" />

      <div className="relative z-10 max-w-md">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A855F7]/20 to-[#EC4899]/20 border border-[#A855F7]/30 flex items-center justify-center">
            <AlertCircle className="text-[#A855F7] w-7 h-7" />
          </div>

          <div>
            <p className="font-mono text-sm text-[#8B7AB8] mb-3">{error?.status || "404"}</p>
            <h1 className="font-heading text-3xl font-bold text-[#F5F3FF] mb-3">
              Page not found
            </h1>

            <p className="text-[#C4B5FD] leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back to your workspace.
            </p>
          </div>

          <Link to="/workspace">
            <Button variant="default" size="lg" className="gap-2 mt-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Workspace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
