import { ApButton, ApForm, ApSelectInputAsync, ApTextInput } from '@/components';
import { Form } from 'formik';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useDepartmentState } from '../context';
import { useUserState } from '@/modules/user/context';
import { ApUserSelection } from './select';
import { IUser } from '@/modules/user/model';

interface IProps {
  onDismiss: () => void;
}

const FormSchema = Yup.object().shape({
  name: Yup.string().required('Please fill in the name')
});

const CreateDepartment: React.FC<IProps> = ({ onDismiss }) => {
  const {
    modal: { data: department, type },
    loading,
    createDepartment,
    updateDepartment,
  } = useDepartmentState();
  const { fetchUserPage, users } = useUserState();

  useEffect(() => {
    fetchUserPage({ page: 1, pageSize: 50 });
  }, []);

  const handleSubmit = async (val: any) => {
    let payload = {
      ...val,
      hodId: val?.user?._id
    };

    delete payload.user;

    const promise =
      type === 'update'
        ? updateDepartment(department?._id as any, payload)
        : createDepartment(payload);

    promise.then((res) => {
      if (res) onDismiss();
    });
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<IUser[]>((resolve) => {
      fetchUserPage({ page: 1, pageSize: 50, keyword: inputValue }).then((res) => {
        resolve(res);
      });
    });


  return (
    <div>
      <ApForm
        validationSchema={FormSchema}
        initialValues={{
          name: department?.name || '',
          user: department?.hod
        }}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors }) => {
          return (
            <Form>
              <div className="flex flex-col mb-10 space-y-8 ">
                <ApTextInput placeholder="Name" label="Name" name="name" />
                {/* <ApUserSelection
                  users={users}
                  ignoreFormik
                  name="user"
                  onChange={(user) => setUser(user)}
                /> */}
                <ApSelectInputAsync
                  // createable
                  name={"user"}
                  label={"HOD"}
                  valueKey="_id"
                  labelKey="name"
                  className="w-full"
                  getOptionLabel={(option: any) => option.email}
                  placeholder={"Select HOD"}
                  loadOptions={promiseOptions}
                  // onCreateOption={(val) => {
                  //   setModal({ show: true, data: { accountName: val }, type: 'add' });
                  // }}
                />
                <div className="flex gap-3 ml-auto">
                  <ApButton onClick={() => onDismiss()} btnType="outline" type="button">
                    cancel
                  </ApButton>
                  <ApButton loading={loading} type="submit">
                    Submit
                  </ApButton>
                </div>
              </div>
            </Form>
          );
        }}
      </ApForm>
    </div>
  );
};

export default CreateDepartment;
