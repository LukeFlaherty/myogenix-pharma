"use server";

/**
 * Admin product management server actions.
 *
 * All mutations update the in-memory PRODUCT_STORE and revalidate the
 * relevant paths. See admin-product-store.ts for the migration path to a
 * real DB.
 *
 * IMAGE UPLOAD:
 *   uploadProductImageAction is intentionally stubbed. Real implementation:
 *     1. Receive file via FormData
 *     2. Upload to S3 with `@aws-sdk/client-s3` + presigned URL
 *     3. Call saveProductImageKey(medicine, s3Key, session.staffId)
 *     4. Serve via CloudFront / Next.js Image with remotePatterns config
 */

import { revalidatePath } from "next/cache";
import { getAdminSession } from "./admin-auth";
import {
  saveProductMeta,
  saveProductDoses,
  toggleProductActive,
  saveProductImageKey,
} from "./admin-product-store";
import type { AdminDoseTier } from "./admin-product-store";
import type { Medicine } from "./pdp-types";

function revalidateProduct(medicine: string) {
  revalidatePath(`/admin/products/${medicine}`);
  revalidatePath("/admin/products");
  revalidatePath(`/peptides/${medicine}`);
  revalidatePath(`/weight-management/${medicine}`);
}

// ─── Save product metadata ────────────────────────────────────────────────────

export async function saveProductMetaAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session || session.role === "pharmacy") throw new Error("Unauthorized");

  const medicine = formData.get("medicine") as Medicine;

  saveProductMeta(
    medicine,
    {
      name:          (formData.get("name") as string).trim(),
      genericName:   (formData.get("genericName") as string).trim(),
      tagline:       (formData.get("tagline") as string).trim(),
      description:   (formData.get("description") as string).trim(),
      benefit:       (formData.get("benefit") as string).trim(),
      doseUnit:      (formData.get("doseUnit") as string).trim(),
      consultFee:    Number(formData.get("consultFee")),
      escalationStep: Number(formData.get("escalationStep")),
    },
    session.staffId
  );

  revalidateProduct(medicine);
}

// ─── Save dose tiers ──────────────────────────────────────────────────────────

export async function saveProductDosesAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session || session.role === "pharmacy") throw new Error("Unauthorized");

  const medicine = formData.get("medicine") as Medicine;
  const rawDoses = formData.get("doses") as string;

  let doses: AdminDoseTier[];
  try {
    doses = JSON.parse(rawDoses);
  } catch {
    throw new Error("Invalid dose data");
  }

  if (!Array.isArray(doses) || doses.length === 0) {
    throw new Error("At least one dose tier is required");
  }

  saveProductDoses(medicine, doses, session.staffId);
  revalidateProduct(medicine);
}

// ─── Toggle active ────────────────────────────────────────────────────────────

export async function toggleProductActiveAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session || session.role !== "admin") throw new Error("Only admins can activate/deactivate products");

  const medicine = formData.get("medicine") as Medicine;
  const active   = formData.get("active") === "true";

  toggleProductActive(medicine, active, session.staffId);
  revalidateProduct(medicine);
}

// ─── Image upload (stub) ──────────────────────────────────────────────────────

export async function uploadProductImageAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session || session.role === "pharmacy") throw new Error("Unauthorized");

  const medicine = formData.get("medicine") as Medicine;
  // const file = formData.get("image") as File;

  /**
   * TODO: Real implementation
   *   1. const buffer = Buffer.from(await file.arrayBuffer())
   *   2. const key = `products/${medicine}-${Date.now()}.webp`
   *   3. await s3.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, Body: buffer, ContentType: file.type }))
   *   4. saveProductImageKey(medicine, key, session.staffId)
   *
   * Also add the S3 hostname to next.config.ts remotePatterns so <Image> can serve it.
   */

  // Stub: just confirm existing key is still the default
  saveProductImageKey(medicine, `products/${medicine}.webp`, session.staffId);
  revalidateProduct(medicine);
}
