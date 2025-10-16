import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react'
import { Link, Outlet } from 'react-router-dom'

function WorkSpace() {

  const {user}=useUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-semibold">Please sign in to access the workspace</h2>
        <Link to="/">
          <Button className="px-6">Sign In</Button>
        </Link>
      </div>
    );
  }
  return (
    <div>
      WorkSpace
      <Outlet/>
  </div>
  )
}

export default WorkSpace