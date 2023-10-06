import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export const POST = async (
   req: Request,
   { params }: { params: { storeId: string } }
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
         return new NextResponse('Label is required', { status: 400 });
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

      const product = await prismadb.product.create({
         data: {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images: {
               createMany: {
                  data: [...images.map((image: { url: string }) => image)],
               },
            },
            isFeatured,
            isArchived,
            storeId: params.storeId,
         },
      });
      return NextResponse.json(product);
   } catch (error) {
      console.log('[PRODUCT_POST]', error);
      return new NextResponse('Internal error', { status: 500 });
   }
};

export const GET = async (
   req: Request,
   { params }: { params: { storeId: string } }
) => {
   try {
      const { searchParams } = new URL(req.url);
      const categoryId = searchParams.get('categoryId') || undefined;
      const colorId = searchParams.get('colorId') || undefined;
      const sizeId = searchParams.get('sizeId') || undefined;
      const isFeatured = searchParams.get('isFeatured');

      if (!params.storeId) {
         return new NextResponse('Store id is required', { status: 400 });
      }

      const products = await prismadb.product.findMany({
         where: {
            storeId: params.storeId,
            categoryId,
            colorId,
            sizeId,
            isFeatured: isFeatured ? true : undefined,
            isArchived: false,
         },
         include: {
            images: true,
            category: true,
            color: true,
            size: true,
         },
         orderBy: {
            createdAt: 'desc',
         },
      });
      return NextResponse.json(products);
   } catch (error) {
      console.log('[PRODUCTS_GET]', error);
      return new NextResponse('Internal error', { status: 500 });
   }
};
