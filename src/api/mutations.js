import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation AuthLogin(
    $appSecret: String!
    $username: String!
    $password: String!
  ) {
    authLogin(appSecret: $appSecret, username: $username, password: $password) {
      createdAt
      expiryAt
      fullName
      isNewToken
      role
      staffId
      staffWebRole
      tockenType
      userId
      username
      userToken
    }
  }
`;
