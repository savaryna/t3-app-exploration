import { useRouter } from "next/router";
import type { PropsWithChildren } from "react";

export type HeaderProps = PropsWithChildren<{
  showBackButton?: boolean;
}>;

const Header = ({ children, showBackButton = false }: HeaderProps) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-zinc-100 bg-white/20 px-4 backdrop-blur-md">
      {showBackButton && (
        <button
          type="button"
          title="Go back"
          onClick={() => router.back()}
          className="rounded-full p-2 hover:cursor-pointer hover:bg-black/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"
            />
          </svg>
        </button>
      )}
      <p className="font-bold">{children}</p>
    </header>
  );
};

export default Header;
