import { Form, Formik, FormikProps } from "formik";
import React from "react";
import * as Yup from "yup";
import { ApButton, ApTextInput } from "../../../../components";
import { useProfileState } from "../../../profile/context";
import { usePasswordState } from "../context";

const FormSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old Password is required"),
  newPassword: Yup.string().required("New Password is required"),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref("newPassword")],
    "New password does not match"
  ),
});
interface IProps {
  onDissmiss: () => void;
}
export const ChangePassword: React.FC<IProps> = ({ onDissmiss }) => {
  const {changePassword, loading}= usePasswordState()
  const handleSubmit = (values: any) => {
    changePassword(values.oldPassword, values.newPassword).then((res: any) => {
     res && onDissmiss()
    })
  };

  return (
    <div>
      <div className="">
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
          }}
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
        >
          {(props: FormikProps<any>) => (
            <Form className="flex flex-col gap-3">
              <ApTextInput
                label="Old Password"
                name="oldPassword"
                type="password"
                className="w-full   border  outline-none"
              />
              <ApTextInput
                label="New Password"
                name="newPassword"
                type="password"
                className="w-full   border  outline-none"
              />
              <ApTextInput
                label="Confirm New Password"
                name="confirmNewPassword"
                type="password"
                className="w-full   border  outline-none"
              />

              <div className="flex items-center justify-end">
                <ApButton
                  title={`Submit`}
                  type="submit"
                  loading={loading}
                  className="bg-cyan-500 text-white text-sm p-2"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
