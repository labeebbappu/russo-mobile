require("dotenv").config();

export default ({ config }) => ({
  ...config,
  plugins: ["expo-secure-store"],
  extra: {
    GRAPHQL_URL: process.env.GRAPHQL_URL,
    APP_SECRET: process.env.APP_SECRET,
  },
});
