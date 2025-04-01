import { ApButton, ApSearchInput, ApSelectInput } from '@/components';
import React, { useEffect } from 'react';
import { useGrantState } from '../grant/context';
import { IGrant } from '../grant/model';
import { useRouter } from 'next/router';
import { ApDateTime } from '@/components/date';

export default function GrantsPage() {
  const { setFilter, filter, grants, fetchGrants, loading, totalRecords, removeGrant } =
    useGrantState();

  useEffect(() => {
    fetchGrants(filter);
  }, [filter]);

  return (
    <div className="p-10 flex-1">
      <div className="border rounded-lg overflow-hidden flex-1 h-full">
        <div className="bg-gray-200 p-5">
          <p className='text-primary font-bold text-2xl mb-5'>Grants</p>
          <div className='flex gap-5 w-full'>
            <ApSearchInput placeholder='Search by name' onSearchChange={() => { }} containerClassName='w-full' />
            <ApSelectInput ignoreFormik name='search' options={[]} containerClassName='w-full' />
          </div>
        </div>

        <div className="flex flex-col gap-5 p-5">
          {grants?.length > 0 ? (
            grants?.map((item, i) => <GrantItem item={item} key={i} />)
          ) : (
            <div className="p-20 items-center justify-center flex">
              <p>No Data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const GrantItem = ({ item }: { item: IGrant }) => {
  const router = useRouter()

  return (
    <div className="border-b pb-5">
      <p className="font-semibold mb-2">Name: {item?.name}</p>

      <div className='grid grid-cols-4 gap-5'>
        <div>
          <p className="">Cluster: </p>
          <p>  {item?.cluster?.name} </p>
        </div>
        <div>
          <p className="">Scheme: </p>
          <p>{item?.scheme?.name}</p>
        </div>

        <div>
          <p className="">From Date: </p>
          <ApDateTime date={item?.fromDate} />
        </div>


        <div>
          <p className="">To Date:</p>
          <ApDateTime date={item?.toDate} />
        </div>
      </div>


      <p className='font-semibold mt-10'>Detail</p>
      <p className="leading-loose text-sm">
        {item?.description}
      </p>

      <div className="flex justify-end mt-5">
        <ApButton onClick={() => router?.push(`/grants/${item?._id}/apply`)} title="APPLY" className="!w-[150px] !py-1 rounded-lg" />
      </div>
    </div>
  );
};
