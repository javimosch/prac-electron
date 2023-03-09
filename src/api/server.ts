import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.create();
export const appRouter = t.router({
  getUser: t.procedure.input(z.string()).query((req) => {
    req.input; // string
    return { id: req.input, name: 'Bilbo' };
  }),
  createUser: t.procedure
    //s.input(z.object({ name: z.string().min(5) }))
    .mutation(async (req) => {
      // use your ORM of choice
      /*return await UserModel.create({
        data: req.input,
      });*/

    
    }),
    getAppVersionExpiration: t.procedure
    .input(z.object({appVersion:z.string().min(1)}))
    .query(async()=>{}),

    getAppSettings: t.procedure.query(async()=>{})
});
// export type definition of API
export type AppRouter = typeof appRouter;