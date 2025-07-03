import { headers } from 'next/headers'

function getSessionToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(';')
  const sessionCookie = cookies.find((cookie) =>
    cookie.trim().startsWith('next-auth.session-token')
  )

  if (!sessionCookie) return null

  return sessionCookie.split('=')[1]
}

export async function logServerAction(actionName: string, data: any) {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')
  const sessionToken = getSessionToken(cookieHeader)

  // console.log({
  //   timestamp: new Date().toISOString(),
  //   type: 'server_action',
  //   action: actionName,
  //   data: JSON.stringify(data),
  //   token: sessionToken,
  //   headers: Object.fromEntries(headersList.entries()),
  //   pathname: headersList.get('x-pathname'),
  //   url: headersList.get('x-url'),
  // })
}

// Higher-order function to wrap server actions with logging
export function withLogging<T extends any[], R>(
  actionName: string,
  fn: (...args: T) => Promise<R>
) {
  const functionName = actionName || fn.name || 'anonymous'

  return async (...args: T): Promise<R> => {
    const startTime = Date.now()

    try {
      // Log the start of the action
      await logServerAction(`${functionName}_start`, {
        args,
        timestamp: new Date().toISOString(),
      })

      // Execute the action
      const result = await fn(...args)

      // Log the successful completion
      await logServerAction(`${functionName}_success`, {
        args,
        result,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      })

      return result
    } catch (error) {
      // Log the error
      await logServerAction(`${functionName}_error`, {
        args,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      })

      // If the action returns an ActionResult, return a standardized error response
      if (typeof fn === 'function' && fn.name.includes('ActionResult')) {
        return {
          status: false,
          notification: {
            title: 'Error',
            message:
              error instanceof Error ?
                error.message
              : 'An unexpected error occurred',
            intent: 'error',
          },
        } as R
      }

      throw error
    }
  }
}
