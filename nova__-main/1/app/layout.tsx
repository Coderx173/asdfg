/*
setup recoil
https://github.com/facebookexperimental/Recoil/issues/2082#issuecomment-1582062599
*/
import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "./providers";
import RecoilRootWrapper from "./RecoilRootWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "nova.ai",
  description: "pretty cool ai app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider>
        <body className={inter.className}>
          <RecoilRootWrapper>{children}</RecoilRootWrapper>
        </body>
      </Provider>
    </html>
  );
}
