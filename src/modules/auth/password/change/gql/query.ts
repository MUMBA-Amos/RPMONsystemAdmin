import { gql, useMutation } from "@apollo/client";
import { toastSvc } from "../../../../../services";


const CHANGE_PASSWORD = gql`
    mutation changePasswordInput($oldPassword: String!, $newPassword:String!){
        changePasswordInput(oldPassword:$oldPassword, newPassword:$newPassword)
    }
`;

export const useChangePasswordQuery = ()=>{
    const onError = (error:any)=>{
        toastSvc.graphQlError(error)
    }

    const changePassword = useMutation(CHANGE_PASSWORD,{onError: onError})

    return {changePassword}
}
