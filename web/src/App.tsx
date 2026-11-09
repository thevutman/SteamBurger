import { useEffect } from "react";
import { BrowserRouter, Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ShopProvider } from "@/lib/menu";
import { Checkout } from "@/pages/Checkout";
import { Home } from "@/pages/Home";
import { Kitchen } from "@/pages/Kitchen";
import { MenuPage } from "@/pages/MenuPage";
import { Tracking } from "@/pages/Tracking";

function Layout() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
      <CartDrawer />
    </>
  );
}

function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 pt-24 text-center">
      <p className="script text-[44px]">Esta página se nos quemó</p>
      <Link to="/" className="btn-red">Volver al inicio</Link>
    </main>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="pedido" element={<Checkout />} />
            <Route path="pedido/:id" element={<Tracking />} />
            <Route path="cocina" element={<Kitchen />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ShopProvider>
    </BrowserRouter>
  );
}
