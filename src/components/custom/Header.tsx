import { Button } from "../ui/button";
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserDetailContext } from "../../../context/UserDetailContext";
import { Gem, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";


const MenuOptions = [
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Pricing",
    path: "/pricing",
  },
  {
    name: "Workspace",
    path: "/workspace",
  },
];

function Header() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const location = useLocation();
  const { userDetail } = useContext(UserDetailContext);
  const { has } = useAuth();
  const hasUnlimitedAccess = has && has({ plan: 'unlimited' });

  const isSignedIn = !!user;
  const isWorkspace = location.pathname.startsWith('/workspace');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/95 border-b border-[#2a2a2a] shadow-lg">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="/logo.svg" 
            alt="SlideAura" 
            className="w-8 h-8"
          />
          <span className="font-display font-bold text-xl text-[#fafafa]">
            SlideAura
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {MenuOptions.map((option) => (
            <Link key={option.path} to={option.path}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-full transition-all duration-200 font-medium",
                  location.pathname === option.path
                    ? "bg-gradient-to-r from-[#8b5cf6]/20 to-[#ec4899]/20 text-[#fafafa] border border-[#8b5cf6]/30 shadow-md"
                    : "text-[#a0a0a0] hover:text-[#fafafa] hover:bg-gradient-to-r hover:from-[#8b5cf6]/10 hover:to-[#ec4899]/10"
                )}
              >
                {option.name}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Credits Badge */}
          {isWorkspace && userDetail && !hasUnlimitedAccess && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#8b5cf6]/10 to-[#ec4899]/10 border border-[#8b5cf6]/20 shadow-sm">
              <Gem className="h-3.5 w-3.5 text-[#8b5cf6] rounded-full" />
              <span className="text-xs font-medium text-[#fafafa]">
                {userDetail.credits} credits
              </span>
            </div>
          )}
          {isWorkspace && userDetail && !hasUnlimitedAccess && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5cf6] via-[#ec4899] to-[#f59e0b] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/30">
              <Sparkles className="h-4 w-4 text-white rounded-full" />
            </div>
          )}
          {/* Auth */}
          {!clerkLoaded ? (
            <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/10 animate-pulse shadow-md" />
          ) : !isSignedIn ? (
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <Button size="sm" variant="ghost" className="rounded-full text-[#a0a0a0] hover:text-[#fafafa] hover:bg-[#2a2a2a] font-medium">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:opacity-90 shadow-md shadow-[#8b5cf6]/30 font-medium">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          ) : (
            <UserButton afterSignOutUrl="/" appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-full overflow-hidden"
              }
            }} />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
