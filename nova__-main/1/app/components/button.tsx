export default function Button({
  text,
  onClick,
  className,
}: {
  text: string;
  onClick: any;
  className: string;
}) {
  return (
    <button
      className={`bg-black text-white p-3 rounded-md ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
