import { withAuth } from "next-auth/middleware";

// Protect the dashboard (and any nested routes). Unauthenticated users are
// sent straight to our custom /signin page.
export default withAuth({
  pages: { signIn: "/signin" },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
