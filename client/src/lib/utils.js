import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount) {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
  // Normalize non-breaking spaces (\u00A0 and \u202F) to regular ASCII space
  return formatted.replace(/[\u00A0\u202F]/g, ' ')
}

export function formatDate(dateString) {
  if (!dateString) return "-"
  const date = new Date(dateString)
  const formatted = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
  // Normalize non-breaking spaces
  return formatted.replace(/[\u00A0\u202F]/g, ' ')
}

export function formatWhatsAppPhone(phone) {
  if (!phone) return ''
  let cleaned = String(phone).replace(/[^0-9]/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1)
  }
  return cleaned
}


