import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { ApButton, ApImage, ApTextInput } from "../../../../components";
import msgldLogo from "../../../../assets/logo.png";
import * as Yup from "yup";
import { PasswordContextProvider, usePasswordState } from "../context";
import Link from "next/link";

const FormSchema = Yup.object().shape({
  email: Yup.string()
    .email("valid email is required")
    .required("email is required"),
});

const ForgotPasswordPage = () => {
  const { forgotPassword, loading } = usePasswordState();

  const handleSubmit = (values: any) => {
    forgotPassword(values.email);
  };

  return (
    <div className="h-screen flex bg-gray-50 items-center justify-center rounded-xl px-5">
      <div className="w-full max-w-[400px] h-auto relative rounded-xl flex flex-col justify-center mx-auto shadow-md px-5  bg-white">
        <div className="my-10">
          <div className="flex justify-center py-4 mb-3">
            <ApImage alt="" src={msgldLogo} width={200} height={200} />
          </div>
          <h1 className="text-2xl font-bold  text-center">Forgot Password</h1>
        </div>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
        >
          {(props: FormikProps<any>) => (
            <Form className=" Form card md:p-2">
              <ApTextInput
                placeholder="Enter Email..."
                label="Email"
                name="email"
                type="text"
                className="rounded-md h-11 mt-2"
              />
              <div>
                <Link href="/login" className="text-xs lowercase block text-right font-bold text-orange-400">
                  back to Sign in
                </Link>
              </div>

              <div className="text-center w-full mt-8 mb-5">
                <ApButton
                  className="text-center capitalize w-full h-11 border rounded-lg p-2 font-bold text-white  my-2"
                  title="Submit"
                  type="submit"
                  onClick={props.handleSubmit}
                  loading={loading}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
