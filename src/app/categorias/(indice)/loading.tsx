import { CategoryGridSkeleton, PageHeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <CategoryGridSkeleton />
      </div>
    </>
  );
}
