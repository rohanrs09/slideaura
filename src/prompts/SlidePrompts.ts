// Professional slide generation prompts with theme-specific styling

export interface SlidePromptConfig {
  designStyle: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    gradient: string;
  };
  metadata: {
    title: string;
    content: string;
    slideNumber: number;
    totalSlides: number;
  };
}

/**
 * Generate professional slide prompt with theme-specific guidelines
 */
export function generateProfessionalSlidePrompt(config: SlidePromptConfig): string {
  const { designStyle, colors, metadata } = config;
  
  return `You are an expert presentation designer. Generate a SINGLE professional slide in HTML using TailwindCSS v3, Flowbite UI components, and Lucide React icons.

## CRITICAL REQUIREMENTS:

### 1. DESIGN THEME: ${designStyle}
Apply the following theme-specific design principles:
${getThemeSpecificGuidelines(designStyle)}

### 2. COLOR PALETTE (MUST USE):
- Primary: ${colors.primary}
- Secondary: ${colors.secondary}
- Accent: ${colors.accent}
- Background: ${colors.background}
- Gradient: ${colors.gradient}

Use these EXACT colors throughout the slide. Apply them to:
- Backgrounds (use gradient for visual interest)
- Text (primary for headings, secondary for body)
- Accents (for highlights, borders, icons)
- Overlays (subtle, max 10% opacity)

### 3. SLIDE CONTENT:
Title: ${metadata.title}
Content: ${metadata.content}
Slide ${metadata.slideNumber} of ${metadata.totalSlides}

### 4. LAYOUT REQUIREMENTS:

**Fixed Dimensions:**
- Container: w-[1280px] h-[720px] (16:9 ratio)
- Use absolute positioning for precise control
- No responsive classes (fixed desktop layout)

**Visual Hierarchy:**
- Title: text-5xl to text-6xl, font-bold, prominent placement
- Subtitle: text-2xl to text-3xl, font-medium
- Body text: text-lg to text-xl, leading-relaxed
- Captions: text-sm to text-base

**Spacing:**
- Generous padding: p-12 to p-16
- Proper margins between elements
- Use grid or flex for alignment
- Maintain visual balance

### 5. IMAGE INTEGRATION:

Generate 1-2 high-quality images using ImageKit:
\`\`\`html
<img 
  src="https://ik.imagekit.io/ikmedia/tr:w-800,h-450,q-90,f-webp/ik-genimg-prompt-{IMAGE_PROMPT}/{IMAGE_NAME}.jpg"
  alt="{descriptive alt text}"
  class="w-full h-full object-cover rounded-xl shadow-2xl"
  loading="lazy"
/>
\`\`\`

**Image Prompt Guidelines:**
- Create detailed, specific prompts (e.g., "modern office workspace with natural lighting professional photography")
- Match the slide theme and content
- Use professional photography style keywords
- Include style modifiers: "high quality", "professional", "4k", "detailed"

**Image Placement:**
- Hero images: Full-width or 50-60% of slide
- Supporting images: 30-40% of slide, grid layout
- Background images: Use with overlay (opacity-20 to opacity-30)
- Always use object-cover or object-contain
- Add rounded corners (rounded-lg to rounded-2xl)
- Apply shadows (shadow-xl to shadow-2xl)

### 6. TYPOGRAPHY:

**Font Families:**
- Headings: font-sans (Inter, system-ui)
- Body: font-sans
- Accent/Special: font-serif (for quotes, emphasis)

**Text Styling:**
- Use font-weight: 300 (light), 400 (normal), 600 (semibold), 700 (bold), 800 (extrabold)
- Line height: leading-tight (headings), leading-relaxed (body)
- Letter spacing: tracking-tight (headings), tracking-normal (body)
- Text colors: Use palette colors with opacity variants

### 7. VISUAL ELEMENTS:

**Icons (Lucide):**
- Use relevant icons from lucide-react
- Size: w-8 h-8 to w-16 h-16
- Color: Match accent color
- Placement: Next to headings, in lists, as decorative elements

**Gradients:**
- Background: ${colors.gradient}
- Overlays: Use sparingly (opacity-10 to opacity-20)
- Text gradients: bg-gradient-to-r bg-clip-text text-transparent

**Borders & Dividers:**
- Subtle borders: border border-accent/20
- Dividers: h-px bg-gradient-to-r from-transparent via-accent to-transparent
- Rounded corners: rounded-xl to rounded-2xl

**Shadows:**
- Cards: shadow-xl to shadow-2xl
- Images: shadow-2xl
- Floating elements: shadow-lg with hover:shadow-2xl

### 8. CONTENT LAYOUT PATTERNS:

Choose the BEST layout for the content type:

**Title Slide:**
- Centered, large typography
- Minimal text, maximum impact
- Background gradient or hero image
- Company logo if applicable

**Content Slide:**
- 60/40 split (text/image or vice versa)
- Clear hierarchy
- Bullet points or numbered lists
- Supporting visuals

**Data/Stats Slide:**
- Grid layout for multiple stats
- Large numbers with labels
- Icons representing each metric
- Minimal text, maximum clarity

**Quote/Testimonial:**
- Centered text
- Large quote marks
- Author attribution
- Background image with overlay

**Comparison Slide:**
- Two-column layout
- Visual separation
- Icons or images for each side
- Clear labels

### 9. PROFESSIONAL TOUCHES:

**Must Include:**
- Subtle animations (transition-all duration-300)
- Hover effects on interactive elements
- Proper contrast ratios (WCAG AA minimum)
- Consistent spacing system (multiples of 4)
- Visual breathing room (don't overcrowd)

**Avoid:**
- Overlapping elements
- Overflow (use overflow-hidden)
- Generic stock photo look
- Too many colors (stick to palette)
- Cluttered layouts
- Small, unreadable text

### 10. OUTPUT FORMAT:

Return ONLY the HTML body content (no <html>, <head>, or <body> tags).
Start directly with the main slide container:

\`\`\`html
<div class="w-[1280px] h-[720px] relative bg-[${colors.background}] overflow-hidden">
  <!-- Your professional slide content here -->
</div>
\`\`\`

**Quality Checklist:**
✓ Uses exact color palette
✓ Follows theme-specific design
✓ Includes high-quality images
✓ Professional typography
✓ Proper spacing and hierarchy
✓ No overflow or layout issues
✓ Visually balanced composition
✓ Matches slide content accurately

Generate a slide that looks like it was designed by a professional presentation agency. Make it visually stunning, modern, and highly polished.`;
}

/**
 * Get theme-specific design guidelines
 */
function getThemeSpecificGuidelines(designStyle: string): string {
  const guidelines: Record<string, string> = {
    'Professional Blue 💼': `
- Corporate, trustworthy aesthetic
- Clean lines and geometric shapes
- Sans-serif fonts (Inter, Roboto)
- Subtle gradients and shadows
- Professional photography
- Minimal decorative elements
- Focus on clarity and readability
- Use icons sparingly, keep them simple
- White space is your friend
- Grid-based layouts`,

    'Minimal White ⚪': `
- Ultra-clean, spacious design
- Lots of white space (negative space)
- Thin, elegant typography
- Minimal color usage (mostly black/white/grey)
- Simple, high-quality photography
- No gradients or heavy shadows
- Subtle borders and dividers
- Focus on content, not decoration
- Swiss design principles
- Perfect alignment and spacing`,

    'Modern Gradient 🌈': `
- Bold, vibrant gradients
- Glassmorphism effects (backdrop-blur)
- Modern, rounded corners
- Colorful, eye-catching design
- Abstract or tech-focused imagery
- Overlapping elements with transparency
- Dynamic, energetic feel
- Use gradient text effects
- Neon accents and glows
- Contemporary, tech-savvy aesthetic`,

    'Dark Modern 🌙': `
- Dark backgrounds (#0a0a0a to #1a1a1a)
- High contrast text (white/light colors)
- Neon or bright accent colors
- Subtle glow effects
- Modern, sleek imagery
- Minimalist with impact
- Use shadows for depth
- Futuristic, premium feel
- Elegant dark mode design
- Focus on visual hierarchy`,

    'Pastel Soft 🎨': `
- Soft, muted pastel colors
- Gentle gradients
- Rounded, friendly shapes
- Light, airy feel
- Soft shadows (no harsh edges)
- Playful but professional
- Use illustrations or soft photography
- Warm, welcoming aesthetic
- Feminine or creative vibe
- Smooth transitions`,

    'Tech Blue 💻': `
- Tech-focused, innovative design
- Blue tones with cyan/electric accents
- Grid patterns or circuit board aesthetics
- Modern, sans-serif fonts
- Tech product photography
- Clean, organized layouts
- Use icons for tech concepts
- Professional but cutting-edge
- Digital, futuristic elements
- Data visualization friendly`,
  };

  return guidelines[designStyle] || guidelines['Professional Blue 💼'];
}

/**
 * Generate image prompt for slide content
 */
export function generateImagePrompt(
  slideTitle: string,
  slideContent: string,
  designStyle: string
): string {
  // Extract key concepts
  const concepts = slideContent
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 10)
    .slice(0, 2)
    .join(' ');

  const styleKeywords = getStyleKeywords(designStyle);
  
  return `${slideTitle} ${concepts} ${styleKeywords} professional high quality 4k photography detailed`.substring(0, 150);
}

/**
 * Get style-specific keywords for image generation
 */
function getStyleKeywords(designStyle: string): string {
  const keywords: Record<string, string> = {
    'Professional Blue 💼': 'corporate business professional clean modern',
    'Minimal White ⚪': 'minimalist clean simple elegant white background',
    'Modern Gradient 🌈': 'colorful vibrant modern abstract tech',
    'Dark Modern 🌙': 'dark moody cinematic premium luxury',
    'Pastel Soft 🎨': 'soft pastel gentle warm friendly',
    'Tech Blue 💻': 'technology futuristic digital innovation',
  };

  return keywords[designStyle] || 'professional modern high quality';
}
