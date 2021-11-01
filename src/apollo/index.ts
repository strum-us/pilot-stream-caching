import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { Reference, getMainDefinition } from '@apollo/client/utilities'

import { LocalToken } from '@strum/common'
import { URLs } from '../config/url'
import { WebSocketLink } from '@apollo/client/link/ws'

export const client = new ApolloClient({
  link: undefined,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          launches: {
            keyArgs: false,
            merge(existing, incoming) {
              let launches: Reference[] = []
              if (existing && existing.launches) {
                launches = launches.concat(existing.launches)
              }
              if (incoming && incoming.launches) {
                launches = launches.concat(incoming.launches)
              }
              return {
                ...incoming,
                launches,
              }
            },
          },
        },
      },
    },
  }),
})

export async function initializeTokenLink(token?: string) {
  const graphqlUrl = URLs.GRAPHQL_URL
  const subscriptionUrl = URLs.SUBSCRIPTION_URL
  if (!token) {
    token = await LocalToken.getToken()
  }
  const httpLink = new HttpLink({
    uri: graphqlUrl,
    credentials: 'same-origin',
  })

  const wsLink = new WebSocketLink({
    uri: subscriptionUrl,
    options: {
      lazy: true,
      reconnect: true,
      connectionParams: {
        token: token,
      },
    },
  })

  const tokenLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        token,
      },
    }))
    return forward(operation)
  })

  const combinedLink = ApolloLink.split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    tokenLink.concat(httpLink),
  )

  client.setLink(combinedLink)
}
