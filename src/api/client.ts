import Constants from "expo-constants";
import { HttpLink } from "@apollo/client/link/http";
import { ApolloClient, InMemoryCache } from "@apollo/client";
const url = Constants.expoConfig.extra.GRAPHQL_URL;

const link = new HttpLink({
  uri: url,
});
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
