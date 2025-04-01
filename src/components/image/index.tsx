import Image, { ImageProps } from "next/image";
import React from "react";

interface IProps extends ImageProps {
}

export const ApImage: React.FC<IProps> = (props: IProps) => {
  return (
    <Image
      // width={props.width || 200}
      // height={props.width || 200}
      className="object-cover"
      {...props}
      src={props.src || "https://placehold.co/600x400"}
      alt="image"
    />
  );
};
