
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server';

 
// Notice the <AppRouter> generic here.
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_APP_TRPC_GATEWAY_URL || "", //'http://localhost:4000/trpc',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});

// @ts-ignore
window.trpc = trpc;

export async function getAppVersionExpiration(appVersion:string){
  return await trpc.getAppVersionExpiration.query({
    appVersion,
  });
}



