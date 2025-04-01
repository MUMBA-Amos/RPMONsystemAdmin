import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const DashboardOverview = () => {
  const {data} = useSession()
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-center font-poppins py-4 md:py-6">
        <div className="flex items-center gap-2">
        <FaUserCircle className='text-primary' size={70}/>
          {/* <Image src="/profile.png" width={70} height={70} alt="profile" /> */}
          <div className="flex flex-col">
            <span className="text-black text-lg">Welcome!</span>
            <span className="text-primary text-2xl font-semibold">{data?.user?.name}</span>
          </div>
        </div>
        <Link href="/grants" className="text-primary text-xl">
          Apply For Grants With Ease!
        </Link>
      </div>
    </div>
  );
};

export default DashboardOverview;
