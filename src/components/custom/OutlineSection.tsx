import { Skeleton } from '../ui/skeleton'
import type { Outline } from '@/workspace/project/outline';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type Props = {
    loading: boolean;
    outline: Outline[];
    handleUpdateOutline: (index: string, data: Outline) => void;
    editable?: boolean;
}

function OutlineSection({ loading, outline, handleUpdateOutline, editable = false }: Props) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Outline | null>(null);

    const handleEdit = (index: number, data: Outline) => {
        setEditingIndex(index);
        setEditingData({ ...data });
    };

    const handleSave = () => {
        if (editingIndex !== null && editingData) {
            handleUpdateOutline(String(editingIndex), editingData);
            setEditingIndex(null);
            setEditingData(null);
        }
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setEditingData(null);
    };

    const handleDelete = (index: number) => {
        const newOutline = outline.filter((_, i) => i !== index);
        // Update parent with new array
        const parentData = { outline: newOutline };
        handleUpdateOutline('0', parentData as any);
    };

    if (loading) {
        return (
            <div className='mt-8'>
                <h1 className='font-heading font-bold text-lg text-[#F5F3FF] mb-4'>Slide Outline</h1>
                <div className="mt-4 space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                        <Skeleton key={item} className='h-[72px] w-full rounded-xl bg-[#A855F7]/10' />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className='mt-8'>
            <div className="flex items-center justify-between mb-4">
                <h1 className='font-heading font-bold text-lg text-[#F5F3FF]'>Slide Outline</h1>
                <span className="text-sm text-[#A855F7]">{outline.length} slides</span>
            </div>
            
            <div className='space-y-2'>
                {outline?.map((item, index) => (
                    <div key={index} className="group relative">
                        {editingIndex === index ? (
                            /* Edit Mode */
                            <div className="bg-[#150828] border border-[#A855F7]/30 rounded-xl p-4 space-y-3">
                                <input
                                    type="text"
                                    value={editingData?.slidePoint || ''}
                                    onChange={(e) => setEditingData({ ...editingData!, slidePoint: e.target.value })}
                                    className="w-full bg-[#0A0118] border border-[#A855F7]/20 rounded-lg px-3 py-2 text-[#F5F3FF] placeholder-[#8B7AB8] focus:outline-none focus:border-[#A855F7]/50"
                                    placeholder="Slide title..."
                                />
                                <textarea
                                    value={editingData?.outline || ''}
                                    onChange={(e) => setEditingData({ ...editingData!, outline: e.target.value })}
                                    className="w-full bg-[#0A0118] border border-[#A855F7]/20 rounded-lg px-3 py-2 text-[#F5F3FF] placeholder-[#8B7AB8] focus:outline-none focus:border-[#A855F7]/50 resize-none"
                                    rows={3}
                                    placeholder="Slide content..."
                                />
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCancel}
                                        className="border-[#A855F7]/30 text-[#8B7AB8] hover:bg-[#150828]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        className="bg-[#A855F7] text-white hover:bg-[#9333EA]"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            /* View Mode */
                            <div className="bg-[#150828] border border-[#A855F7]/20 hover:border-[#EC4899]/40 rounded-xl p-4 transition-all duration-200 group">
                                <div className="flex items-start gap-3">
                                    {/* Drag Handle */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <GripVertical className="w-4 h-4 text-[#8B7AB8]" />
                                    </div>
                                    
                                    {/* Slide Number */}
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#A855F7]/20 rounded-lg flex items-center justify-center">
                                        <span className="text-xs font-semibold text-[#A855F7]">{index + 1}</span>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-[#F5F3FF] truncate">{item.slidePoint}</h3>
                                        <p className="text-xs text-[#8B7AB8] mt-1 line-clamp-2">{item.outline}</p>
                                    </div>
                                    
                                    {/* Actions */}
                                    {editable && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEdit(index, item)}
                                                className="h-8 w-8 p-0 text-[#8B7AB8] hover:text-[#F5F3FF] hover:bg-[#A855F7]/20"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(index)}
                                                className="h-8 w-8 p-0 text-[#8B7AB8] hover:text-red-400 hover:bg-red-500/20"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                
                {outline.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-[#8B7AB8] text-sm">No slides in outline yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OutlineSection;
