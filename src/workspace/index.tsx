import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { firebaseDb } from "../../config/FireBaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useContext } from "react";
import { UserDetailContext } from "../../context/UserDetailContext";
import Header from "@/components/custom/Header";
import PromptBox from "@/components/custom/PromptBox";
import MyProjects from "@/components/custom/MyProjects";

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
        console.log("User document data :", docSnap.data());
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
        console.log("New user created:", newUser);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-semibold">
          Please sign in to access the workspace
        </h2>
        <Link to="/">
          <Button className="px-6">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Header />
      {location.pathname === "/workspace" && 
        <div>
          
          <PromptBox />
          <MyProjects />
        </div>
      }
      <Outlet />
    </div>
  );
}

export default WorkSpace;
