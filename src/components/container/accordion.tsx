import React, { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5';

interface IProps {
  title?: string;
  expanded?: boolean;
  noHeader?: boolean;
  children?: React.ReactNode;
  expandedChildren?: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  containerClassName?: string | undefined;
}

export const ApAccordion: React.FC<IProps> = (props: IProps) => {
  const {
    title,
    noHeader,
    headerLeft,
    expanded,
    headerRight,
    expandedChildren,
    children,
    containerClassName
  } = props;

  const [expand, setExpand] = React.useState(expanded);

  useEffect(() => {
    setExpand(expanded);
  }, [expanded]);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  return (
    <div className={`bg-alt-light mb-2 p-2 rounded-sm ${containerClassName}`}>
      {noHeader ? null : (
        <div className="flex justify-between mb-2 pb-2 border-b-divider border-b-2">
          <div>
            {headerLeft}
            <span>{title}</span>
          </div>

          <div className="flex gap-2">
            {headerRight}
            {expandedChildren ? (
              expand ? (
                <IoChevronUpOutline onClick={toggleExpand} size={22} />
              ) : (
                <IoChevronDownOutline onClick={toggleExpand} size={22} />
              )
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
      <div>{children}</div>
      {expand && <div>{expandedChildren}</div>}
    </div>
  );
};
