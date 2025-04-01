import React from "react";
import { BsFillStarFill } from "react-icons/bs";

interface IProps {
  ratingValue: number;
  rateFunction?: () => void;
}

export const ApRating: React.FC<IProps> = ({ ratingValue, rateFunction }) => {
  return (
    <div className="flex">
      <BsFillStarFill
        className={`${ratingValue >= 1 ? "text-orange-400" : "text-gray-200"}`}
      />
      <BsFillStarFill
        className={`${ratingValue >= 2 ? "text-orange-400" : "text-gray-200"}`}
      />
      <BsFillStarFill
        className={`${ratingValue >= 3 ? "text-orange-400" : "text-gray-200"}`}
      />
      <BsFillStarFill
        className={`${ratingValue >= 4 ? "text-orange-400" : "text-gray-200"}`}
      />
      <BsFillStarFill
        className={`${ratingValue == 5 ? "text-orange-400" : "text-gray-200"}`}
      />
    </div>
  );
};
