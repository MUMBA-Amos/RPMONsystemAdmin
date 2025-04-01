import { toast } from 'react-toastify';

export const toastSvc = {
  success: (msg: string) => {
    toast.success(msg, {
      hideProgressBar: true
    });
  },
  error: (msg: string) => {
    if (msg === 'Unauthorized') {
      return;
    }

    toast.error(msg, { hideProgressBar: true });
  },
  graphQlError: (error: any) => {
    const err =
      error.graphQLErrors && error.graphQLErrors.length > 0
        ? error.graphQLErrors
        : error.networkError && error.networkError.result
          ? error.networkError.result.errors
          : [];

    toast.error(err?.map((e: any) => e.message).toString(), {
      bodyStyle: { minHeight: 200 }
    });
  }
};
