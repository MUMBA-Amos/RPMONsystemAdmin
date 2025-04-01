import React from 'react';


export default function GrantApplicationTab({ current, setCurrent, items }: any) {
  return (
    <div className="flex gap-5">
      {items?.map((item:any, i:number) => (
        <button
          onClick={() => {
            setCurrent(item)
          }}
          className={`text-primary pb-2 ${current == item && 'border-b border-primary'}`}
          key={i}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
