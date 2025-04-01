import React, { createContext, useState } from "react";
import { IAccessGroup, IAccessGroupQueryInput } from "./model";
import { useAccessGroupsQuery } from "./gql/query";
import { toastSvc } from "../../../services";

interface IAccessGroupState {
    initLoading: boolean
    loading: boolean
    accessGroups: IAccessGroup[]
    findAccessGroups: (query: IAccessGroupQueryInput) => Promise<void>
    createAccessGroup: (accessGroup: IAccessGroupQueryInput) => Promise<void>
    updateAccessGroup: (_id: string, accessGroup: IAccessGroupQueryInput) => Promise<void>
    deleteAccessGroup: (accessGroup: IAccessGroup) => Promise<void>
}

const AccessGroupContext = createContext<IAccessGroupState>({
    initLoading: true,
    loading: false,
    accessGroups: [],
    findAccessGroups(query) {
        return null as any
    },
    createAccessGroup(accessGroup) {
        return null as any
    },
    deleteAccessGroup(accessGroup) {
        return null as any
    },
    updateAccessGroup(_id, accessGroup) {
        return null as any
    },
});

export const useAccessGroupState = () => {
  const context = React.useContext(AccessGroupContext);
  if (context === undefined) {
    throw new Error("app dispatch must be used within the app global provider");
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const AccessGroupContextProvider: React.FC<IProps> = ({ children }) => {
    const [accessGroups, setAccessGroups] = useState<IAccessGroup[]>([])
    const accessGroupsQ = useAccessGroupsQuery()

    const findAccessGroups = async (query: IAccessGroupQueryInput) => {
        return accessGroupsQ.findAccessGroupsQ[0]({
            variables: { query }
        }).then((res) => {
            const data = res?.data?.findAccessGroups
            if(data){
                setAccessGroups(data)
            }
        })
    }

    const createAccessGroup = async (accessGroup: IAccessGroupQueryInput) => {
      return accessGroupsQ.createAccessGroupQ[0]({
          variables: { accessGroup }
      }).then((res) => {
          const data = res?.data?.createAccessGroup
          if(data){
            toastSvc.success("Group Created")
            findAccessGroups({})
          }
      })
    }

    const updateAccessGroup = async (_id: string, accessGroup: IAccessGroupQueryInput) => {
      return accessGroupsQ.updateAccessGroupQ[0]({
          variables: { _id, accessGroup }
      }).then((res) => {
          const data = res?.data?.updateAccessGroup
          if(data){
            toastSvc.success("Group Updated")
            findAccessGroups({})
          }
      })
    }

    const deleteAccessGroup = async (accessGroup: IAccessGroup) => {
      return accessGroupsQ.deleteAccessGroupQ[0]({
          variables: { _id: accessGroup._id }
      }).then((res) => {
          const data = res?.data?.deleteAccessGroup
          if(data){
            toastSvc.success("Group Deleted")
            findAccessGroups({})
          }
      })
    }

  return (
    <AccessGroupContext.Provider
      value={{
        loading: accessGroupsQ.loading,
        initLoading: accessGroupsQ.initLoading,
        findAccessGroups,
        accessGroups,
        createAccessGroup,
        deleteAccessGroup,
        updateAccessGroup
      }}
    >
      {children}
    </AccessGroupContext.Provider>
  );
};
