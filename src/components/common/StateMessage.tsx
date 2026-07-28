interface Props {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

// 에러 / 빈 상태 등 안내 화면 공통 레이아웃
export default function StateMessage({ icon, iconBg = 'bg-gray-50', title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>{icon}</div>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      {action}
    </div>
  );
}
