import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Oswald } from "next/font/google";
import { uiFont } from "@/lib/ui-font";
import { cn } from "@/lib/utils";

const ASSET_BASE = "/assets/grunge-redesign";
const oswald = Oswald({ subsets: ["latin"], weight: "700" });

export function PdpButton({
  children,
  href,
  onClick,
  variant = "red",
  className,
  type = "button",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "red" | "dark";
  className?: string;
  type?: "button" | "submit";
}) {
  const baseClass = cn(
    uiFont.className,
    "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-[1.35rem] font-normal uppercase leading-none tracking-[0.055em] text-white transition active:translate-y-px",
    variant === "red"
      ? "bg-red-600 shadow-[0_0_24px_rgba(220,38,38,0.35)] hover:bg-red-500"
      : "border-2 border-white/35 bg-black/70 hover:border-white/70 hover:text-red-100",
    className
  );

  const content = (
    <>
      <span>{children}</span>
      <Image src={`${ASSET_BASE}/cta-arrow.svg`} alt="" width={22} height={18} className="h-auto w-[22px]" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClass}>
      {content}
    </button>
  );
}

export function PdpSection({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative overflow-hidden border-t border-red-700/70 bg-black text-white", className)}>
      <Image
        src={`${ASSET_BASE}/grunge black section bg blank.png`}
        alt=""
        fill
        className="object-cover opacity-55"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(220,38,38,0.16),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.82))]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function PdpPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grunge-panel border border-white/20 bg-black/68 shadow-[0_24px_55px_rgba(0,0,0,0.5)] backdrop-blur-sm", className)}>
      {children}
    </div>
  );
}

export function PdpKicker({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <p className={cn(uiFont.className, "grunge-kicker uppercase text-red-500", className)} style={style}>
      {children}
    </p>
  );
}

export function PdpWord({
  children,
  tone = "white",
}: {
  children: string;
  tone?: "red" | "white";
}) {
  return (
    <span
      className={cn(oswald.className, "grunge-word")}
      style={{ "--grunge-color": tone === "red" ? "#dc2626" : "#ffffff" } as CSSProperties}
    >
      {children}
    </span>
  );
}

export function PdpCheckLine({
  children,
  className,
  iconClassName,
}: {
  children: ReactNode;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <li className={cn(uiFont.className, "flex items-center gap-2 text-[1.18rem] font-normal uppercase leading-none tracking-[0.055em] text-zinc-200", className)}>
      <Image
        src={`${ASSET_BASE}/checkbox.svg`}
        alt=""
        width={15}
        height={15}
        className={cn("h-[15px] w-[15px] shrink-0", iconClassName)}
      />
      <span>{children}</span>
    </li>
  );
}

export function PdpIcon({ icon, className }: { icon: string; className?: string }) {
  return (
    <Image
      src={`${ASSET_BASE}/${icon}`}
      alt=""
      width={42}
      height={42}
      className={cn(
        "h-10 w-10 object-contain opacity-90",
        icon === "box.svg" && "h-12 w-12",
        className
      )}
    />
  );
}
