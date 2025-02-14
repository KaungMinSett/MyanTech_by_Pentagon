export default function NotificationBadge({ count }) {
  if (!count) return null;

  return (
    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {count}
    </span>
  );
}
