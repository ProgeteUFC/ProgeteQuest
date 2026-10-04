import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose, IoExitOutline } from "react-icons/io5";
import logo from "../../assets/logo.png";
import { adminMenu } from "./menu";
import { MenuContainer, Logo, MenuContent, MenuOptions, MenuOption, RightBox,
  HamburgerButton, MobileMenu, LogoutButton, CloseButton } from "./style";

export default function HeaderAdmin() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(panel.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
    focusable()[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    const desktop = window.matchMedia("(min-width: 1201px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", closeOnDesktop);
      trigger.current?.focus();
    };
  }, [open]);

  function logout() {
    ["token", "userId", "userType"].forEach(key => localStorage.removeItem(key));
    setOpen(false);
    navigate("/", { replace: true });
  }
  const links = adminMenu.map(item => <MenuOption as={Link} key={item.to} to={item.to}
    onClick={() => setOpen(false)}>{item.label}</MenuOption>);

  return <MenuContainer as="header">
    <HamburgerButton ref={trigger} aria-label="Abrir menu administrativo" aria-expanded={open}
      aria-controls="admin-mobile-menu" onClick={() => setOpen(true)}><GiHamburgerMenu size={28} /></HamburgerButton>
    <Logo><Link to="/admin" aria-label="Página inicial administrativa"><img src={logo} alt="ProgeteQuest" /></Link></Logo>
    <MenuContent as="nav" aria-label="Menu administrativo"><MenuOptions>{links}</MenuOptions></MenuContent>
    <RightBox><LogoutButton onClick={logout}><IoExitOutline size={26} />Sair</LogoutButton></RightBox>
    {open && <MobileMenu id="admin-mobile-menu" role="dialog" aria-modal="true" aria-label="Menu administrativo"
      onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div ref={panel}>
        <CloseButton onClick={() => setOpen(false)} aria-label="Fechar menu administrativo"><IoClose size={28} /></CloseButton>
        <nav aria-label="Opções administrativas">{links}</nav>
        <LogoutButton onClick={logout}><IoExitOutline size={26} />Sair</LogoutButton>
      </div>
    </MobileMenu>}
  </MenuContainer>;
}
