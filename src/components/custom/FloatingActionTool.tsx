import { ArrowRight, Loader2Icon,  Sparkles, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

type Props ={
    position:{x:number,y:number} | null,
    onClose:()=>void,
    handleAiChange:any,
    loading:boolean
}

function FloatingActionTool({position,onClose,handleAiChange,loading}:Props) {

    const [userAiPrompt,setUserAiPrompt]=useState<string>();
    if(!position) return;

  return (

    <div className='absolute z-50 text-sm rounded-xl flex items-center bg-[#1F0E3A] border border-[#A855F7]/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6),0_0_0_1px_rgba(168,85,247,0.1)] backdrop-blur-xl'
    style={{
        top:position.y+60,
        left:position.x,
        transform:"translate(-80%)"
    }}
    >
        <div className='flex gap-2 items-center px-3 py-2'>
            <Sparkles className='h-3.5 w-3.5 text-[#A855F7] shrink-0'/>
            <input type="text" placeholder='Edit with AI...' className='outline-none border-none bg-transparent text-[#F5F3FF] placeholder:text-[#8B7AB8] text-sm min-w-[180px]'
            onChange={(event)=>setUserAiPrompt(event.target.value)}
            disabled={loading}
            value={userAiPrompt}
            />
        {userAiPrompt && 
        <Button variant={'ghost'} size={'icon-sm'} className="h-7 w-7 text-[#A855F7] hover:text-[#EC4899] hover:bg-[#A855F7]/10" onClick={()=>{handleAiChange(userAiPrompt); setUserAiPrompt('')}}>
            <ArrowRight className='h-3.5 w-3.5' />
        </Button>
        }
        {loading && <Loader2Icon className='animate-spin h-3.5 w-3.5 text-[#A855F7]'/>}
        </div>
        <div className="w-px h-6 bg-[#A855F7]/20" />
        <Button variant={'ghost'} size={'icon-sm'} className='mx-1 h-7 w-7 text-[#8B7AB8] hover:text-[#F5F3FF]'
        onClick={onClose}><X className="h-3.5 w-3.5" /></Button>
    </div>
  )
}

export default FloatingActionTool