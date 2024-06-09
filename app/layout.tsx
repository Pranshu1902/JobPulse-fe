import type { Metadata } from "next";
import "./globals.css";
import "react-notifications/lib/notifications.css";
import Notification from "@components/notification";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import ResponsiveDashboard from "@components/ResponsiveDashboard";

config.autoAddCss = false;

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
      <body>
        <ResponsiveDashboard>
          <Notification>{children}</Notification>
        </ResponsiveDashboard>
      </body>
    </html>
  );
}
