import React from "react";
import { ApButton, ApImage, ApTextInput } from "../../../../components";
import { Form, Formik, FormikProps } from "formik";
import msgldLogo from "../../../../assets/logo.png";

const ResetPasswordPage = () => {
  const handleSubmit = () => {};

  return (
    <div className="h-screen flex bg-gray-50 items-center justify-center rounded-xl">
      <div className="w-1/4 h-auto border relative rounded-xl flex flex-col justify-center  mx-auto shadow-md px-8  bg-white">
        <div className="my-10">
          <div className="text-center py-4 mb-3">
            <ApImage alt="" src={msgldLogo} width={200} height={200} />
          </div>
          <h1 className="text-2xl font-bold  text-center">Reset Password</h1>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          //   validationSchema={FormSchema}
          onSubmit={handleSubmit}
        >
          {(props: FormikProps<any>) => (
            <Form className=" Form card md:p-2">
              <ApTextInput
                placeholder="Enter New Password..."
                label="New Password"
                name="email"
                type="text"
                className="rounded-md"
              />
              <ApTextInput
                placeholder="Confirm New Password..."
                label="Confirm Password"
                name="email"
                type="text"
                className="rounded-md"
              />
              <div className="text-center w-full mt-2 mb-10">
                <ApButton
                  className="text-center w-full bg-cyan-500 border rounded-xl p-2 font-bold text-white  my-2"
                  type="submit"
                  title="Change Password"
                  // loading={loading}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
