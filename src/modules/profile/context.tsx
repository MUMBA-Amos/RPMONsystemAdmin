import React, { useState } from 'react';
import { createContext } from 'react';
import { toastSvc } from '../../services';
import { IProfile } from './model';
import { useProfileQuery } from './gql/query';

interface IProfileState {
  loading: boolean;
  updating: boolean;
  profile: IProfile;
  setProfile: (profile: IProfile) => void;
  fetchProfile: () => void;
  createProfile: (payload: IProfile) => Promise<IProfile>;
  updateProfile: (_id: string, payload: IProfile) => Promise<IProfile>;
}

const ProfileContext = createContext<IProfileState | undefined>(undefined);

export const useProfileState = () => {
  const context = React.useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('app dispatch must be used within app global provider');
  }

  return context;
};
interface IProps {
  children: React.ReactNode;
}

export const ProfileContextProvider: React.FC<IProps> = ({ children }) => {
  const profileQuery = useProfileQuery();
  const [profile, setProfile] = useState<IProfile>({} as any);
  const [profiles, setProfiles] = useState<IProfile[]>([]);
  const [updating, setUpdating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProfile = async (): Promise<IProfile[]> => {
    return profileQuery.page().then((res) => {
      const data = res?.data?.profilePage;
      if (data) {
        setProfiles(data?.data);
        return data.data;
      }
      return [];
    });
  };

  const createProfile = async (payload: IProfile): Promise<IProfile> => {
    setUpdating(true);
    return profileQuery
      .create({ variables: { profile: payload } })
      .then((res) => {
        const data: IProfile = res?.data?.createProfile;
        return data;
      })
      .finally(() => setUpdating(false));
  };

  const updateProfile = async (_id: string, payload: IProfile): Promise<IProfile> => {
    setUpdating(true);
    return profileQuery
      .update({ variables: { _id, profile: payload } })
      .then((res) => {
        const data: IProfile = res?.data?.updateProfile;
        setProfile(data)
        return data;
      })
      .finally(() => setUpdating(false));
  };

  return (
    <ProfileContext.Provider
      value={{
        loading,
        updating,
        profile,
        fetchProfile,
        createProfile,
        updateProfile,
        setProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
