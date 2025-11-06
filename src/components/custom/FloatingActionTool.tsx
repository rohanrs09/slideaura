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

    <div className='absolute z-50 bg-white text-sm px-3 py-2 rounded-lg shadow-xl border flex items-center'
    style={{
        top:position.y+60,
        left:position.x,
        transform:"translate(-80%)"
    }}
    >
        <div className='flex gap-2 items-center'>
            <Sparkles className='h-4 w-4'/>
            <input type="text" placeholder='Edit with AI' className='outline-none border-none'
            onChange={(event)=>setUserAiPrompt(event.target.value)}
            disabled={loading}
            value={userAiPrompt}
            />
        {userAiPrompt && 
        <Button variant={'ghost'} size={'icon-sm'} onClick={()=>{handleAiChange(userAiPrompt); setUserAiPrompt('')}}>
            <ArrowRight className='h-2 w-4' />
        </Button>
        }
        {loading && <Loader2Icon className='animate-spin'/>}
        </div>
        <Button variant={'ghost'} size={'icon-sm'} className='ml-1'
        onClick={onClose}><X /></Button>
    </div>
  )
}

export default FloatingActionTool