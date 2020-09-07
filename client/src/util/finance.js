export const averageAnnualGrowthRate = (items) =>
  (items.reduce((acc, curr, index, arr) => {
    const accumulatedValue = index !== 1 ? acc : 0
    return accumulatedValue + (curr / arr[index - 1] - 1)
  }) /
    (items.length - 2)) *
  100
