import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Providers } from '@/app/ui/providers';
import ConfigureAmplifyClientSide from "@/app/ui/ConfigureAmplify";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
      <ConfigureAmplifyClientSide />
        <Providers>{children}</Providers>
        </body>
    </html>
  );
}
