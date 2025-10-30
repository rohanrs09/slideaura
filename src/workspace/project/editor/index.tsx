
import { firebaseDb } from '../../../../config/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import type { Project } from '../outline';
import OutlineSection from '@/components/custom/OutlineSection';

function Editor() {
    
    const { projectId } = useParams();
    const [projectDetail, setProjectDetail] = useState<Project>();
    const [loading, setLoading] = useState(false);

      useEffect (() => {
        if (projectId) {
          GetProjectDetail();
        }
      }, [projectId]);
    
      const GetProjectDetail = async () => {
        setLoading(true);
        const docRef = doc(firebaseDb, "projects", projectId ?? "");
        const docSnap: any = await getDoc(docRef);
    
        if (!docSnap.exists()) {
          return;
        }
        console.log("project detail", docSnap.data());
        setProjectDetail(docSnap.data()); 
        setLoading(false);
      };

  return (
    <div className='grid grid-cols-5 p-10'>
        <div className='col-span-2 h-screen overflow-auto'>
            {/* Outline */}
            <OutlineSection outline={projectDetail?.outline??[]}
            handleUpdateOutline={()=>console.log()}
            loading={loading}
            />
        </div>
        <div className='col-span-3'> 
            {/* Slides */}
            Slides
        </div>
    </div>
  )
}

export default Editor 