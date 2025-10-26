import logo from "../../assets/logo.png";
import { Button } from "../ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { UserDetailContext } from "./../../../context/UserDetailContext";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { Gem } from "lucide-react";

function Header() {
  const { user } = useUser();
  const location = useLocation();
  console.log(location.pathname);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  return (
    <div className="flex items-center justify-between px-10 py-3  shadow">
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="SlideAura Logo"
          className="w-10 h-10 object-contain"
        />
        <span className="font-bold text-xl tracking-tight hidden sm:inline-block bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          SlideAura
        </span>
      </Link>

      {!user ? (
        <SignInButton mode="modal">
          <Button>Get Started</Button>
        </SignInButton>
      ) : (
        <div className="flex gap-5 items-center">
          <UserButton />
          {location.pathname.includes("/workspace") ? (
            <div className="flex items-center gap-2 bg-orange-100 p-2 px-3  rounded-full ">
              <Gem />
              {userDetail?.credits ?? 0}
              {/* showing credits user remaining */}
            </div>
          ) : (
            <Link to="/workspace">
              <Button>Go to Workspace</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
 
export default Header;
