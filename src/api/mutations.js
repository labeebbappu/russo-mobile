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

export const Resend_Verification = gql`
  mutation RegistrationResendVerification(
    $appSecret: String!
    $primaryEmail: String!
  ) {
    registrationResendVerification(
      appSecret: $appSecret
      primaryEmail: $primaryEmail
    )
  }
`;

export const Code_Verification = gql`
  mutation RegistrationVerifyEmail(
    $appSecret: String!
    $primaryEmail: String!
    $verificationCode: String!
  ) {
    registrationVerifyEmail(
      appSecret: $appSecret
      primaryEmail: $primaryEmail
      verificationCode: $verificationCode
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

export const Forget_Password = gql`
  mutation AuthForgetPasswordRequest($appSecret: String!, $username: String!) {
    authForgetPasswordRequest(appSecret: $appSecret, username: $username) {
      username
      verificationCode
      verificationStatus
      verificationCodeExpiresAt
    }
  }
`;

export const Reset_Password = gql`
  mutation AuthForgetPasswordVerifyAndChange(
    $appSecret: String!
    $username: String!
    $verificationCode: String!
    $newPassword: String!
  ) {
    authForgetPasswordVerifyAndChange(
      appSecret: $appSecret
      username: $username
      verificationCode: $verificationCode
      newPassword: $newPassword
    ) {
      fullName
      username
      role
      tockenType
      createdAt
      expiryAt
    }
  }
`;
