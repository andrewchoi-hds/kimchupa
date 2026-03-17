import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  user?: {
    nickname: string;
    level: number;
    levelName: string;
    xp: number;
    profileImage?: string;
  } | null;
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
