type UserProps = {
  name: string;
  email: string;
};
const User = ({ name, email }: UserProps) => {
  return (
    <>
      <p className="text-lg pt-3 text-nova">{name}</p>
      <p className="text-sm pb-5 rounded underline underline-offset-1 flex">
        {/* TODO: onclick email, redirect to a page about "account details" */}
        {/* TODO: WHEN YOU DECIDE TO WORK ON IMAGES, NEXTJS DOES IMAGES WEIRD AS FUCK... 
      https://nextjs.org/docs/messages/next-image-unconfigured-host
      https://nextjs.org/docs/pages/building-your-application/optimizing/images
    */}
        {/* <Image
      style={{ borderRadius: "50%", overflow: "hidden" }}
      src="http://www.gravatar.com/avatar/?d=mp"
      width={500}
      height={500}
      alt="Picture of the author"
    /> */}
        {email}
      </p>
    </>
  );
};

export default User;
