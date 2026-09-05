import SessionRedirect from "@/components/SessionRedirect";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionRedirect />
      {children}
    </>
  );
}