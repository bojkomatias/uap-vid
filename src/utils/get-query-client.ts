import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    //MATI SI LEÉS ESTO AYUDAME, las default options bloquean la queryFn de los mensajes de chat, estuve leyendo la documentación pero no encontré cuál es el problema aun. Solo sacando las defaultOptions funciona
    // defaultOptions: {
    //   queries: {
    //     refetchOnMount: false,
    //     gcTime: 60 * 1000 * 30,
    //     staleTime: 60 * 1000 * 15,
    //   },
    //   dehydrate: {
    //     // include pending queries in dehydration
    //     shouldDehydrateQuery: (query) =>
    //       defaultShouldDehydrateQuery(query) ||
    //       query.state.status === 'pending',
    //   },
    // },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}