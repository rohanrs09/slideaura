import { Button } from "@/components/ui/button";
import { useUser, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useContext } from "react";
import { UserDetailContext } from "../../context/UserDetailContext";
import Header from "@/components/custom/Header";
import PromptBox from "@/components/custom/PromptBox";
import MyProjects from "@/components/custom/MyProjects";
import FirebaseStatus from "@/components/FirebaseStatus";
import { firebaseDb } from "../../config/FirebaseConfig";

function WorkSpace() {
  const { user } = useUser();
  const { setUserDetail } = useContext(UserDetailContext);
  const location = useLocation();

  // check user when logged in
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      CreateNewUser();
    }
  }, [user]);

  const CreateNewUser = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    // get user reference
    const docRef = doc(
      firebaseDb,
      "users",
      user.primaryEmailAddress.emailAddress
    );

    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // show when user already exists
        console.log("✅ User document data :", docSnap.data());
        setUserDetail(docSnap.data());
      } else {
        // Create new user
        const newUser = {
          fullName: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          createdAt: new Date(),
          credits: 2,
        };

        await setDoc(docRef, newUser);
        setUserDetail(newUser);
        console.log("✅ New user created:", newUser);
      }
    } catch (error) {
      console.error("❌ Error creating/fetching user:", error);
      
      // Handle offline case - set default user details
      if (error.message?.includes('offline') || error.code === 'unavailable') {
        console.warn("⚠️ Firebase offline - using default user details");
        setUserDetail({
          fullName: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          credits: 2,
        });
      } else {
        console.error("❌ Firebase error:", error);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <div className="relative flex flex-col items-center justify-center min-h-screen gap-6 px-6 pt-16">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-[#6366f1]/10 to-transparent blur-3xl" />
          <div className="relative z-10 text-center">
            <h2 className="font-display text-2xl font-bold text-[#fafafa] mb-2">
              Sign in to continue
            </h2>
            <p className="text-[#a0a0a0] mb-6">Access your workspace and start creating presentations</p>
            <div className="flex items-center justify-center gap-4">
              <SignInButton mode="modal">
                <Button variant="ghost" size="lg" className="px-8 text-[#a0a0a0] hover:text-[#fafafa] hover:bg-[#2a2a2a]">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="cta" size="lg" className="px-8">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <FirebaseStatus />
      <div className="pt-16">
        {location.pathname === "/workspace" && (
          <div className="container mx-auto px-6 py-8">
            <PromptBox />
            <MyProjects />
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
}

export default WorkSpace;
