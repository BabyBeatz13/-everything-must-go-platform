"use client";

import { isSupabaseConfigured, supabase } from "./supabase";
import { supabaseMarketplace } from "./supabase-marketplace";

const ADDRESS_STORAGE_KEY_PREFIX = "emg-addresses-v1:";

type AccountSession = {
  email: string;
  name: string;
  authenticated: boolean;
};

export type ShippingAddress = {
  id: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ShippingAddressInput = Omit<ShippingAddress, "id" | "createdAt" | "updatedAt">;

function getSession(): AccountSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("emg-account-session");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AccountSession;
  } catch {
    return null;
  }
}

function getLocalKey(email: string) {
  return `${ADDRESS_STORAGE_KEY_PREFIX}${email.toLowerCase()}`;
}

function readLocalAddresses(email: string): ShippingAddress[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(getLocalKey(email));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as ShippingAddress[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalAddresses(email: string, addresses: ShippingAddress[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getLocalKey(email), JSON.stringify(addresses));
}

async function getUserId() {
  if (!isSupabaseConfigured()) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function getSavedAddresses() {
  const session = getSession();
  if (!session?.authenticated || !session.email) return [];

  if (!isSupabaseConfigured()) {
    return readLocalAddresses(session.email);
  }

  const profileId = await getUserId();
  if (!profileId) {
    return readLocalAddresses(session.email);
  }

  const { data, error } = await supabaseMarketplace
    .from("customer_addresses")
    .select("*")
    .eq("profile_id", profileId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return readLocalAddresses(session.email);
  }

  const normalized = (data as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id),
    firstName: String(row.first_name ?? ""),
    lastName: String(row.last_name ?? ""),
    addressLine1: String(row.address_line1 ?? ""),
    addressLine2: row.address_line2 ? String(row.address_line2) : "",
    city: String(row.city ?? ""),
    state: String(row.state ?? ""),
    postalCode: String(row.postal_code ?? ""),
    country: String(row.country ?? "US"),
    phone: row.phone ? String(row.phone) : "",
    isDefault: Boolean(row.is_default),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  }));

  writeLocalAddresses(session.email, normalized);
  return normalized;
}

export async function addSavedAddress(input: ShippingAddressInput) {
  const session = getSession();
  if (!session?.authenticated || !session.email) {
    throw new Error("You must be logged in to save an address.");
  }

  const now = new Date().toISOString();
  const localNew: ShippingAddress = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  if (!isSupabaseConfigured()) {
    const existing = readLocalAddresses(session.email);
    const next = input.isDefault
      ? [{ ...localNew, isDefault: true }, ...existing.map((address) => ({ ...address, isDefault: false }))]
      : [localNew, ...existing];
    writeLocalAddresses(session.email, next);
    return localNew;
  }

  const profileId = await getUserId();
  if (!profileId) {
    const existing = readLocalAddresses(session.email);
    const next = input.isDefault
      ? [{ ...localNew, isDefault: true }, ...existing.map((address) => ({ ...address, isDefault: false }))]
      : [localNew, ...existing];
    writeLocalAddresses(session.email, next);
    return localNew;
  }

  if (input.isDefault) {
    await supabaseMarketplace
      .from("customer_addresses")
      .update({ is_default: false, updated_at: now })
      .eq("profile_id", profileId);
  }

  const { data, error } = await supabaseMarketplace
    .from("customer_addresses")
    .insert({
      profile_id: profileId,
      first_name: input.firstName,
      last_name: input.lastName,
      address_line1: input.addressLine1,
      address_line2: input.addressLine2 || null,
      city: input.city,
      state: input.state,
      postal_code: input.postalCode,
      country: input.country,
      phone: input.phone || null,
      is_default: input.isDefault,
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Unable to save address.");
  }

  const saved: ShippingAddress = {
    id: String(data.id),
    firstName: String(data.first_name),
    lastName: String(data.last_name),
    addressLine1: String(data.address_line1),
    addressLine2: data.address_line2 ? String(data.address_line2) : "",
    city: String(data.city),
    state: String(data.state),
    postalCode: String(data.postal_code),
    country: String(data.country),
    phone: data.phone ? String(data.phone) : "",
    isDefault: Boolean(data.is_default),
    createdAt: String(data.created_at),
    updatedAt: String(data.updated_at),
  };

  const current = await getSavedAddresses();
  const next = [saved, ...current.filter((address) => address.id !== saved.id)];
  writeLocalAddresses(session.email, next);

  return saved;
}

export async function updateSavedAddress(addressId: string, input: ShippingAddressInput) {
  const session = getSession();
  if (!session?.authenticated || !session.email) {
    throw new Error("You must be logged in to update an address.");
  }

  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    const existing = readLocalAddresses(session.email);
    let next = existing.map((address) =>
      address.id === addressId
        ? { ...address, ...input, updatedAt: now }
        : address,
    );

    if (input.isDefault) {
      next = next.map((address) => ({ ...address, isDefault: address.id === addressId }));
    }

    writeLocalAddresses(session.email, next);
    return;
  }

  const profileId = await getUserId();
  if (!profileId) return;

  if (input.isDefault) {
    await supabaseMarketplace
      .from("customer_addresses")
      .update({ is_default: false, updated_at: now })
      .eq("profile_id", profileId);
  }

  const { error } = await supabaseMarketplace
    .from("customer_addresses")
    .update({
      first_name: input.firstName,
      last_name: input.lastName,
      address_line1: input.addressLine1,
      address_line2: input.addressLine2 || null,
      city: input.city,
      state: input.state,
      postal_code: input.postalCode,
      country: input.country,
      phone: input.phone || null,
      is_default: input.isDefault,
      updated_at: now,
    })
    .eq("id", addressId)
    .eq("profile_id", profileId);

  if (error) {
    throw new Error("Unable to update address.");
  }

  const fresh = await getSavedAddresses();
  writeLocalAddresses(session.email, fresh);
}

export async function deleteSavedAddress(addressId: string) {
  const session = getSession();
  if (!session?.authenticated || !session.email) {
    throw new Error("You must be logged in to delete an address.");
  }

  if (!isSupabaseConfigured()) {
    const existing = readLocalAddresses(session.email);
    const next = existing.filter((address) => address.id !== addressId);
    writeLocalAddresses(session.email, next);
    return;
  }

  const profileId = await getUserId();
  if (!profileId) return;

  const { error } = await supabaseMarketplace
    .from("customer_addresses")
    .delete()
    .eq("id", addressId)
    .eq("profile_id", profileId);

  if (error) {
    throw new Error("Unable to delete address.");
  }

  const fresh = await getSavedAddresses();
  writeLocalAddresses(session.email, fresh);
}

export async function setDefaultAddress(addressId: string) {
  const session = getSession();
  if (!session?.authenticated || !session.email) {
    throw new Error("You must be logged in to update default address.");
  }

  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    const existing = readLocalAddresses(session.email);
    const next = existing.map((address) => ({ ...address, isDefault: address.id === addressId, updatedAt: now }));
    writeLocalAddresses(session.email, next);
    return;
  }

  const profileId = await getUserId();
  if (!profileId) return;

  await supabaseMarketplace
    .from("customer_addresses")
    .update({ is_default: false, updated_at: now })
    .eq("profile_id", profileId);

  const { error } = await supabaseMarketplace
    .from("customer_addresses")
    .update({ is_default: true, updated_at: now })
    .eq("id", addressId)
    .eq("profile_id", profileId);

  if (error) {
    throw new Error("Unable to set default address.");
  }

  const fresh = await getSavedAddresses();
  writeLocalAddresses(session.email, fresh);
}
