// Minimal utils file to satisfy webpack dependencies
// This file exists only to prevent build errors from cached references

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
