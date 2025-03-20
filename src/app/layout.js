import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/Darkmode/ThemeProvider";
import { UserProvider } from "./contaxt/userContaxt";
import { PostProvider } from "./contaxt/PostContaxt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Booster.in",
  description: `Discover the latest posts shared by users on Booster. From creative ideas to life updates, explore a variety of content created by people around the world.
✅ Image posts
✅ Markdown-supported content
✅ User profiles with name & email
✅ Smooth infinite scrolling experience

Stay connected, get inspired, and share your own stories with the community.`,
  icons: {
    icon: "https://boosters-sooty.vercel.app/favicon.ico",
    apple: "https://boosters-sooty.vercel.app/apple-touch-icon.png",
    shortcut: "https://boosters-sooty.vercel.app/favicon-16x16.png",
  },
  openGraph: {
    title: "Booster.in",
    description: `Discover the latest posts shared by users on Booster. From creative ideas to life updates, explore a variety of content created by people around the world.
✅ Image posts
✅ Markdown-supported content
✅ User profiles with name & email
✅ Smooth infinite scrolling experience

Stay connected, get inspired, and share your own stories with the community.`,
    url: "https://boosters-sooty.vercel.app",
    siteName: "Akhil Soigama",
    images: [
      {
        url: "https://boosters-sooty.vercel.app/android-chrome-512x512.png",
        width: 1200,
        height: 630,
        alt: "Booster.in",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        suppressHydrationWarning
      >

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }} />
          <UserProvider>
            <PostProvider>
              {children}
            </PostProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
