/**  
 * 
 * <ApLookupInput
    rowKey="_id"            -- unique id
    rowValue="accountName"  -- name to display in input
    label="Default Sales Cash Account" -- input label display
    name="defaultSalesCashAcount" -- input object mapping
    options={accounts} -- table list
    pagination={false} -- enable or disable pagination
    columns={accountColumns} -- table column defination
    />
*/

/***
 * validation sameple with formik
 * const FormSchema = Yup.object().shape({
      prop: Yup.object().shape({
        [rowKey]: Yup.string().required("prop is required"),
      })
  )}
 */

import { CloseOutlined } from '@ant-design/icons';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useField } from 'formik';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { GoChevronDown } from 'react-icons/go';
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager';
import { ApButton } from '../button';
import { ApPopover, IApPopOverRef } from '../modal';
import ApTable from '../table';
import { ApText } from '../typography';

const getDefaultValue = ({ ignoreFormik, defaultValue, fieldHelper, rowValue }: any) => {
  if (ignoreFormik) {
    return Array.isArray(defaultValue) && !!defaultValue?.length
      ? defaultValue?.map((s: any) => s[rowValue]).join(',')
      : defaultValue && (defaultValue as IModel)[rowValue];
  }

  if (fieldHelper?.[0] && fieldHelper?.[0]?.value) {
    return Array.isArray(fieldHelper?.[0]?.value) && !!fieldHelper?.[0]?.value?.length
      ? fieldHelper?.[0].value &&
          !!fieldHelper?.[0].value?.length &&
          fieldHelper?.[0]?.value?.map((s: any) => s[rowValue]).join(',')
      : fieldHelper?.[0]?.value && fieldHelper?.[0]?.value[rowValue];
  }
};

interface IModel {
  value: string;
  label: string;
  children?: IModel[];
  [x: string]: string | any;
}

interface IProps extends StateManagerProps {
  label?: string;
  name: string;
  disabled?: boolean;
  isMulti?: boolean;
  capitalize?: boolean;
  placeholder?: string;
  options: Array<IModel | any>;
  className?: string;
  ignoreFormik?: boolean;
  defaultValue?: IModel | IModel[] | undefined;
  columns?: ColumnsType<any> | undefined;
  pagination?: false | TablePaginationConfig | undefined;
  header?: React.ReactNode;
  noData?: React.ReactNode;
  rowKey?: string | number;
  rowValue?: string;
  overlayClassName?: string | undefined;
  ref?: React.Ref<IApPopOverRef | undefined>;
  onConfirm?: (value?: any) => void;
  onChange?: (value?: any) => void;
}

export const ApLookupInput: React.FC<IProps> = forwardRef((props, ref) => {
  const {
    label,
    pagination,
    options,
    isMulti,
    name,
    capitalize,
    header,
    rowKey = 'label',
    rowValue = 'value',
    disabled,
    placeholder,
    ignoreFormik,
    className,
    noData,
    defaultValue,
    overlayClassName,
    onConfirm,
    onChange
  } = props;
  const fieldHelper = ignoreFormik ? null : useField(name);
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    isMulti ? 'checkbox' : 'radio'
  );
  const [inputValue, setInputValue] = useState<any>(null);
  const [selectedValues, setSelectedValues] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const dValue = getDefaultValue({
    ignoreFormik,
    defaultValue,
    fieldHelper,
    rowValue
  });

  const popoverRef: any = useRef();

  // Expose the doSomething method to the parent component
  useImperativeHandle(ref, () => ({
    toggle: popoverRef.current.toggle
  }));

  useEffect(() => {
    setInputValue(dValue);
    setSelectionType(isMulti ? 'checkbox' : 'radio');
  }, [dValue]);

  const columns = props.columns || [
    {
      title: 'Name',
      dataIndex: 'label',
      key: 'label',
      render: (value: string, record: any) => <>{value?.toUpperCase()} </>
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      align: 'right',
      render: (_: any, record: any) => <> </>
    }
  ];

  const handleRowSelectionChange = (selectedRowKeys: any, selectedRows: IModel[]) => {
    setSelectedRowKeys(selectedRowKeys);
    updateFormField(isMulti ? selectedRows : selectedRows[0]);
    updateChange(isMulti ? selectedRows : selectedRows[0]);
    setInputValue(
      isMulti
        ? selectedRows?.map((s: any) => s[rowValue]).join(',')
        : selectedRows[0] && selectedRows[0][rowValue]
    );
  };

  const handleUnselectRow = (record: any) => {
    const updatedSelectedRowKeys = selectedRowKeys.filter((key) => key !== record.key);
    setSelectedRowKeys(updatedSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectionChange,
    getCheckboxProps: (record: IModel) => ({
      value: record.value
    })
  };

  const handleCancel = () => {
    setSelectedRowKeys([]);
    updateFormField(dValue);
    updateChange(null);
    popoverRef.current.toggle();
  };

  const handleClear = () => {
    setInputValue('');
    setSelectedRowKeys([]);
    updateFormField(isMulti ? [] : {});
    updateChange(null);
    if (onConfirm) onConfirm(null);
  };

  const updateFormField = (val: any) => {
    if (!ignoreFormik) {
      fieldHelper?.[2]?.setValue(val);
    }
  };

  const updateChange = (val: any) => {
    if (onChange) {
      onChange(val);
    }
    setSelectedValues(val);

    if (!isMulti && val) {
      handleConfirm(val);
    }
  };

  const handleConfirm = (val?: any) => {
    popoverRef?.current?.toggle();
    if (onConfirm) onConfirm(val || selectedValues);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <ApText className="mb-2 font-normal cus-sm2:text-xs" size="sm">
          {label}
        </ApText>
      )}

      <div className="flex mt-1">
        <ApPopover
          overlayClassName={`max-w-[700px] ${overlayClassName}`}
          content={
            <div className="flex flex-col">
              <div className="flex justify-between mt-5 mb-5">
                <ApText className="text-lg font-semibold">{placeholder || 'Select'}</ApText>

                <CloseOutlined onClick={handleCancel} />
              </div>
              <div> {header}</div>
              <div className="flex flex-col gap-5 max-h-[75vh] overflow-scroll">
                <ApTable
                  rowSelection={{
                    type: selectionType,
                    ...rowSelection
                  }}
                  columns={columns}
                  rowKey={rowKey}
                  dataSource={options}
                  pagination={pagination}
                  tableLayout="fixed"
                  className="max-h-[70vh]"
                  locale={{ emptyText: noData }}
                />
              </div>

              <div className="flex justify-end w-full gap-5 mt-5">
                <ApButton
                  className="h-8 w-22"
                  btnType="danger"
                  type="button"
                  title="Cancel"
                  onClick={handleCancel}
                />
                <ApButton
                  className="h-8 w-22"
                  title="Confirm"
                  type="button"
                  onClick={handleConfirm}
                />
              </div>
            </div>
          }
          ref={popoverRef}
        >
          <div className="relative w-full">
            <input
              value={capitalize ? inputValue?.toUpperCase() : inputValue}
              placeholder={placeholder || 'Select'}
              disabled={disabled || false}
              className={`
                border px-3 text-[13px] outline-none w-full h-[45px] rounded-sm
                focus:border-gray-400 focus:h-[45px]
              `}
              onClick={() => popoverRef.current.toggle()}
            />

            <div className="absolute top-0 right-0 flex items-center h-full pr-2">
              {inputValue ? (
                <CloseOutlined className="mx-2 text-slate-500" onClick={handleClear} />
              ) : (
                <></>
              )}
              <div className="border-l pr-2 h-[50%]" />
              <GoChevronDown onClick={() => popoverRef.current.toggle()} />
            </div>
          </div>
        </ApPopover>
      </div>

      {!ignoreFormik && (fieldHelper?.[1] as any)?.error && (
        <div className="text-red-500">{(fieldHelper?.[1] as any)?.error[rowKey]}</div>
      )}
    </div>
  );
});
