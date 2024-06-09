import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-notifications/lib/notifications.css";
import Notification from "./notification";
import DashBoard from "@components/DashBoard";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import ResponsiveDashboard from "@/components/ResponsiveDashboard";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobPulse",
  description: "Stay Ahead of the Game with JobPulse",
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={"flex flex-row"}>
//         <div className="md:w-1/6">
//           <DashBoard />
//         </div>
//         <div className="overflow-scroll">
//           <Notification>{children}</Notification>
//         </div>
//       </body>
//     </html>
//   );
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ResponsiveDashboard>{children}</ResponsiveDashboard>
      </body>
    </html>
  );
}
