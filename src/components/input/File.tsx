import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { Upload } from 'antd';
import { UploadListType } from 'antd/es/upload/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { fileSvc } from '../../services/file';

const { Dragger } = Upload;

interface IProps {
  label?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  inputId?: string;
  className?: string;
  accept?: string;
  multiple?: boolean;
  title?: string;
  maxCount?: number;
  noUpload?: boolean;
  btnClassName?: string | undefined;
  containerClassName?: string | undefined;
  listType?: UploadListType;
  ignoreResize?: boolean;
  defaultFileList?: UploadFile<any>[] | undefined;
  labelClassName?: string;
  uploadButton?: React.ReactNode | undefined;
  onSelected: (files: Array<any>) => void;
  onRemove?: (file: UploadFile) => void;
  onLoading?: (loading: boolean) => void;
}

let onChanging = false;

export const ApFileInput: React.FC<IProps> = (props: IProps) => {
  const {
    onSelected,
    multiple,
    maxCount = 1,
    btnClassName,
    containerClassName,
    accept,
    onRemove,
    label,
    icon,
    noUpload,
    onLoading,
    listType = 'picture-card',
    placeholder,
    defaultFileList,
    labelClassName,
    uploadButton
  } = props;
  let timeout: any = null;
  const [fileList, setFileList] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onLoading && onLoading(loading);
  }, [loading]);

  const handleOnChange = useCallback(
    async (fls: any) => {
      if (timeout) clearTimeout(timeout);

      if (fls && fls.length > 0) {
        let files: any = [];
        for await (const f of fls) {
          files.push({
            uri: await fileSvc.fileToBase64(f),
            file: f,
            uid: f.uid
          });
        }

        timeout = setTimeout(() => {
          onSelected(files);
        }, 1000);
      }

      setLoading(false);
    },
    [fileList]
  );

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: multiple,
    accept: accept,
    // disabled:true,
    defaultFileList: defaultFileList,
    listType: listType,
    style: { display: 'flex', flexDirection: 'row' },
    maxCount: maxCount || 5,
    async onChange(info: any) {
      if (onChanging) return;
      onChanging = true;
      setFileList(info.fileList);
      await handleOnChange(
        info.fileList.filter((f: any) => f.originFileObj).map((f: any) => f.originFileObj)
      );

      setLoading(true);
      onChanging = false;
    },
    async onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    async onRemove(file) {
      onRemove && onRemove(file);
    }
  };

  const RenderUploadButton = (
    <div className={`flex flex-col items-center ${btnClassName}`}>
      {icon || <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{loading ? 'Loading..' : placeholder || 'Upload'}</div>
    </div>
  );

  return (
    <div className={`rounded-sm ${containerClassName}`}>
      {label && <p className={`mb-2 text-sm cus-sm2:text-xs ${labelClassName}`}>{label}</p>}
      <Upload {...uploadProps}>
        {fileList.length >= maxCount || noUpload ? null : uploadButton || RenderUploadButton}
      </Upload>
    </div>
  );
};
