import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload, UploadProps } from "antd";
import { useSession } from "next-auth/react";
import environment from "../../environment";

interface IProps {
  endpoint: string;
  label: string;
  onCompleted: () => void;
}

export const ApUploadButton: React.FC<IProps> = ({
  endpoint,
  label,
  onCompleted,
}) => {
  const session:any = useSession();

  const props: UploadProps = {
    name: "file",
    accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    action: `${environment.Uri.Api}/${endpoint}`,
    headers: {
      authorization: `Bearer ${session?.data?.token}`,
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        onCompleted();
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Upload {...props}>
      <Button
        className="bg-green-600 text-white text-sm w-32 h-11"
        icon={<UploadOutlined rev={undefined} />}
      >
        {label}
      </Button>
    </Upload>
  );
};
