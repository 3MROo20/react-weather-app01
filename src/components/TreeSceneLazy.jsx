import React, { Suspense, lazy } from 'react';

// Lazy-load the TreeScene (which contains Canvas function + Models loading function)
const TreeSceneComponent = lazy(() => import('./TreeScene'));

export default function LazyTreeScene() {
  return (
    <Suspense
      fallback={
             <div className='w-full col-span-1/4 h-fit row-start-4 flex justify-center mt-8 sm:mt-6 md:mt-12'>
               <div className='w-fit h-fit x-0 px-20 sm:px-16 md:px-26 lg:px-36 py-[45%] md:py-[50%] lg:py-[50%] cardGradient border-8 border-gray-50/80 rounded-xl
           font-poppins font-medium text-lg sm:text-[1rem] opacity-0'>Lazy Loading Scene... </div>
             </div>
      }>

      <TreeSceneComponent />
    </Suspense>
  );
}
