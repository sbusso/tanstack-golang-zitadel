import Header from '@/components/Header'
import type { AuthContextType } from '@/context/AuthProvider'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

interface MyRouterContext {
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  const { auth } = Route.useRouteContext()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header auth={auth} />
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
    </div>
  )
}
