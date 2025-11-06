
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
type Props={
    openAlert:boolean,
    setOpenAlert:any
}

function CreditLimitDialog({openAlert,setOpenAlert}:Props) {
  return (
    <AlertDialog open={openAlert}>
      {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Opps!</AlertDialogTitle>
          <AlertDialogDescription>
            You don't have any credits left , Join Unlimited project create plan
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>setOpenAlert(false)}>Cancel</AlertDialogCancel>
          <Link to={'/workspace/pricing'}>
          <AlertDialogAction>Pricing</AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreditLimitDialog;
