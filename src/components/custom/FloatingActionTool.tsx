import { ArrowRight, Sparkle, Sparkles, X } from 'lucide-react';
import React from 'react'
import { Button } from '../ui/button';

type Props ={
    position:{x:number,y:number} | null,
    onClose:()=>void
}

function FloatingActionTool({position,onClose}:Props) {
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
            <input type="text" placeholder='Edit with AI' className='outline-none border-none'/>
        <Button variant={'ghost'} size={'icon-sm'}>
            <ArrowRight className='h-2 w-4' />
        </Button>
        </div>
        <Button variant={'ghost'} size={'icon-sm'} className='ml-1'
        onClick={onClose}><X /></Button>
    </div>
  )
}

export default FloatingActionTool