export default function numberToCurrency(
  number: number,
  locale: string
): string {
  const normalizedNumber =
    !Number.isFinite(number) || Math.abs(number) < 0.001 ? 0 : number

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(normalizedNumber)
}
