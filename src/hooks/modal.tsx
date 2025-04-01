import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, ModalFuncProps } from "antd";

export const useApConfirmModal = () => {
  const [modal, contextHolder] = Modal.useModal();

  const ApConfirmModal = (props: ModalFuncProps) => {
    modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined rev={undefined} />,
      okText: "Confirm",
      cancelText: "Cancel",
      okButtonProps: {
        ...{
          className:
            "bg-white border border-primary text-primary text-sm uppercase rounded-lg px-4",
        },
        ...props.okButtonProps,
      },
      type: "confirm",
      ...props,
    });
  };

  return {
    confirmContextHolder: contextHolder,
    ApConfirmModal,
  };
};
