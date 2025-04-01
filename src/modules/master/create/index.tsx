import { Form, Formik, FormikProps } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { ApButton } from '../../../components';
import { ApFileInput, ApTextInput } from '../../../components/input';
import { useMasterState } from '../context';
import { IMaster } from '../model';

const FormSchema = Yup.object().shape({
  name: Yup.string().required('name is required'),
  key: Yup.string()
});

interface IProps {
  master?: IMaster;
  key?: string;
  addChild?: boolean;
  onDismiss?: (res?: IMaster) => void;
  type?: 'parent' | 'child';
}

const CreateMaster: React.FC<IProps> = ({ master, onDismiss, addChild, type }) => {
  const { saveMaster, updateLoading } = useMasterState();
  const [file, setFile] = useState<any>();

  const handleSubmit = (values: any, actions: any) => {
    let promise;

    let payload = {
      ...values,
      categories: values?.categories?.map((c: any) => c.value)
    };

    if (addChild) payload = { ...payload, parentId: master?.parentId };

    if (file) {
      payload.file = {
        filename: file.filename,
        base64Str: file.base64Str,
        filetype: file.filetype
      };
    }

    promise = saveMaster(master?._id as string, payload);

    promise.then((res: any) => {
      if (res && onDismiss) onDismiss(res);
    });
  };

  const handleImage = async (res: any) => {
    if (!!res?.length) {
      const fl = res[0];
      setFile({
        filename: fl?.file?.name,
        base64Str: fl?.uri,
        filetype: fl?.file?.type
      });
    }
  };

  return (
    <div className="justify-center items-center mt-4">
      <div className="bg-white">
        <Formik
          initialValues={{
            name: master?.name || '',
            categories: !!master?.categoryList?.length
              ? master?.categoryList?.map((c) => ({
                  value: c._id,
                  label: c.name
                }))
              : [],
            key: (addChild ? '' : master?.key) || ''
          }}
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
        >
          {(props: FormikProps<any>) => (
            <Form className="flex flex-col gap-2">
              <ApTextInput
                label="Name"
                name="name"
                type="text"
                className="w-full py-2 bg-gray-50  border border-black px-2 mb-1 outline-none"
              />

              {type === 'parent' && (
                <>
                  <ApTextInput
                    label="Key"
                    name="key"
                    type="text"
                    className="w-full py-2 bg-gray-50 border border-black px-2 mb-1 outline-none"
                  />
                </>
              )}

              {master?.parent?.key === 'gender' && (
                <ApFileInput
                  ignoreResize
                  maxCount={1}
                  defaultFileList={
                    master?.image
                      ? [
                          {
                            uid: master?.image?._id,
                            url: master?.image?.uri,
                            name: master?.image?.uri
                          }
                        ]
                      : []
                  }
                  accept={'image/*'}
                  onSelected={(res: any) => {
                    if (res) {
                      handleImage(res);
                    }
                  }}
                />
              )}

              <div className="flex justify-end pt-5 mb-4">
                <ApButton
                  type="submit"
                  className="bg-cyan-500 text-white  px-4"
                  title={`${master?._id ? 'Update' : 'Create'}`}
                  loading={updateLoading}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default CreateMaster;
