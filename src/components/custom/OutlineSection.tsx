import { Skeleton } from '../ui/skeleton'
import type { Outline } from '@/workspace/project/outline';
import { Button } from '../ui/button';
import {  Edit } from 'lucide-react';
import EditOutlineDialog from './EditOutlineDialog'; 

type Props={
    loading:boolean;
    outline:Outline[];
    handleUpdateOutline :any;
    editable?: boolean; 
}

function OutlineSection({loading,outline,handleUpdateOutline}:Props) {
  return (
    <div className='mt-8'>
    <h1 className='font-heading font-bold text-lg text-[#F5F3FF]'>Slide Outline</h1>
    {
        loading && <div className="mt-4 space-y-3">
            {[1, 2, 3, 4].map((item) => (
                <Skeleton key={item} className='h-[72px] w-full rounded-xl bg-[#A855F7]/10' />
            ))
        }
        </div>
    }

    <div className='mb-24 mt-4 space-y-2'>
        {outline?.map((item,index)=>(
            <div key={index} className='group bg-[#150828] border border-[#A855F7]/20 hover:border-[#EC4899]/40 p-4 rounded-xl flex gap-4 items-center justify-between transition-all duration-200'>
                <div className='flex gap-4 items-center min-w-0'>
                <div className='font-mono font-semibold text-sm text-[#A855F7] bg-[#A855F7]/10 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-[#A855F7]/20'>{index+1}</div>
                <div className="min-w-0">
                <h2 className='font-medium text-sm text-[#F5F3FF]'>{item.slidePoint}</h2>
                <p className='text-xs text-[#C4B5FD] mt-0.5 line-clamp-1'>{item.outline}</p>
                </div>
                </div>
                <EditOutlineDialog outlineData={item} onUpdate={handleUpdateOutline}>
                <Button variant={'ghost'} size={'icon-sm'} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#8B7AB8] hover:text-[#F5F3FF]"> <Edit className="h-3.5 w-3.5" /> </Button>
                </EditOutlineDialog>
            </div>
        ))}
    </div>


</div>
  )
}

export default OutlineSection