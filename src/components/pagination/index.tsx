import React, { useState } from "react";
import ReactPaginate from "react-paginate";
interface IProps {
  initialPage: number;
  pageCount: number;
  onPageChange: (e: any) => void;
}

export const ApPagination: React.FC<IProps> = ({
  initialPage,
  pageCount,
  onPageChange,
}) => {
  const [isInit, setisInit] = useState(true);

  return (
    <>
      <ReactPaginate
        className="flex gap-4 justify-center w-full fixed bottom-0 left-12  mt-1 p-2  py-3"
        initialPage={initialPage}
        pageCount={pageCount}
        breakLabel="..."
        pageRangeDisplayed={4}
        marginPagesDisplayed={4}
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        previousLinkClassName={"bg-cyan-500 text-white rounded px-2 py-2 w-40"}
        nextLinkClassName={"bg-cyan-500 text-white rounded px-2 py-2 w-40"}
        onPageChange={(e: any) => {
          if (!isInit) onPageChange(e);
          else setisInit(false);
        }}
        activeClassName={"bg-orange-600 rounded-full px-2 text-white"}
        containerClassName={"pagination pt-4 pb-10"}
        renderOnZeroPageCount={() => null}
        //   renderOnZeroPageCount={null}
      />
     
    </>
  );
};
