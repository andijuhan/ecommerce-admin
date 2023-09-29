'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
   disable?: boolean;
   onChange: (value: string) => void;
   onRemove: (value: string) => void;
   value: string[];
}

const ImageUpload = ({
   disable,
   onChange,
   onRemove,
   value,
}: ImageUploadProps) => {
   const [isMounted, setIsMounted] = useState(false);

   const onUpload = (result: any) => {
      onChange(result.info.secure_url);
   };

   useEffect(() => {
      setIsMounted(true);
   }, []);

   if (!isMounted) {
      return null;
   }

   console.log(value);

   return (
      <div>
         <div className='mb-4 flex items-center gap-4'>
            {value.map((url) => (
               <div
                  key={url}
                  className='relative w-[200px] h-[200px] rounded-md overflow-hidden'
               >
                  <div className='z-10 absolute top-2 right-2'>
                     <Button
                        type='button'
                        onClick={() => onRemove(url)}
                        variant='destructive'
                        size='icon'
                     >
                        <Trash className='w-4 h-4' />
                     </Button>
                  </div>
                  <Image fill className='object-cover' alt='Image' src={url} />
               </div>
            ))}
         </div>
         <CldUploadWidget onUpload={onUpload} uploadPreset='onw0tcoy'>
            {({ open }) => {
               const onClick = () => {
                  open();
               };

               return (
                  <Button
                     type='button'
                     disabled={disable}
                     variant='secondary'
                     onClick={onClick}
                  >
                     <ImagePlus className='w-4 h-4 mr-2' />
                     Upload an Image
                  </Button>
               );
            }}
         </CldUploadWidget>
      </div>
   );
};

export default ImageUpload;
