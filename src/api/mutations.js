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

export const Register_Mutation = gql`
  mutation RegistrationCreate(
    $appSecret: String!
    $registrationInput: RegistrationCreateInput!
  ) {
    registrationCreate(
      appSecret: $appSecret
      registrationInput: $registrationInput
    ) {
      id
      fullName
      primaryEmail
      primaryPhone
      registrationType
      verificationStatus
      status
      createdAt
      updatedAt
    }
  }
`;

export const Auth_Verification = gql`
  mutation AuthVerify($appSecret: String!, $userToken: String!) {
    authVerify(appSecret: $appSecret, userToken: $userToken) {
      userId
      userToken
      fullName
      username
      role
      tockenType
      createdAt
      expiryAt
      staffWebRole
      staffId
      isNewToken
    }
  }
`;
