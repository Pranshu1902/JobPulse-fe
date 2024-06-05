import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-notifications/lib/notifications.css";
import Notification from "./notification";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobPulse",
  description: "Stay Ahead of the Game with JobPulse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Notification children={children} />
      </body>
    </html>
  );
}
