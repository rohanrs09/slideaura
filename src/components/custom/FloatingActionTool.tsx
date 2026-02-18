import { ArrowRight, Loader2Icon, Sparkles, X, Image, Type, Palette } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

type Props = {
    position: { x: number, y: number } | null,
    onClose: () => void,
    handleAiChange: (prompt: string) => void,
    loading: boolean
}

function FloatingActionTool({ position, onClose, handleAiChange, loading }: Props) {
    const [userAiPrompt, setUserAiPrompt] = useState<string>('');

    if (!position) return null;

    const handleSubmit = () => {
        if (userAiPrompt.trim()) {
            handleAiChange(userAiPrompt.trim());
            setUserAiPrompt('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const quickActions = [
        { icon: Type, label: 'Rewrite', prompt: 'Rewrite this text to be more professional' },
        { icon: Image, label: 'New Image', prompt: 'Generate a new relevant image for this section' },
        { icon: Palette, label: 'Style', prompt: 'Improve the styling and visual design' },
    ];

    return (
        <div 
            className='fixed z-50 text-sm rounded-xl bg-[#1F0E3A]/95 border border-[#A855F7]/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6),0_0_0_1px_rgba(168,85,247,0.1)] backdrop-blur-xl'
            style={{
                top: Math.min(position.y, window.innerHeight - 150),
                left: Math.min(Math.max(position.x - 150, 10), window.innerWidth - 320),
            }}
        >
            {/* Quick Actions */}
            <div className="flex gap-1 px-2 pt-2 pb-1 border-b border-[#A855F7]/10">
                {quickActions.map((action) => (
                    <Button
                        key={action.label}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-[#8B7AB8] hover:text-[#F5F3FF] hover:bg-[#A855F7]/20"
                        onClick={() => handleAiChange(action.prompt)}
                        disabled={loading}
                    >
                        <action.icon className="h-3 w-3 mr-1" />
                        {action.label}
                    </Button>
                ))}
            </div>

            {/* Input Area */}
            <div className='flex gap-2 items-center px-3 py-2'>
                <Sparkles className='h-3.5 w-3.5 text-[#A855F7] shrink-0' />
                <input 
                    type="text" 
                    placeholder='Describe changes...' 
                    className='outline-none border-none bg-transparent text-[#F5F3FF] placeholder:text-[#8B7AB8] text-sm min-w-[200px]'
                    onChange={(e) => setUserAiPrompt(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={loading}
                    value={userAiPrompt}
                    autoFocus
                />
                {userAiPrompt && !loading && (
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0 text-[#A855F7] hover:text-[#EC4899] hover:bg-[#A855F7]/10" 
                        onClick={handleSubmit}
                    >
                        <ArrowRight className='h-3.5 w-3.5' />
                    </Button>
                )}
                {loading && <Loader2Icon className='animate-spin h-4 w-4 text-[#A855F7]' />}
                <div className="w-px h-5 bg-[#A855F7]/20 mx-1" />
                <Button 
                    variant="ghost" 
                    size="sm"
                    className='h-7 w-7 p-0 text-[#8B7AB8] hover:text-[#F5F3FF] hover:bg-[#A855F7]/10'
                    onClick={onClose}
                >
                    <X className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}

export default FloatingActionTool