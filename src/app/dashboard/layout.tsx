import "~/styles/globals.css";
import { Toaster } from "sonner";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}
