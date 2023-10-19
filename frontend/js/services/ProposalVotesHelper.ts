export const getSpentPercentage = (
  budget: number | null | undefined,
  creditsSpent: number | null | undefined,
): number => {
  if (!budget || !creditsSpent) return 0
  const percentage = creditsSpent > 0 && budget > 0 ? (creditsSpent / budget) * 100 : 0
  return Math.round(percentage * 100) / 100
}
export default getSpentPercentage
