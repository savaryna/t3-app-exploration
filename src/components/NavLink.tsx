import { useRouter } from "next/router";
import type { MouseEventHandler, PropsWithChildren } from "react";

export type NavLinkProps = PropsWithChildren<{
  href: string;
}>;

const NavLink = ({ children, href }: NavLinkProps) => {
  const router = useRouter();

  const onClick: MouseEventHandler = (e) => {
    e.preventDefault();
    void router.push(href);
  };

  return (
    <a
      href={href}
      onClick={onClick}
      className={`flex items-center gap-5 rounded-full p-3 text-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 ${router.asPath === href ? "font-bold" : ""}`}
    >
      {children}
    </a>
  );
};

export default NavLink;
