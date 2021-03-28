export const averageAnnualGrowthRate = (items) =>
  (items.reduce((acc, curr, index, arr) => {
    const accumulatedValue = index !== 1 ? acc : 0
    return accumulatedValue + (curr / arr[index - 1] - 1)
  }) /
    (items.length - 2)) *
  100

/*
Terminal Value: 

(FCF * (1 + g)) / (d - g)

Where:
FCF = Free cash flow for the last forecast period 
g = Terminal growth rate 
d = discount rate (which is usually the weighted average cost of capital)
  */
export const terminalValue = (freeCashFlow, terminalGrowthRate, discountRate) =>
  (freeCashFlow * (1 + terminalGrowthRate)) / (discountRate - terminalGrowthRate)
