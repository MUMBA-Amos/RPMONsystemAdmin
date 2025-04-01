import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { ApText } from "../typography";

interface IProps {
  label?: string;
  name: string;
  selected?: string;
  disabled?: boolean;
  onChange?: (value: any) => void;
  containerClassName?: string | undefined;
  items: Array<{ value: string; label: string }>;
}

export const ApDropDown: React.FC<IProps> = ({
  items,
  label,
  selected,
  disabled,
  onChange,
  containerClassName,
}) => (
  <div className={`flex flex-col w-44 ${containerClassName}`}>
    {/* {label && <ApText className="cus-sm2:text-xs mb-2" size="sm">{label}</ApText>} */}
    <Dropdown
      trigger={["click"]}
      menu={{
        items: items?.map((itm) => ({ ...itm, key: itm.value })),
        onClick: (info) => {
          if (onChange) onChange(info?.key);
        },
      }}
      className={`px-3 py-2 h-11 rounded-sm border border-solid border-gray-300 `}
      disabled={disabled}
    >
      <a
        onClick={(e) => e.preventDefault()}
        className="flex flex-row items-center justify-between"
      >
        {label && <ApText className="cus-sm2:text-xs" size="sm">{label}</ApText>}
        <DownOutlined size={10} rev={undefined} />
      </a>
    </Dropdown>
  </div>
);
