import gql from "graphql-tag";

export const FileUploadFragment = gql `
    fragment FileUpload on FileUpload {
        _id
        ref
        refId
        uri
        name
        cover
        type
        module
        createdBy
        createdAt
        updatedAt
        canDelete
    }
`; 