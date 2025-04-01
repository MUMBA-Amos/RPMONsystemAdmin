import gql from 'graphql-tag';

export const ConfigFragment = gql`
  fragment Config on Config {
    _id
    contactWhatsappNumber
    androidVersion
    androidForceUpdate
    iosVersion

  }
`;
