import { PublicLayout } from '@/modules/layout';
import { usePermissionState } from '@/modules/permission/context';
import { Form, FormikProps } from 'formik';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import * as Yup from 'yup';
import { ApButton, ApForm, ApTextInput } from '../../../components';

const FormSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Invalid email'),
  password: Yup.string().required('Password is required')
});

export const SigninPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | undefined>('');
  const { findUserAccess } = usePermissionState();

  const handleSubmit = async (values: any, actions: any) => {
    setLoading(true);
    const result: any = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password
    });

    if (!result?.error) {
      await findUserAccess();
      setTimeout(() => {}, 2000);
      router.replace('/');
      setAuthError(result?.error);
    } else {
      setAuthError(result?.error);
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <ApForm
        initialValues={{ email: '', password: '' }}
        validationSchema={FormSchema}
        onSubmit={handleSubmit}
      >
        {(props: FormikProps<any>) => (
          <Form className="max-w-[500px] w-full" autoComplete="off">
            <div className="mb-5 border-b pb-3">
              <h1 className="font-extrabold text-3xl mb-1">Sign In</h1>
              <p className="">Welcome Back</p>
            </div>

            <div className="flex flex-col gap-5 w-full">
              <ApTextInput
                label="Email"
                name="email"
                type="text"
                autoComplete="off"
                placeholder="Enter Email..."
                containerClassName="!w-full"
              />

              <ApTextInput
                label="Password"
                name="password"
                type="password"
                autoComplete="off"
                placeholder="Enter Password..."
                containerClassName="!w-full"
              />
            </div>

            <div className="flex justify-between mt-2">
              <span className="error-message block text-base text-red-500">{authError}</span>

              <div className="flex gap-3">
                <Link href="/onboarding" className="text-xs block font-bold text-primary">
                  Register
                </Link>
                <Link href="/forgot-password" className="text-xs block font-bold text-primary">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="text-center w-full mt-8 mb-5">
              <ApButton
                className={`!w-full font-bold ${loading ? '!py-2.5' : '!py-4'}`}
                type="submit"
                title="Sign In"
                loading={loading}
              />
            </div>
          </Form>
        )}
      </ApForm>
    </PublicLayout>
  );
};
