"use client";

/**
 * Cart context
 *
 * One item per medicine (adding the same medicine replaces the existing config).
 * State is persisted to localStorage so the cart survives page refreshes.
 * drawerOpen controls the slide-out drawer from anywhere in the tree.
 */

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { OrderConfig } from "./checkout-types";
import type { Medicine } from "./pdp-types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  medicine: Medicine; // acts as unique ID — one slot per medicine
  config: OrderConfig;
  addedAt: number;
}

interface CartState {
  items: CartItem[];
  drawerOpen: boolean;
}

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; medicine: Medicine }
  | { type: "CLEAR" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "HYDRATE"; items: CartItem[] };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const idx = state.items.findIndex((i) => i.medicine === action.item.medicine);
      const items =
        idx >= 0
          ? state.items.map((item, i) => (i === idx ? action.item : item))
          : [...state.items, action.item];
      return { ...state, items };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.medicine !== action.medicine) };
    case "CLEAR":
      return { ...state, items: [] };
    case "OPEN_DRAWER":
      return { ...state, drawerOpen: true };
    case "CLOSE_DRAWER":
      return { ...state, drawerOpen: false };
    case "HYDRATE":
      return { ...state, items: action.items };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  drawerOpen: boolean;
  addItem: (config: OrderConfig) => void;
  removeItem: (medicine: Medicine) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  itemCount: number;
  hasItem: (medicine: Medicine) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "myogenix_cart";

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], drawerOpen: false });

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as CartItem[];
        if (Array.isArray(items) && items.length > 0) {
          dispatch({ type: "HYDRATE", items });
        }
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  // Persist items to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore storage errors (private browsing quota)
    }
  }, [state.items]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (state.drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [state.drawerOpen]);

  const addItem = useCallback((config: OrderConfig) => {
    dispatch({
      type: "ADD",
      item: { medicine: config.medicine, config, addedAt: Date.now() },
    });
  }, []);

  const removeItem = useCallback((medicine: Medicine) => {
    dispatch({ type: "REMOVE", medicine });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const openDrawer = useCallback(() => dispatch({ type: "OPEN_DRAWER" }), []);
  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), []);

  const hasItem = useCallback(
    (medicine: Medicine) => state.items.some((i) => i.medicine === medicine),
    [state.items]
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        drawerOpen: state.drawerOpen,
        addItem,
        removeItem,
        clearCart,
        openDrawer,
        closeDrawer,
        itemCount: state.items.length,
        hasItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
