import React, { Suspense, lazy } from 'react';

// Lazy-load the TreeScene (which contains Canvas function + Models loading function)
const TreeSceneComponent = lazy(() => import('./TreeScene'));

export default function LazyTreeScene() {
  return (
    <Suspense
      fallback={
          <div className='w-full row-start-4 col-span-3 h-fit flex justify-center items-center mt-8 sm:mt-6 md:mt-12'>
        <div className='w-fit h-fit x-0 px-10 sm:px-6 md:px-24 lg:px-34 py-3 md:py-4 ml-2 sm:ml-4 md:ml-0 cardGradient border-8 border-gray-50/80 rounded-xl
		font-poppins font-medium text-lg sm:text-[1rem] flex justify-between items-center gap-2 md:gap-4'> Lazy loading scene ... <br /> Please wait patiently ✨</div>
             </div>
      }>

      <TreeSceneComponent />
    </Suspense>
  );
}
