'use client';

import dynamic from "next/dynamic";
import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Popup } from "@/components/styles/Popup"; // Ensure this import is correct

const HomePage: React.FC = () => {
  const [isShowPopup, setIsShowPopup] = useState<boolean>(false);

  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), []);

  const togglePopup = () => {
    setIsShowPopup(!isShowPopup);
  };

  return (
    <>
      <Card className="space-between">
        <CardHeader className="flex items-center justify-between">
          <div className="flex-grow">
            <CardTitle className="text-lg font-bold">
              View all the latest happenings around you.
            </CardTitle>
          </div>
          <Button onClick={togglePopup}>Create New Petition</Button>
        </CardHeader>
        <CardContent>
          <div>
            <Map />
          </div>
        </CardContent>
      </Card>

      {isShowPopup && <Popup togglePopup={togglePopup} />}
    </>
  );
}

export default HomePage;
