import React, { useEffect, useState } from "react";
import { ApBodyContainer, ApButton, ApLoader, ApModal, ApPageHeader, ApText } from "../../components";
import helper from "../../helper";
import { useProfileState } from "./context";
import { IProfile, ProfilePages } from "./model";
import { FaUser } from "react-icons/fa";
import { ChangePassword } from "../auth/password/change/page";

interface IProps {
  profile: IProfile;
}

export const ProfilePage: React.FC<IProps> = ({ profile }) => {
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);

  return (
    <div>
      <ApPageHeader
        title={'Profile'}
        right={
          <ApButton
          title="Change Password"
          onClick={() => setShowPasswordModal(true)}
          className="h-11"
          />
        }
      />

      {/** This should be introduced when we start accepting/providing profile images */}

      {/* <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-stone-400">
          <FaUser size={30} color="white" />
        </div>
        <div>
          <ApText className="font-bold">{profile?.email}</ApText>
          <ApText>{profile?.name}</ApText>
        </div>
      </div> */}
      
      <ApBodyContainer>
        <div className="grid items-center grid-cols-2 gap-5 cus-sm2:grid-cols-1">
          <div>
            <ApText className="mb-2">Name</ApText>
            <div className="p-2 border rounded-md shadow-sm bg-stone-200">
              <ApText>{profile?.name}</ApText>
            </div>
          </div>
          <div>
            <ApText className="mb-2">Email</ApText>
            <div className="p-2 border rounded-md shadow-sm bg-stone-200">
              <ApText>{profile?.email}</ApText>
            </div>
          </div>
          <div>
            <ApText className="mb-2">Phone Number</ApText>
            <div className="p-2 border rounded-md shadow-sm bg-stone-200">
              <ApText>{profile?.phoneNumber}</ApText>
            </div>
          </div>
        </div>
      </ApBodyContainer>

      <ApModal
        show={showPasswordModal}
        onDimiss={() => setShowPasswordModal(false)}
        title="Change Password"
        subTitle="Fill to update your current passwordd"
      >
        <ChangePassword onDissmiss={() => setShowPasswordModal(false)} />
      </ApModal>
    </div>
  );
};
