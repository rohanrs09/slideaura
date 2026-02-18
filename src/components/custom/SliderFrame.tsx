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
            e.preventDefault();
            e.stopPropagation();
            const target = e.target as HTMLElement;
            
            if (target.tagName === 'BODY' || target.tagName === 'HTML') {
                clearSelection();
                return;
            }

            // If clicking the same element, just close
            if (selectedEl === target) {
                clearSelection();
                return;
            }

            // Clear previous selection completely
            if (selectedEl) {
                selectedEl.style.outline = '';
                selectedEl.removeAttribute('contenteditable');
                selectedEl.classList.remove('slide-hover');
            }

            // Set new selection
            selectedEl = target;
            selectedElRef.current = target;
            target.classList.remove('slide-hover');
            target.style.outline = '2px solid #3B82F6';
            
            // Don't make it contenteditable - just show AI toolbar
            // This prevents copy/paste issues
            
            // Position floating toolbar
            const rect = target.getBoundingClientRect();
            const iframeRect = iframe.getBoundingClientRect();
            setCardPosition({
                x: iframeRect.left + rect.left + rect.width / 2,
                y: iframeRect.top + rect.bottom + 10
            });
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                clearSelection();
            }
        };

        // Attach event listeners after DOM is ready
        const attachListeners = () => {
            const body = doc.body;
            if (!body) return;
            
            body.addEventListener('mouseover', handleMouseOver);
            body.addEventListener('mouseout', handleMouseOut);
            body.addEventListener('click', handleClick);
            body.addEventListener('keydown', handleKeyDown);
        };

        setTimeout(attachListeners, 150);

        return () => {
            const body = doc.body;
            if (!body) return;
            body.removeEventListener('mouseover', handleMouseOver);
            body.removeEventListener('mouseout', handleMouseOut);
            body.removeEventListener('click', handleClick);
            body.removeEventListener('keydown', handleKeyDown);
        };
    }, [slide?.code, colors, setUpdateSlider]);

    const handleAiSectionChange = async (input: string) => {
        const selectedEl = selectedElRef.current;
        const iframe = iframeRef.current;
        if (!selectedEl || !iframe) return;

        setLoading(true);
        const oldHTML = selectedEl.outerHTML;

        const prompt = `Modify this HTML element based on user instruction. Return ONLY the HTML element.

User Instruction: "${input}"

RULES:
1. Return ONLY the modified HTML element (no markdown, no explanations, no code blocks)
2. Keep the same structure and Tailwind CSS classes
3. Maintain proper text contrast with background

IMAGE GENERATION (if user wants new/different image):
- Use ImageKit format: https://ik.imagekit.io/ikmedia/ik-genimg-prompt-DESCRIPTION/image.jpg
- Replace DESCRIPTION with URL-encoded keywords (spaces = %20, no special chars)
- Examples:
  * Business meeting: https://ik.imagekit.io/ikmedia/ik-genimg-prompt-business%20meeting/meeting.jpg
  * Modern office: https://ik.imagekit.io/ikmedia/ik-genimg-prompt-modern%20office/office.jpg
  * Team collaboration: https://ik.imagekit.io/ikmedia/ik-genimg-prompt-team%20collaboration/team.jpg
- Add transformations: ?tr=w-600,h-400,fo-auto,q-80
- Image must have: class="rounded-lg object-cover" style="max-width: 100%; max-height: 350px;"

Current HTML:
${oldHTML}

Modified HTML:`;

        try {
            const result = await GeminiAiModel.generateContent(prompt);
            const newHTML = (await result.response.text()).trim();

            // Replace only the selected element
            const tempDiv = iframe.contentDocument?.createElement("div");
            if (tempDiv) {
                tempDiv.innerHTML = newHTML;
                const newNode = tempDiv.firstElementChild;

                if (newNode && selectedEl.parentNode) {
                    selectedEl.parentNode.replaceChild(newNode, selectedEl);
                    selectedElRef.current = newNode as HTMLElement;

                    const updatedSliderCode = iframe.contentDocument?.body?.innerHTML || newHTML
                    setUpdateSlider(updatedSliderCode)
                }
            }
        } catch {
            // AI generation failed - silently handle error
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
