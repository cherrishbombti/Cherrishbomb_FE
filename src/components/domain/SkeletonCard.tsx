// 대시보드 로딩 스켈레톤 카드
export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-28 bg-gray-100 rounded-full" />
        <div className="w-7 h-7 bg-gray-100 rounded-full" />
      </div>
      <div className="flex gap-3 items-center">
        <div className="w-11 h-11 bg-gray-100 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3.5 w-24 bg-gray-100 rounded" />
          <div className="h-2.5 w-36 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="h-2.5 bg-gray-100 rounded w-full" />
    </div>
  );
}
