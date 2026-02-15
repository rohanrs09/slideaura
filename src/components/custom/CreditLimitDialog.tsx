
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { Gem } from "lucide-react";
type Props={
    openAlert:boolean,
    setOpenAlert:any
}

function CreditLimitDialog({openAlert,setOpenAlert}:Props) {
  return (
    <AlertDialog open={openAlert}>
      <AlertDialogContent className="bg-[#150828] border border-[#A855F7]/20 shadow-2xl shadow-black/40 sm:max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-gradient-to-br from-[#A855F7]/20 to-[#EC4899]/20 border border-[#A855F7]/30 flex items-center justify-center">
            <Gem className="h-5 w-5 text-[#A855F7]" />
          </div>
          <AlertDialogTitle className="font-heading text-center text-[#F5F3FF]">Credits Exhausted</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-[#C4B5FD]">
            You've used all your free credits. Upgrade to unlimited to keep creating stunning presentations.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          <AlertDialogCancel onClick={()=>setOpenAlert(false)} className="bg-[#1F0E3A] border-[#A855F7]/20 text-[#F5F3FF] hover:bg-[#2D1454]">Not Now</AlertDialogCancel>
          <Link to={'/workspace/pricing'} className="w-full sm:w-auto">
          <AlertDialogAction className="w-full bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#F97316] text-white font-semibold hover:opacity-90 shadow-[0_0_24px_-6px_rgba(168,85,247,0.5)]">View Plans</AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreditLimitDialog;
