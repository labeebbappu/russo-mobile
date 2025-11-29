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
