export function generateLocationCode(number: number): string {
  return `USAC-LOC-${number.toString().padStart(6, "0")}`;
}

export function generateItemCode(number: number): string {
  return `USAC-ITEM-${number.toString().padStart(6, "0")}`;
}