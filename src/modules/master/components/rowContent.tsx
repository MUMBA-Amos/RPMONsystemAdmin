import React from "react";
import { IMaster } from "../model";
import { ApText } from "../../../components";
import { FiEdit } from "react-icons/fi";
import { Popconfirm } from "antd";

interface IProps {
  master: IMaster;
  onDelete: (master: IMaster) => void;
}
export const MasterRowContent: React.FC<IProps> = ({ master, onDelete }) => {
  return (
    <div>
      <div className="flex gap-[18rem]">
        <ApText className="ml-12">{master?.name}</ApText>
        <ApText>{master?.key}</ApText>
        <Popconfirm
          okButtonProps={{ className: "bg-primary" }}
          placement="top"
          title={"Delete Master child"}
          onConfirm={() => {
            onDelete(master);
          }}
          okText="Yes"
          cancelText="No"
        >
          <FiEdit size={20} color="danger" />
        </Popconfirm>
      </div>
    </div>
  );
};
