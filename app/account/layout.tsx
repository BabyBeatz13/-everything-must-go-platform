import { ProtectedRoute } from "../../components/account/ProtectedRoute";

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
