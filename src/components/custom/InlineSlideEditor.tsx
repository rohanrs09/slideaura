import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, X, Edit2 } from 'lucide-react';
import type { Outline } from '../../workspace/project/outline';

interface InlineSlideEditorProps {
  slideData: Outline;
  slideIndex: number;
  onUpdate: (index: number, updatedData: Outline) => void;
}

export default function InlineSlideEditor({
  slideData,
  slideIndex,
  onUpdate,
}: InlineSlideEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(slideData.slidePoint);
  const [editedContent, setEditedContent] = useState(slideData.outline);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedTitle(slideData.slidePoint);
    setEditedContent(slideData.outline);
  }, [slideData]);

  useEffect(() => {
    const changed = 
      editedTitle !== slideData.slidePoint || 
      editedContent !== slideData.outline;
    setHasChanges(changed);
  }, [editedTitle, editedContent, slideData]);

  const handleSave = () => {
    const updatedData: Outline = {
      ...slideData,
      slidePoint: editedTitle,
      outline: editedContent,
    };
    onUpdate(slideIndex, updatedData);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setEditedTitle(slideData.slidePoint);
    setEditedContent(slideData.outline);
    setIsEditing(false);
    setHasChanges(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-[#150828] border border-[#A855F7]/20 hover:border-[#EC4899]/40 rounded-xl p-5 mb-4 transition-all duration-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="shrink-0 w-7 h-7 bg-[#A855F7]/20 rounded-lg flex items-center justify-center text-xs font-semibold text-[#A855F7]">
                {slideIndex + 1}
              </span>
              <h3 className="text-base font-semibold text-[#F5F3FF] truncate">
                {slideData.slidePoint}
              </h3>
            </div>
            <p className="text-sm text-[#8B7AB8] leading-relaxed line-clamp-3 ml-10">
              {slideData.outline}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 px-3 text-[#8B7AB8] hover:text-[#F5F3FF] hover:bg-[#A855F7]/20"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#150828] border border-[#A855F7]/30 rounded-xl p-5 mb-4">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-[#8B7AB8] mb-2 block">
            Slide Title
          </label>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full bg-[#0A0118] border border-[#A855F7]/20 rounded-lg px-3 py-2.5 text-[#F5F3FF] placeholder-[#8B7AB8] focus:outline-none focus:border-[#A855F7]/50 text-sm"
            placeholder="Enter slide title..."
          />
        </div>
        
        <div>
          <label className="text-xs font-medium text-[#8B7AB8] mb-2 block">
            Slide Content
          </label>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full bg-[#0A0118] border border-[#A855F7]/20 rounded-lg px-3 py-2.5 text-[#F5F3FF] placeholder-[#8B7AB8] focus:outline-none focus:border-[#A855F7]/50 resize-none text-sm min-h-[100px]"
            placeholder="Enter slide content..."
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-xs">
            {hasChanges && (
              <span className="text-[#EC4899] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#EC4899] rounded-full animate-pulse" />
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="h-8 px-3 text-[#8B7AB8] hover:text-[#F5F3FF] hover:bg-[#A855F7]/10"
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges}
              className="h-8 px-3 bg-[#A855F7] text-white hover:bg-[#9333EA] disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
