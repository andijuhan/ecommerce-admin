import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export const PATCH = async (
   req: Request,
   { params }: { params: { storeId: string } }
) => {
   try {
      const { userId } = auth();
      const { name } = await req.json();

      if (!userId) {
         return new NextResponse('Unauthenticated', { status: 401 });
      }

      if (!name) {
         return new NextResponse('Name is required', { status: 400 });
      }

      if (!params.storeId) {
         return new NextResponse('Store id is required', { status: 400 });
      }

      const store = await prismadb.store.update({
         where: {
            id: params.storeId,
            userId,
         },
         data: {
            name,
         },
      });

      return NextResponse.json(store);
   } catch (error) {
      console.log('[STORES_PATCH]', error);
      return new NextResponse('Internal error', { status: 500 });
   }
};

export const DELETE = async (
   req: Request,
   { params }: { params: { storeId: string } }
) => {
   try {
      const { userId } = auth();

      if (!userId) {
         return new NextResponse('Unauthenticated', { status: 401 });
      }

      if (!params.storeId) {
         return new NextResponse('Store id is required', { status: 400 });
      }

      const store = await prismadb.store.delete({
         where: {
            id: params.storeId,
            userId,
         },
      });

      return NextResponse.json(store);
   } catch (error) {
      console.log('[STORES_DELETE]', error);
      return new NextResponse('Internal error', { status: 500 });
   }
};
