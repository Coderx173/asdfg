function Input({ type, placeholder, value, onChange, disabled, name }: any) {
  return (
    <input
      required
      className={
        "outline outline-1 outline-gray-300 w-full p-3 rounded-lg text-black transition-colors duration-500 ease-in-out " +
        (disabled ? "bg-grey-200" : "")
      }
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

export default Input;
