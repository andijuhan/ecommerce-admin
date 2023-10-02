'use client';

import useOrigin from '@/hooks/use-origin';
import { useParams } from 'next/navigation';
import ApiAlert from './api-alert';

interface ApiListProps {
   entityName: string;
   entityIdName: string;
}

const ApiList = ({ entityName, entityIdName }: ApiListProps) => {
   const params = useParams();
   const origin = useOrigin();

   const baseUrl = `${origin}/api/${params.storeId}`;

   return (
      <>
         <ApiAlert
            title='GET'
            varian='public'
            description={`${baseUrl}/${entityName}`}
         />
         <ApiAlert
            title='GET'
            varian='public'
            description={`${baseUrl}/${entityName}/{${entityIdName}}`}
         />
         <ApiAlert
            title='POST'
            varian='admin'
            description={`${baseUrl}/${entityName}`}
         />
         <ApiAlert
            title='PATCH'
            varian='admin'
            description={`${baseUrl}/${entityName}/{${entityIdName}}`}
         />
         <ApiAlert
            title='DELETE'
            varian='admin'
            description={`${baseUrl}/${entityName}/{${entityIdName}}`}
         />
      </>
   );
};

export default ApiList;
