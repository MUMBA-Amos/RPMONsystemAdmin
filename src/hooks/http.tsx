import axios from "axios";
import { useSession } from "next-auth/react";
import environment from '../environment';


export const useApAxios = () => {
  const session:any = useSession();

  const api = axios.create({
    baseURL: `${environment.Uri.Api}`,
    headers: {
      Authorization: `Bearer ${session?.data?.token}`,
    },
  });

  return {
    http: api,
  };
};
