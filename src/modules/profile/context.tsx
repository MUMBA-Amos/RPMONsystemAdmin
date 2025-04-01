import React, { useState } from "react";
import { createContext } from "react";
import { toastSvc } from "../../services";
import {
  useChangePassword,
  useProfilePage,
  useUpdateProfile,
} from "./gql/query";
import { IProfile, ProfilePages } from "./model";

interface IProfileState {
  loading: boolean;
  updateLoading: boolean;
  fetchProfilePage: () => void;
  handleSetCurrentProfilePage: (page: string) => void;
  profile: IProfile;
  updateProfile: (values: any) => void;
}

const ProfileContext = createContext<IProfileState>({
  loading: true,
  updateLoading: false,
  fetchProfilePage() {},
  handleSetCurrentProfilePage(page) {},
  profile: {},
  updateProfile(values: any) {},
} as IProfileState);

export const useProfileState = () => {
  const context = React.useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("app dispatch must be used within app global provider");
  }

  return context;
};
interface IProps {
  children: React.ReactNode;
}
export const ProfileContextProvider: React.FC<IProps> = ({ children }) => {
  const [profile, setProfile] = useState<IProfile>({} as any);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [fetchProfile, { loading }] = useProfilePage((res: any) => {
    setProfile(res);
  });

  const updateQuery = useUpdateProfile((res: any) => {
    toastSvc.success("Profile updated");
  });

  const updatePasswordQuery = useChangePassword((res: any) => {
    toastSvc.success("Password updated");
  });

  const fetchProfilePage = () => {
    fetchProfile();
  };

  const handleSetCurrentProfilePage = (page: string) => {};

  const updateProfile = (values: any) => {
    setUpdateLoading(true);
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      otherName: values.otherName,
      username: values.username,
    };

    if (profile?.id) {
      updateQuery[0]({
        variables: {
          account: {
            ...payload,
          },
        },
      }).then((rs) => {
        setUpdateLoading(false);
        setProfile(rs?.data?.updateAccount);
      });
    }
  };

  const updatePassword = (values: any): Promise<String> => {

    let req = null;
    setUpdateLoading(true);
    req = updatePasswordQuery[0]({
      variables: {
        password: { ...values },
      },
    }).finally(() => {
      setUpdateLoading(false);
    });

    return req.then((res) => {
      return res;
    }) as any;
  };

  return (
    <ProfileContext.Provider
      value={{
        loading,
        updateLoading,
        fetchProfilePage,
        handleSetCurrentProfilePage,
        profile,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
