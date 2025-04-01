import { MasterFragment } from '@/modules/master/gql/fragment';
import gql from 'graphql-tag';

export const GrantFragment = gql`
  fragment Grant on Grant {
    _id
    fromDate
    toDate
    createdAt
    name
    description
    schemeId
    # batchId
    status
    clusterId
    budget
    organization{
      _id
      name
    }
    # batch {
    #   _id
    #   name
    #   description
    # }
    scheme {
      ...Master
    }
    cluster {
      ...Master
    }
  }
  ${MasterFragment}
`;
