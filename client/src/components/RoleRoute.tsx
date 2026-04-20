import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

interface RoleRouteProps {
  children: React.ReactNode;
  role: "student" | "admin";
}

export const RoleRoute = ({ children, role }: RoleRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060b18]">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== role) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/student/dashboard"} replace />;
  }

  return <>{children}</>;
};
