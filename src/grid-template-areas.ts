import valueParser from 'postcss-value-parser'

export const skipValues = ['none', 'inherit', 'initial', 'revert', 'unset']

export function formatGridTemplateAreas(value: string): string[] {
  if (skipValues.includes(value)) return [value]

  const gridAreaRows: string[] = []

  valueParser(value).walk((node) => {
    if (node.type === 'string') gridAreaRows.push(node.value)
  })

  const normalizedGridAreas = gridAreaRows.map((row) => row.trim().split(/\s+/))

  /** Longest row length is used to fill empty cells in the grid */
  let longestRowLength = 0

  /** List of the longest named cell token in each column */
  const longestTokens: number[] = []

  normalizedGridAreas.forEach((row) => {
    if (row.length > longestRowLength) {
      longestRowLength = row.length
    }

    row.forEach((token, i) => {
      if (!longestTokens[i] || token.length > longestTokens[i]) {
        longestTokens[i] = token.length
      }
    })
  })

  const gridTemplateAreaRows: string[] = []

  for (let y = 0; y < normalizedGridAreas.length; y++) {
    const gridTemplateAreaRow = []

    for (let x = 0; x < longestRowLength; x++) {
      // Add null cell token if current column value is empty
      const token = normalizedGridAreas[y][x] || '.'

      // Add end padding based on the longest token in the current column
      gridTemplateAreaRow.push(token.padEnd(longestTokens[x], ' '))
    }

    gridTemplateAreaRows.push(gridTemplateAreaRow.join(' '))
  }

  return gridTemplateAreaRows
}

interface GetGridTemplateAreasOptions {
  value: string
  startColumn?: number
  tabWidth?: number
  singleQuote?: boolean
  useTabs?: boolean
}

export function getGridTemplateAreas({
  value,
  startColumn = 0,
  singleQuote = false,
  tabWidth = 2,
  useTabs = false,
}: GetGridTemplateAreasOptions): string {
  const quote = singleQuote ? "'" : '"'
  const tab = useTabs ? '\t' : ' '.repeat(tabWidth)

  const indent = ' '.repeat(startColumn > 1 ? startColumn - 1 : 0) + tab

  const gridTemplateAreas = formatGridTemplateAreas(value).map(
    (row) => `${quote}${row}${quote}`,
  )

  const hasOneRow = gridTemplateAreas.length === 1

  const separator = hasOneRow ? ' ' : `\n${indent}`

  return (hasOneRow ? ' ' : separator) + gridTemplateAreas.join(separator)
}
