"use client";

/**
 * LeadCapturePopup
 * ================
 * A non-intrusive modal that collects a visitor's email and phone number,
 * then displays a discount code. Currently powered by stub functions in
 * src/lib/discount-codes.ts — ready to be wired to a real backend.
 *
 * BEHAVIOUR
 * - Waits `config.delayMs` (default 4 s) after mount before appearing.
 * - Skips entirely if the user dismissed or submitted within `config.suppressDays`
 *   (default 7 days), tracked via localStorage.
 * - Dismissible via: backdrop click · X button · Escape key.
 * - Submitting the form calls `generateLeadCode()` (currently a stub), then
 *   shows the returned code with a one-click copy button.
 *
 * ADDING TO A PAGE
 * See src/components/popup/types.ts for a full how-to guide.
 *
 * WIRING TO BACKEND
 * See src/lib/discount-codes.ts for the upgrade path.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import type { PopupConfig, PopupPhase } from "./types";
import type { DiscountCode } from "@/lib/discount-codes";
import { generateLeadCode } from "@/lib/discount-codes";

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_DELAY_MS = 4000;
const DEFAULT_SUPPRESS_DAYS = 7;
const DEFAULT_HEADING = "Unlock 10% off your first order";
const DEFAULT_BODY =
  "Join thousands of patients optimizing their health. Enter your details to receive an exclusive discount code.";

// ─── Suppression helpers ──────────────────────────────────────────────────────

function getSuppressUntil(storageKey: string): number {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0; // localStorage unavailable (SSR guard)
  }
}

function setSuppressUntil(storageKey: string, days: number) {
  try {
    const until = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(storageKey, String(until));
  } catch {
    // localStorage unavailable — silently skip
  }
}

function isSuppressed(storageKey: string): boolean {
  return getSuppressUntil(storageKey) > Date.now();
}

// ─── Phone formatting helper ──────────────────────────────────────────────────

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface LeadCapturePopupProps {
  config: PopupConfig;
  /**
   * Affiliate slug from the HTTP-only cookie (resolved server-side in the
   * page component). Passed transparently to generateLeadCode() for
   * attribution — not displayed in the popup UI itself.
   * Null when no affiliate is present.
   */
  affiliateSlug?: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LeadCapturePopup({ config, affiliateSlug = null }: LeadCapturePopupProps) {
  const {
    storageKey,
    delayMs = DEFAULT_DELAY_MS,
    suppressDays = DEFAULT_SUPPRESS_DAYS,
    heading = DEFAULT_HEADING,
    body = DEFAULT_BODY,
    source = "popup",
  } = config;

  // Lifecycle phase
  const [phase, setPhase] = useState<PopupPhase>("idle");
  // Whether the card is in the DOM (false → return null)
  const [mounted, setMounted] = useState(false);
  // Whether CSS "open" classes are applied (drives animation)
  const [visible, setVisible] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Success state
  const [discountCode, setDiscountCode] = useState<DiscountCode | null>(null);
  const [copied, setCopied] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Close handler ───────────────────────────────────────────────────────────

  const close = useCallback(() => {
    if (phase === "closed") return;
    setVisible(false);
    // Wait for the CSS fade-out before removing from DOM
    setTimeout(() => {
      setMounted(false);
      setPhase("closed");
    }, 300);
    // Suppress for N days
    if (suppressDays > 0) {
      setSuppressUntil(storageKey, suppressDays);
    }
  }, [phase, storageKey, suppressDays]);

  // ── Mount / timer logic ─────────────────────────────────────────────────────

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;
    // Check suppression before scheduling
    if (isSuppressed(storageKey)) return;

    timerRef.current = setTimeout(() => {
      setMounted(true);
      // Two rAF trick: let the browser paint the element first so the
      // transition from invisible→visible is actually animated.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
          setPhase("open");
        });
      });
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [storageKey, delayMs]);

  // ── Escape key ──────────────────────────────────────────────────────────────

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && phase === "open") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, close]);

  // ── Form validation ─────────────────────────────────────────────────────────

  function validateEmail(val: string): string {
    if (!val.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address.";
    return "";
  }

  function validatePhone(val: string): string {
    const digits = val.replace(/\D/g, "");
    if (!digits) return "Phone number is required.";
    if (digits.length < 10) return "Enter a valid 10-digit phone number.";
    return "";
  }

  // ── Form submit ─────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const eErr = validateEmail(email);
    const pErr = validatePhone(phone);
    setEmailError(eErr);
    setPhoneError(pErr);
    if (eErr || pErr) return;

    setSubmitting(true);
    try {
      const code = await generateLeadCode({
        email: email.trim(),
        phone: phone.replace(/\D/g, ""),
        source,
        affiliateSlug,
      });
      setDiscountCode(code);
      setPhase("submitted");
      // After a successful submission we suppress for the full period
      if (suppressDays > 0) {
        setSuppressUntil(storageKey, suppressDays);
      }
    } catch (err) {
      // ── STUB NOTE ──────────────────────────────────────────────────────────
      // In production, surface a proper error message to the user.
      // For now, log and degrade gracefully.
      console.error("[LeadCapturePopup] generateLeadCode failed:", err);
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Copy to clipboard ───────────────────────────────────────────────────────

  async function copyCode() {
    if (!discountCode) return;
    try {
      await navigator.clipboard.writeText(discountCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — user can select manually
    }
  }

  // ── Early exit if not mounted ───────────────────────────────────────────────

  if (!mounted) return null;

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    // Overlay — always pointer-events-none when not visible to avoid blocking page
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      {/* Backdrop — click to dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={close}
        aria-label="Close popup"
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-heading"
        className={`relative w-full max-w-md rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-out ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M2 2l10 10M12 2L2 12"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="px-7 py-8">
          {phase === "submitted" && discountCode ? (
            // ── Success state ──────────────────────────────────────────────────
            <SuccessView code={discountCode} copied={copied} onCopy={copyCode} onClose={close} />
          ) : (
            // ── Form state ─────────────────────────────────────────────────────
            <FormView
              heading={heading}
              body={body}
              email={email}
              phone={phone}
              emailError={emailError}
              phoneError={phoneError}
              submitting={submitting}
              onEmailChange={(val) => {
                setEmail(val);
                if (emailError) setEmailError(validateEmail(val));
              }}
              onPhoneChange={(raw) => {
                const formatted = formatPhone(raw);
                setPhone(formatted);
                if (phoneError) setPhoneError(validatePhone(formatted));
              }}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── FormView sub-component ───────────────────────────────────────────────────

interface FormViewProps {
  heading: string;
  body: string;
  email: string;
  phone: string;
  emailError: string;
  phoneError: string;
  submitting: boolean;
  onEmailChange: (val: string) => void;
  onPhoneChange: (raw: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function FormView({
  heading,
  body,
  email,
  phone,
  emailError,
  phoneError,
  submitting,
  onEmailChange,
  onPhoneChange,
  onSubmit,
}: FormViewProps) {
  return (
    <>
      {/* Decorative accent bar */}
      <div className="mb-5 h-1 w-12 rounded-full bg-black" />

      <h2 id="popup-heading" className="text-xl font-bold leading-snug text-black">
        {heading}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="popup-email" className="mb-1.5 block text-xs font-semibold text-zinc-700">
            Email address
          </label>
          <input
            id="popup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-sm text-black placeholder-zinc-400 outline-none transition-colors focus:border-black focus:ring-2 focus:ring-black/10 ${
              emailError ? "border-red-400 bg-red-50" : "border-zinc-200 bg-white"
            }`}
          />
          {emailError && (
            <p className="mt-1 text-xs text-red-500" role="alert">
              {emailError}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="popup-phone" className="mb-1.5 block text-xs font-semibold text-zinc-700">
            Phone number
          </label>
          <input
            id="popup-phone"
            type="tel"
            autoComplete="tel"
            placeholder="(555) 000-0000"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-sm text-black placeholder-zinc-400 outline-none transition-colors focus:border-black focus:ring-2 focus:ring-black/10 ${
              phoneError ? "border-red-400 bg-red-50" : "border-zinc-200 bg-white"
            }`}
          />
          {phoneError && (
            <p className="mt-1 text-xs text-red-500" role="alert">
              {phoneError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 w-full rounded-2xl bg-black py-3.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Getting your code…" : "Get my discount →"}
        </button>
      </form>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-zinc-400">
        By submitting, you agree to receive marketing texts and emails from MyoGenix Pharma.
        No spam — unsubscribe anytime.
      </p>
    </>
  );
}

// ─── SuccessView sub-component ────────────────────────────────────────────────

interface SuccessViewProps {
  code: DiscountCode;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
}

function SuccessView({ code, copied, onCopy, onClose }: SuccessViewProps) {
  return (
    <div className="text-center">
      {/* Checkmark icon */}
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-black">
        <svg
          className="h-7 w-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 id="popup-heading" className="text-xl font-bold text-black">
        Your code is ready!
      </h2>
      <p className="mt-1.5 text-sm text-zinc-500">{code.description}</p>

      {/* Code display */}
      <div className="mt-5 flex items-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
        <span className="flex-1 py-3.5 text-center font-mono text-xl font-bold tracking-widest text-black">
          {code.code}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="flex shrink-0 items-center gap-1.5 border-l border-zinc-200 bg-white px-4 py-3.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-black"
          aria-label="Copy discount code"
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      <p className="mt-3 text-xs text-zinc-400">
        Apply this code at checkout. Valid for your first order only.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full rounded-2xl bg-black py-3.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
      >
        Start shopping →
      </button>
    </div>
  );
}
