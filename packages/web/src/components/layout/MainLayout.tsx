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
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
