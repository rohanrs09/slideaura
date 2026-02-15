import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useState } from "react";

function EditOutlineDialog({children,outlineData,onUpdate}: any) {

    const [localData,setLocalData]=useState(outlineData);
    const [openDialog,setOpenDialog]=useState(false);
    const handleChange=(field:string,value:string)=>{
        setLocalData({
            ...localData,
            [field]:value
        })
    }

    const handleUpdate=()=>{
        onUpdate(outlineData?.slideNo,localData);
        setOpenDialog(false);


    }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="bg-[#150828] border border-[#A855F7]/20 shadow-2xl shadow-black/40 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-[#F5F3FF]">Edit Slide Outline</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-medium text-[#C4B5FD] mb-1.5 block">Slide Title</label>
                  <Input
                    placeholder="Slide title"
                    value={localData.slidePoint}
                    onChange={(e)=>handleChange('slidePoint',e.target.value)}
                    className="bg-[#1F0E3A] border-[#A855F7]/20 text-[#F5F3FF] placeholder:text-[#8B7AB8] focus:border-[#A855F7]/50 focus:ring-1 focus:ring-[#A855F7]/30 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#C4B5FD] mb-1.5 block">Outline</label>
                  <Textarea
                    placeholder="Outline content..."
                    value={localData.outline}
                    rows={5}
                    onChange={(e)=>handleChange('outline',e.target.value)}
                    className="bg-[#1F0E3A] border-[#A855F7]/20 text-[#F5F3FF] placeholder:text-[#8B7AB8] focus:border-[#A855F7]/50 focus:ring-1 focus:ring-[#A855F7]/30 rounded-lg resize-none"
                  />
                </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 pt-2">
            <DialogClose>
                <Button variant={'outline'} size="sm">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdate} size="sm">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditOutlineDialog;
