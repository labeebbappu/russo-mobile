import { gql } from "@apollo/client";

export const GetAppUsers = gql`
  query AppAccountsGetPagedDataByAppUser(
    $userToken: String!
    $adminAppId: String!
    $appAccountUserId: ID!
  ) {
    appAccountsGetPagedDataByAppUser(
      userToken: $userToken
      adminAppId: $adminAppId
      appAccountUserId: $appAccountUserId
    ) {
      id
      adminAppName
      adminAppId
      adminCustomerId
      adminCustomerName
      title
      status
      actionById
      actionByName
      createdAt
      updatedAt
      isDeleted
    }
  }
`;

export const Get_App_Account_Users = gql`
  query AppAccountUsersGetPagedDataByAccountUser(
    $appAccountUsersGetPagedDataByAccountUserUserToken2: String!
    $appAccountId: String!
  ) {
    appAccountUsersGetPagedDataByAccountUser(
      userToken: $appAccountUsersGetPagedDataByAccountUserUserToken2
      appAccountId: $appAccountId
    ) {
      id
      adminAppId
      adminAppName
      adminCustomerId
      adminCustomerName
      appAccountId
      appAccountTitle
      userFullName
      userEmail
      contactNumber
      userRole
      assignedGroupId
      note
      loginUserId
      status
      actionById
      actionByName
      createdAt
      updatedAt
      isDeleted
    }
  }
`;
