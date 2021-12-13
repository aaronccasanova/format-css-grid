import valueParser from 'postcss-value-parser'

export const skipValues = ['none', 'inherit', 'initial', 'revert', 'unset']

interface GridTemplateAreaNode {
  type: 'row' | 'comment' | 'string'
  value: string
}

interface RowNode {
  /**
   * Parsed `grid-template-areas` row values.
   */
  tokens: string[]
  /**
   * to insert the formatted row back into the `gridTemplateAreaNodes` array.
   */
  index: number
}

const isRow = <T extends { type: string }>(node: T) =>
  node.type === 'row' || node.type === 'string'

const isComment = <T extends { type: string }>(node: T) =>
  node.type === 'comment'

export function formatGridTemplateAreas(value: string): string[] {
  if (skipValues.includes(value)) return [value]

  const gridTemplateAreaNodes: GridTemplateAreaNode[] = []

  valueParser(value).walk((node) => {
    if (isRow(node)) {
      gridTemplateAreaNodes.push({
        type: 'row',
        value: node.value,
      })
    } else if (isComment(node)) {
      gridTemplateAreaNodes.push({
        type: 'comment',
        value: node.value,
      })
    }
  })

  /** List of the longest named cell token in each column */
  const longestTokens: number[] = []
  const rowNodes: RowNode[] = []

  gridTemplateAreaNodes.forEach((node, index) => {
    if (!isRow(node)) return

    const tokens = node.value.trim().split(/\s+/)

    tokens.forEach((token, i) => {
      if (!longestTokens[i] || token.length > longestTokens[i]) {
        longestTokens[i] = token.length
      }
    })

    rowNodes.push({
      tokens,
      index,
    })
  })

  for (let row = 0; row < rowNodes.length; row++) {
    const rowNode = rowNodes[row]
    const rowTokens = []

    for (let column = 0; column < longestTokens.length; column++) {
      // Add null cell token if current column value is empty
      const token = rowNode.tokens[column] || '.'

      // Add end padding based on the longest token in the current column
      rowTokens.push(token.padEnd(longestTokens[column], ' '))
    }

    gridTemplateAreaNodes[rowNode.index].value = rowTokens.join(' ')
  }

  return gridTemplateAreaNodes.map((node) => {
    return isRow(node) ? node.value : `/*${node.value}*/`
  })
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

  const gridTemplateAreas = formatGridTemplateAreas(value).map((row) =>
    row.startsWith('/*') ? row : `${quote}${row}${quote}`,
  )

  const hasOneRow = gridTemplateAreas.length === 1

  const separator = hasOneRow ? ' ' : `\n${indent}`

  return (hasOneRow ? ' ' : separator) + gridTemplateAreas.join(separator)
}
