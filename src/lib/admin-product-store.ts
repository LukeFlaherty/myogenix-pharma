/**
 * Admin product store — mutable in-memory product catalogue.
 *
 * ARCHITECTURE:
 *   This module owns the authoritative product state for the running server.
 *   It is seeded from pdp-config.ts at startup and can be mutated by admin
 *   server actions. Mutations persist for the lifetime of the dev server process.
 *
 * TO WIRE REAL DB:
 *   1. Add a `products` table to your schema with columns mirroring
 *      AdminProduct (medicine, name, description, tagline, benefit, doseUnit,
 *      consultFee, escalationStep, active, imageKey, doses JSON[]).
 *   2. Replace getProduct() / getAllProducts() with prisma.product.findUnique/findMany.
 *   3. Replace saveProduct() / saveDoses() with prisma.product.update.
 *   4. Delete this file.
 *
 * IMAGE STORAGE:
 *   Currently images are served from /public/products/<medicine>.webp.
 *   Production: upload to S3, store the key in products.imageKey, serve via CDN.
 *   The imageKey field is stubbed here so the DB schema is forward-compatible.
 */

import { MEDICINE_CONFIG, PEPTIDE_MEDICINES, GLP1_MEDICINES } from "./pdp-config";
import type { Medicine, ProductCategory } from "./pdp-types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminDoseTier {
  mg: number;
  label: string;
  pricePerMonth: number;
}

export interface AdminProduct {
  medicine: Medicine;
  name: string;
  genericName: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  benefit: string;
  doseUnit: string;
  consultFee: number;
  escalationStep: number;
  startingDose: number;
  doses: AdminDoseTier[];
  /** Whether the product is shown on the storefront */
  active: boolean;
  /**
   * Image key for product image.
   * In dev: maps to /public/products/<medicine>.webp
   * In production: S3 key, served via CDN URL.
   */
  imageKey: string;
  updatedAt: string;
  updatedBy: string; // staffId or "system"
}

// ─── Seed from pdp-config ─────────────────────────────────────────────────────

const ALL_MEDICINES: Medicine[] = [...GLP1_MEDICINES, ...PEPTIDE_MEDICINES];

// Module-level mutable store. Keyed by medicine slug.
export const PRODUCT_STORE: Map<Medicine, AdminProduct> = new Map(
  ALL_MEDICINES.map((medicine) => {
    const cfg = MEDICINE_CONFIG[medicine];
    const product: AdminProduct = {
      medicine,
      name: cfg.name,
      genericName: cfg.genericName,
      category: cfg.category,
      tagline: cfg.tagline,
      description: cfg.description,
      benefit: cfg.benefit,
      doseUnit: cfg.doseUnit,
      consultFee: cfg.consultFee,
      escalationStep: cfg.escalationStep,
      startingDose: cfg.startingDose,
      doses: cfg.doses.map((d) => ({ mg: d.mg, label: d.label, pricePerMonth: d.pricePerMonth })),
      active: true,
      imageKey: `products/${medicine}.webp`,
      updatedAt: new Date().toISOString(),
      updatedBy: "system",
    };
    return [medicine, product];
  })
);

// ─── Query helpers ────────────────────────────────────────────────────────────

export function getAllProducts(): AdminProduct[] {
  return Array.from(PRODUCT_STORE.values());
}

export function getProduct(medicine: Medicine): AdminProduct | undefined {
  return PRODUCT_STORE.get(medicine);
}

export function getActiveProducts(): AdminProduct[] {
  return getAllProducts().filter((p) => p.active);
}

// ─── Mutation helpers (called by server actions) ──────────────────────────────

export function saveProductMeta(
  medicine: Medicine,
  updates: Partial<Pick<AdminProduct, "name" | "genericName" | "tagline" | "description" | "benefit" | "doseUnit" | "consultFee" | "escalationStep" | "startingDose">>,
  staffId: string
): AdminProduct {
  const current = PRODUCT_STORE.get(medicine);
  if (!current) throw new Error(`Product not found: ${medicine}`);
  const updated: AdminProduct = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
    updatedBy: staffId,
  };
  PRODUCT_STORE.set(medicine, updated);
  // TODO: await prisma.product.update({ where: { medicine }, data: { ...updates } })
  return updated;
}

export function saveProductDoses(
  medicine: Medicine,
  doses: AdminDoseTier[],
  staffId: string
): AdminProduct {
  const current = PRODUCT_STORE.get(medicine);
  if (!current) throw new Error(`Product not found: ${medicine}`);
  const updated: AdminProduct = {
    ...current,
    doses,
    startingDose: doses[0]?.mg ?? current.startingDose,
    updatedAt: new Date().toISOString(),
    updatedBy: staffId,
  };
  PRODUCT_STORE.set(medicine, updated);
  // TODO: await prisma.productDose.deleteMany + createMany
  return updated;
}

export function toggleProductActive(
  medicine: Medicine,
  active: boolean,
  staffId: string
): AdminProduct {
  const current = PRODUCT_STORE.get(medicine);
  if (!current) throw new Error(`Product not found: ${medicine}`);
  const updated: AdminProduct = {
    ...current,
    active,
    updatedAt: new Date().toISOString(),
    updatedBy: staffId,
  };
  PRODUCT_STORE.set(medicine, updated);
  // TODO: await prisma.product.update({ where: { medicine }, data: { active } })
  return updated;
}

export function saveProductImageKey(
  medicine: Medicine,
  imageKey: string,
  staffId: string
): AdminProduct {
  const current = PRODUCT_STORE.get(medicine);
  if (!current) throw new Error(`Product not found: ${medicine}`);
  const updated: AdminProduct = { ...current, imageKey, updatedAt: new Date().toISOString(), updatedBy: staffId };
  PRODUCT_STORE.set(medicine, updated);
  // TODO: await prisma.product.update({ where: { medicine }, data: { imageKey } })
  return updated;
}
