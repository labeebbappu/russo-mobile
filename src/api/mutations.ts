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

export const Customer_Onboarding = gql`
  mutation AdminCustomerOnboarding(
    $userToken: String!
    $name: String!
    $customerType: String!
    $billingAddressName: String!
    $billingAddressEmail: String!
    $adminAppId: String!
    $fullName: String!
    $designation: String!
    $contactEmail: String!
    $address: String
    $city: String
    $country: String
    $primaryCurrency: String
    $officeMobile: String
    $appAccountTitle: String
  ) {
    adminCustomerOnboarding(
      userToken: $userToken
      name: $name
      customerType: $customerType
      billingAddressName: $billingAddressName
      billingAddressEmail: $billingAddressEmail
      adminAppId: $adminAppId
      fullName: $fullName
      designation: $designation
      contactEmail: $contactEmail
      address: $address
      city: $city
      country: $country
      primaryCurrency: $primaryCurrency
      officeMobile: $officeMobile
      appAccountTitle: $appAccountTitle
    ) {
      id
      name
      note
      logoUrl
      status
      actionById
      actionByName
      createdAt
      updatedAt
      isDeleted
    }
  }
`;
