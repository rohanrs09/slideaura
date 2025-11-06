import { Button } from "../ui/button";
import { Play } from "lucide-react";
import { HeroVideoDialog } from "../ui/hero-video-dialog";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const { user } = useUser();

    // action buttons section
  const renderActionButtons = () => (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <Button variant="outline" size="lg" className="group">
        Watch Video
        <Play className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>

      {!user ? (
        <SignInButton mode="modal">
          <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
            Get Started
          </Button>
        </SignInButton>
      ) : (
        // Link using because it is much faster than anchor tag
        <Link to="/workspace">
        <Button>Go to Workspace</Button>
        </Link>
      )}
    </div>
  );

  // video section
  const renderVideoSection = () => (
    <div className="relative max-w-3xl mt-14">
      <h2 className="text-2xl font-semibold mb-6">
        Watch how to Create PPT Using AI
      </h2>

      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
        thumbnailAlt="Hero Video Light Theme"
      />

      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
        thumbnailAlt="Hero Video Dark Theme"
      />
    </div>
  );

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <h1 className="font-bold text-5xl md:text-6xl tracking-tight max-w-4xl">
          From Idea to Presentation in One Click ⚡
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl">
          Generate sleek, editable PPT decks in minutes. AI handles slide design,
          formatting, and visual content so you can focus on your message,
          impress your audience, and work smarter, not harder.
        </p>

        {renderActionButtons()}
        {renderVideoSection()}
      </div>
    </section>
  );
};

export default Hero;
