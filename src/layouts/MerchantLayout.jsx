import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

const NAV_ITEMS = [
  { to: "/merchant", label: "Dashboard", end: true },
  { to: "/merchant/products", label: "Products", end: true },
  { to: "/merchant/products/new", label: "Add Product", end: true },
  { to: "/merchant/profile", label: "Profile", end: true },
];

export default function MerchantLayout() {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar title="Merchant" items={NAV_ITEMS} />
      <main className="flex-1 p-6 sm:p-8 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}
