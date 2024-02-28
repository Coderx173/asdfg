export default function Text({
  text,
  className,
}: {
  text: string;
  className: string;
}) {
  return (
    <p className={`bg-black text-white p-3 rounded-sm ${className}`}>{text}</p>
  );
}
