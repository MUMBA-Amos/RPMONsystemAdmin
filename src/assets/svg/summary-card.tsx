import * as React from 'react';
const SummaryCardSvg = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={526} height={96} fill="none" {...props}>
    <path
      d="M102.858 26.4964L0 84.0741V227H595V0L494.396 84.0051L404.966 63.2969L304.264 159.209L203.561 121.062L102.858 26.4964Z"
      fill={props?.pathFill || '#FFFBF0'}
    />
  </svg>
);
export default SummaryCardSvg;
