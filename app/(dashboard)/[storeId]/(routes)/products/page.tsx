import prismadb from '@/lib/prismadb';
import BillboardClient from './components/client';
import { BillboardColumn } from './components/columns';
import { format } from 'date-fns';
import { formatter } from '@/lib/utils';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
   const Products = await prismadb.product.findMany({
      where: {
         storeId: params.storeId,
      },
      include: {
         category: true,
         size: true,
         color: true,
      },
      orderBy: {
         createdAt: 'desc',
      },
   });

   const formattedProducts: BillboardColumn[] = Products.map((item) => ({
      id: item.id,
      name: item.name,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      price: formatter.format(item.price.toNumber()),
      category: item.category.name,
      size: item.size.name,
      color: item.color.value,
      createdAt: format(item.createdAt, 'MMMM do, yyyy'),
   }));

   return (
      <div className='flex-col'>
         <div className='flex-1 space-y-4 p-8 pt-6'>
            <BillboardClient data={formattedProducts} />
         </div>
      </div>
   );
};

export default ProductsPage;