import { Skeleton } from '../ui/skeleton'
import type { Outline } from '@/workspace/project/outline';
import { Edit2, Trash2 } from 'lucide-react';
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
        <div className='space-y-4'>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className='text-lg font-bold text-[#F5F3FF]'>Slide Structure</h3>
                    <p className="text-sm text-[#8B7AB8] mt-1">Edit your presentation outline</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#A855F7] rounded-full animate-pulse" />
                    <span className="text-sm text-[#A855F7] font-medium">{outline.length} slides</span>
                </div>
            </div>
            
            {/* Outline Items */}
            <div className='space-y-3'>
                {outline?.map((item, index) => (
                    <div key={index} className="group relative">
                        {editingIndex === index ? (
                            /* Edit Mode */
                            <div className="bg-[#0A0118] border border-[#A855F7]/30 rounded-2xl p-5 space-y-4 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#A855F7] to-[#EC4899] rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-[#8B7AB8] uppercase tracking-wide">Editing Slide {index + 1}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-[#8B7AB8] block mb-2">Slide Title</label>
                                        <input
                                            type="text"
                                            value={editingData?.slidePoint || ''}
                                            onChange={(e) => setEditingData({ ...editingData!, slidePoint: e.target.value })}
                                            className="w-full bg-[#150828] border border-[#A855F7]/20 rounded-xl px-4 py-3 text-[#F5F3FF] placeholder-[#8B7AB8] focus:outline-none focus:border-[#A855F7]/50 transition-colors"
                                            placeholder="Enter slide title..."
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-xs text-[#8B7AB8] block mb-2">Slide Content</label>
                                        <textarea
                                            value={editingData?.outline || ''}
                                            onChange={(e) => setEditingData({ ...editingData!, outline: e.target.value })}
                                            className="w-full bg-[#150828] border border-[#A855F7]/20 rounded-xl px-4 py-3 text-[#F5F3FF] placeholder-[#8B7AB8] focus:outline-none focus:border-[#A855F7]/50 resize-none transition-colors"
                                            rows={3}
                                            placeholder="Enter slide content..."
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 justify-end pt-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCancel}
                                        className="border-[#A855F7]/30 text-[#8B7AB8] hover:bg-[#150828] hover:text-[#F5F3FF] transition-colors"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        className="bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white hover:from-[#9333EA] hover:to-[#DB2777] transition-all duration-200"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            /* View Mode */
                            <div className="bg-[#150828]/30 backdrop-blur-sm border border-[#A855F7]/20 hover:border-[#EC4899]/40 rounded-2xl p-5 transition-all duration-200 group hover:shadow-lg hover:shadow-[#A855F7]/10">
                                <div className="flex items-start gap-4">
                                    {/* Slide Number */}
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#A855F7]/20 to-[#EC4899]/20 rounded-xl flex items-center justify-center border border-[#A855F7]/30">
                                        <span className="text-sm font-bold text-[#A855F7]">{index + 1}</span>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-[#F5F3FF] mb-2 leading-tight">{item.slidePoint}</h3>
                                        <p className="text-sm text-[#8B7AB8] leading-relaxed line-clamp-3">{item.outline}</p>
                                    </div>
                                    
                                    {/* Actions */}
                                    {editable && (
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEdit(index, item)}
                                                className="h-9 w-9 p-0 text-[#8B7AB8] hover:text-[#F5F3FF] hover:bg-[#A855F7]/20 rounded-lg transition-colors"
                                                title="Edit slide"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(index)}
                                                className="h-9 w-9 p-0 text-[#8B7AB8] hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                title="Delete slide"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                
                {outline.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-[#A855F7]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-[#A855F7]">📝</span>
                        </div>
                        <p className="text-[#8B7AB8] text-sm">No slides in outline yet</p>
                        <p className="text-[#8B7AB8] text-xs mt-1">Your outline will appear here once generated</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OutlineSection;
