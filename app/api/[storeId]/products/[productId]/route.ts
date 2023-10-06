import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export const GET = async (
   req: Request,
   { params }: { params: { productId: string } }
) => {
   try {
      if (!params.productId) {
         return new NextResponse('Product id is required', { status: 400 });
      }

      const product = await prismadb.product.findUnique({
         where: {
            id: params.productId,
         },
         include: {
            images: true,
            category: true,
            color: true,
            size: true,
         },
      });

      return NextResponse.json(product);
   } catch (error) {
      console.log('[PRODUCT_GET]', error);
      return new NextResponse('Internal error', { status: 500 });
   }
};

export const PATCH = async (
   req: Request,
   { params }: { params: { storeId: string; productId: string } }
) => {
   try {
      const { userId } = auth();
      const {
         name,
         price,
         categoryId,
         colorId,
         sizeId,
         images,
         isFeatured,
         isArchived,
      } = await req.json();

      if (!userId) {
         return new NextResponse('Unauthenticated', { status: 401 });
      }

      if (!name) {
         return new NextResponse('Name is required', { status: 400 });
      }

      if (!categoryId) {
         return new NextResponse('Category id URL is required', {
            status: 400,
         });
      }
      if (!colorId) {
         return new NextResponse('Color id is required', { status: 400 });
      }
      if (!sizeId) {
         return new NextResponse('Size id is required', { status: 400 });
      }
      if (!images || !images.length) {
         return new NextResponse('Images is required', { status: 400 });
      }

      if (!params.storeId) {
         return new NextResponse('Store id is required', { status: 400 });
      }

      if (!params.productId) {
         return new NextResponse('Product id is required', { status: 400 });
      }
      //chek user permision / check store owner
      const storeByUserId = await prismadb.store.findFirst({
         where: {
            id: params.storeId,
            userId,
         },
      });

      if (!storeByUserId) {
         return new NextResponse('Unauthorized');
      }

      await prismadb.product.update({
         where: {
            id: params.productId,
         },
         data: {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images: {
               deleteMany: {},
            },
            isFeatured,
            isArchived,
            storeId: params.storeId,
         },
      });

      const product = await prismadb.product.update({
         where: {
            id: params.productId,
         },
         data: {
            images: {
               createMany: {
                  data: [...images.map((image: { url: string }) => image)],
               },
            },
         },
      });
      return NextResponse.json(product);
   } catch (error) {
      console.log('[PRODUCT_PATCH]', error);
      return new NextResponse('Internal error', { status: 500 });
   }
};

export const DELETE = async (
   req: Request,
   { params }: { params: { storeId: string; productId: string } }
) => {
   try {
      const { userId } = auth();

      if (!userId) {
         return new NextResponse('Unauthenticated', { status: 401 });
      }

      if (!params.storeId) {
         return new NextResponse('Store id is required', { status: 400 });
      }

      if (!params.productId) {
         return new NextResponse('Product id is required', { status: 400 });
      }
      //chek user permision / check store owner
      const storeByUserId = await prismadb.store.findFirst({
         where: {
            id: params.storeId,
            userId,
         },
      });

      if (!storeByUserId) {
         return new NextResponse('Unauthorized');
      }

      const product = await prismadb.product.delete({
         where: {
            id: params.productId,
         },
      });
      return NextResponse.json(product);
   } catch (error) {
      console.log('[PRODUCT_DELETE]', error);
      return new NextResponse('Internal error', { status: 500 });
   }
};
