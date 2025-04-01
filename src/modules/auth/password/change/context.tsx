import React, { createContext, useState } from "react";
import { useChangePasswordQuery } from "./gql/query";
import { useRouter } from "next/router";
import { toastSvc } from "../../../../services";

interface IPasswordChange{
    loading: boolean;
    changePassword: (oldPassword:string, newPassword:string)=>Promise<void>
}

const ChangePasswordContext=createContext<IPasswordChange>({
    loading: false,
    changePassword:(oldPassword, newPassword)=>{
        return Promise.resolve();
    }
})


export const useChangePassword=()=>{
    const context = React.useContext(ChangePasswordContext);
    if(context === undefined){
        throw new Error("app dispatch must be used within the app global provider");
    }
    return context
}

interface IProps{
    children: React.ReactNode;
}

export const ChangePasswordContextProvider: React.FC<IProps>=({children})=>{
    const changePasswordQ = useChangePasswordQuery();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const changePassword = async (oldPassword: string, newPassword:string):Promise<void>=>{
        setLoading(true);
        return changePasswordQ.changePassword[0](
            {variables:{oldPassword:oldPassword, newPassword:newPassword}})
            .then((res)=>{
                const data = res?.data?.changePasswordInput
                if(data){
                    toastSvc.success(data);
                    router.push("/login");
                }
            }).finally(()=>{setLoading(false)})
    }
    return (
        <ChangePasswordContext.Provider value={{loading, changePassword}}>
            {children}
        </ChangePasswordContext.Provider>
    )
}
