import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Eye, RefreshCw } from 'lucide-react';
import InlineSlideEditor from './InlineSlideEditor';
import type { Outline } from '../../workspace/project/outline';

interface SlideEditorProps {
  slideData: Outline;
  slideIndex: number;
  slideHtml: string;
  onOutlineUpdate: (index: number, updatedData: Outline) => void;
  onCodeUpdate: (index: number, newCode: string) => void;
  onRegenerate: (index: number) => void;
  isRegenerating?: boolean;
}

export default function SlideEditor({
  slideData,
  slideIndex,
  slideHtml,
  onOutlineUpdate,
  onCodeUpdate,
  onRegenerate,
  isRegenerating = false,
}: SlideEditorProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [editedCode, setEditedCode] = useState(slideHtml);

  const handleCodeSave = () => {
    onCodeUpdate(slideIndex, editedCode);
  };

  return (
    <div className="space-y-6">
      {/* Outline Editor */}
      <InlineSlideEditor
        slideData={slideData}
        slideIndex={slideIndex}
        onUpdate={onOutlineUpdate}
        onRegenerate={onRegenerate}
        isRegenerating={isRegenerating}
      />

      {/* Slide Preview/Code Editor */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'preview' | 'code')}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-1">
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger 
              value="code" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
            >
              <Code className="w-4 h-4 mr-2" />
              HTML Code
            </TabsTrigger>
          </TabsList>

          {activeTab === 'code' && (
            <Button
              size="sm"
              onClick={handleCodeSave}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Apply Changes
            </Button>
          )}
        </div>

        <TabsContent value="preview" className="mt-0">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-3xl p-6 overflow-hidden shadow-2xl">
            <div 
              className="flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: slideHtml }}
            />
          </div>
        </TabsContent>

        <TabsContent value="code" className="mt-0">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-3xl p-6 shadow-2xl">
            <textarea
              value={editedCode}
              onChange={(e) => setEditedCode(e.target.value)}
              className="w-full h-[400px] bg-zinc-950/50 text-zinc-300 font-mono text-sm p-6 rounded-2xl border border-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all"
              spellCheck={false}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
