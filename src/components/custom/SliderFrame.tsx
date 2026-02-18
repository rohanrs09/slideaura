import { useEffect, useRef, useState } from 'react'
import FloatingActionTool from './FloatingActionTool';
import { GeminiAiModel } from './../../../config/FirebaseConfig';

const HTML_DEFAULT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slide Preview</title>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Custom Tailwind Config -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {colorCodes},
        },
      },
    };
  </script>

  <!-- Flowbite CSS & JS -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { 
      width: 800px; 
      height: 500px; 
      overflow: hidden;
      font-family: system-ui, -apple-system, sans-serif;
    }
    body > div:first-child {
      width: 800px !important;
      height: 500px !important;
      overflow: hidden;
    }
    img {
      max-width: 100%;
      height: auto;
      object-fit: cover;
    }
    [contenteditable="true"] {
      outline: 2px solid #3B82F6 !important;
      cursor: text;
    }
    .slide-hover {
      outline: 2px dashed #A855F7 !important;
    }
  </style>
</head>
<body>
{code}
</body>
</html>
`

type SlideProps = {
    slide: { code: string },
    colors: Record<string, string>,
    setUpdateSlider: (code: string) => void
}

function SliderFrame({ slide, colors, setUpdateSlider }: SlideProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [loading, setLoading] = useState(false);
    const selectedElRef = useRef<HTMLElement | null>(null);
    const [cardPosition, setCardPosition] = useState<{ x: number, y: number } | null>(null);

    // Build final HTML code
    const buildFinalCode = () => {
        const defaultSlide = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
            <div class="text-center">
                <div class="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-white text-xl">Generating slide...</p>
            </div>
        </div>`;
        
        return HTML_DEFAULT
            .replace("{colorCodes}", JSON.stringify(colors || {}))
            .replace("{code}", slide?.code || defaultSlide);
    };

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;
        
        const doc = iframe.contentDocument;
        if (!doc) return;

        const finalCode = buildFinalCode();
        doc.open();
        doc.write(finalCode);
        doc.close();

        let hoverEl: HTMLElement | null = null;
        let selectedEl: HTMLElement | null = null;

        const clearSelection = () => {
            if (selectedEl) {
                selectedEl.style.outline = '';
                selectedEl.removeAttribute('contenteditable');
                selectedEl = null;
                selectedElRef.current = null;
            }
            setCardPosition(null);
        };

        const handleMouseOver = (e: MouseEvent) => {
            if (selectedEl) return;
            const target = e.target as HTMLElement;
            if (target.tagName === 'BODY' || target.tagName === 'HTML') return;
            
            if (hoverEl && hoverEl !== target) {
                hoverEl.classList.remove('slide-hover');
            }
            hoverEl = target;
            hoverEl.classList.add('slide-hover');
        };

        const handleMouseOut = (e: MouseEvent) => {
            if (selectedEl) return;
            const target = e.target as HTMLElement;
            target.classList.remove('slide-hover');
            if (hoverEl === target) hoverEl = null;
        };

        const handleClick = (e: MouseEvent) => {
            e.stopPropagation();
            const target = e.target as HTMLElement;
            
            if (target.tagName === 'BODY' || target.tagName === 'HTML') {
                clearSelection();
                return;
            }

            // Clear previous selection
            if (selectedEl && selectedEl !== target) {
                selectedEl.style.outline = '';
                selectedEl.removeAttribute('contenteditable');
            }

            // Set new selection
            selectedEl = target;
            selectedElRef.current = target;
            target.classList.remove('slide-hover');
            target.style.outline = '2px solid #3B82F6';
            target.setAttribute('contenteditable', 'true');
            target.focus();
            
            // Position floating toolbar
            const rect = target.getBoundingClientRect();
            const iframeRect = iframe.getBoundingClientRect();
            setCardPosition({
                x: iframeRect.left + rect.left + rect.width / 2,
                y: iframeRect.top + rect.bottom + 10
            });
        };

        const handleBlur = () => {
            if (selectedEl && iframe.contentDocument?.body) {
                const updatedCode = iframe.contentDocument.body.innerHTML;
                setUpdateSlider(updatedCode);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedEl) {
                selectedEl.style.outline = '';
                selectedEl.removeAttribute('contenteditable');
                selectedEl = null;
                selectedElRef.current = null;
                setCardPosition(null);
            }
        };

        // Attach event listeners after DOM is ready
        doc.addEventListener('DOMContentLoaded', () => {
            doc.body?.addEventListener('mouseover', handleMouseOver);
            doc.body?.addEventListener('mouseout', handleMouseOut);
            doc.body?.addEventListener('click', handleClick);
            doc.body?.addEventListener('blur', handleBlur, true);
            doc.body?.addEventListener('keydown', handleKeyDown);
        });

        // Also attach immediately for already loaded content
        setTimeout(() => {
            doc.body?.addEventListener('mouseover', handleMouseOver);
            doc.body?.addEventListener('mouseout', handleMouseOut);
            doc.body?.addEventListener('click', handleClick);
            doc.body?.addEventListener('blur', handleBlur, true);
            doc.body?.addEventListener('keydown', handleKeyDown);
        }, 100);

        return () => {
            doc.body?.removeEventListener('mouseover', handleMouseOver);
            doc.body?.removeEventListener('mouseout', handleMouseOut);
            doc.body?.removeEventListener('click', handleClick);
            doc.body?.removeEventListener('blur', handleBlur, true);
            doc.body?.removeEventListener('keydown', handleKeyDown);
        };
    }, [slide?.code]);

    const handleAiSectionChange = async (input: string) => {
        const selectedEl = selectedElRef.current;
        const iframe = iframeRef.current;
        if (!selectedEl || !iframe) return;

        setLoading(true);
        const oldHTML = selectedEl.outerHTML;

        const prompt = `
Regenerate or rewrite the following HTML code based on this user instruction.
If user asked to change the image/regenerate the image then make sure to use
ImageKit:
'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg'
Replace {imagePrompt} with relevant image prompt and altImageName with a random image name.
if user want to crop image, or remove background or scale image or optimze image then add image kit ai transfromation 
by providing ?tr=fo-auto,<other transfromation> etc.  
"User Instruction is :${input}"
HTML code:
${oldHTML}
`;

        try {
            const result = await GeminiAiModel.generateContent(prompt);
            let newHTML = (await result.response.text()).trim();
            
            // Clean up markdown code blocks if AI returns them
            newHTML = newHTML.replace(/```html/g, '').replace(/```/g, '').trim();

            // Replace only the selected element
            const tempDiv = iframe.contentDocument?.createElement("div");
            if (tempDiv) {
                tempDiv.innerHTML = newHTML;
                const newNode = tempDiv.firstElementChild;

                if (newNode && selectedEl.parentNode) {
                    selectedEl.parentNode.replaceChild(newNode, selectedEl);
                    selectedElRef.current = newNode as HTMLElement;
                    console.log("✅ Element replaced successfully");

                    const updatedSliderCode = iframe.contentDocument?.body?.innerHTML || newHTML;
                    setUpdateSlider(updatedSliderCode);
                }
            }
        } catch (err) {
            console.error("AI generation failed:", err);
        }

        setLoading(false);
    }

    return (
        <div className='relative mb-6'>
            {/* Slide Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#A855F7]/20 hover:border-[#A855F7]/40 transition-all duration-300">
                <iframe
                    ref={iframeRef}
                    className="w-[800px] h-[500px] border-0 bg-[#0A0118]"
                    sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
                    title="Slide Preview"
                />
                
                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                        <div className="flex items-center gap-3 bg-[#150828] px-4 py-2 rounded-lg border border-[#A855F7]/30">
                            <div className="w-5 h-5 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
                            <span className="text-[#F5F3FF] text-sm">Updating with AI...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Action Tool */}
            <FloatingActionTool 
                position={cardPosition}
                onClose={() => setCardPosition(null)}
                loading={loading}
                handleAiChange={handleAiSectionChange}
            />
        </div>
    );
}

export default SliderFrame
