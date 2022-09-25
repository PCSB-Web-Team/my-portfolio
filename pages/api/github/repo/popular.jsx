import { ApolloClient, createHttpLink, InMemoryCache, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { social } from "@/config";

const info = async (req, res) => {
 const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql",
 });

 const authLink = setContext((_, { headers }) => {
  return {
   headers: {
    ...headers,
    authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
   },
  };
 });

 const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
 });

 const most_popular_repos = await client.query({
  query: gql`
  {
    user(login: \"${social.github.username}\") {
      topRepositories(first: 6, orderBy: {field: STARGAZERS, direction: DESC}) {
       edges {
          node {
            ... on Repository {
              name
              id
              url
              owner {
                login
              }
              description
              isArchived
              forkCount
              stargazerCount
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
      ... on User {
        followers {
          totalCount
        }
        starredRepositories {
          totalCount
        }
      }
    }
  }
`,
 });

 res.status(200).json(most_popular_repos);
};

export default info;
