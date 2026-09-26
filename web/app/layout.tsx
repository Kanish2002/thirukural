import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "திருக்குறள் Daily",
  description: "ஒவ்வொரு நாளும் ஒரு திருக்குறள் மற்றும் அதன் முழு தமிழ் பொருள்.",
  applicationName: "திருக்குறள் Daily",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "திருக்குறள்"
  }
};

export const viewport: Viewport = {
  themeColor: "#14100c",
  colorScheme: "dark"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ta">
      <body>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
