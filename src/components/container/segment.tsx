import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

interface Item {
  label: string;
  key: string;
  children?: (props: { setActive: (index: number) => void }) => void | any;
}

interface IProps {
  activeKey?: string;
  items: Array<Item>;
  btnClassName?: string;
  containerClassName?: string;
  btnContainerClassName?: string;
  ref?: React.LegacyRef<HTMLInputElement> | undefined;
  onSelect?: (index: number) => void;
}

export const ApSegment = forwardRef((props: IProps, ref) => {
  const { items, onSelect, containerClassName, btnContainerClassName, btnClassName, activeKey } =
    props;
  const [active, setActive] = useState<Item>(items[0]);

  useEffect(() => {
    if (activeKey) {
      const newActive = items.find((item) => item.key === activeKey);
      if (newActive) setActive(newActive);
    }
  }, [activeKey, items]); // Runs when `activeKey` changes

  const handleOnSelect = (index: number) => {
    setActive(items[index]);
    if (onSelect) onSelect(index);
  };

  // Expose a function to set cursor position externally
  useImperativeHandle(ref, () => ({
    setActive: handleOnSelect
  }));

  return (
    <div>
      <div className={`${containerClassName}`}>
        <div
          className={` ${btnContainerClassName}
                        flex p-1.5 rounded-lg w-full flex-col
                       `}
        >
          <div className="flex mb-5">
            {items?.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleOnSelect(i)}
                className={` ${btnClassName}
                                w-[50%] flex items-center justify-center p-2 cus-xs:p-2 text-sm
                                ${item.key === active.key && 'border-b border-primary '}
                            `}
              >
                {item?.label}
              </button>
            ))}
          </div>

          <>
            {typeof active.children === 'function'
              ? active.children({ setActive: handleOnSelect })
              : (active.children as any)}
          </>
        </div>
      </div>
    </div>
  );
});
