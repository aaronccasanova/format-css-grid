# Format CSS Grid

Opinionated formatting utilities for CSS Grid.

## Installation

```sh
npm i format-css-grid
```

## Usage

Parse and format a CSS `grid-template-areas` declaration value into an array of grid area rows.

```ts
import { formatGridTemplateAreas } from 'format-css-grid'

const gridTemplateAreas = formatGridTemplateAreas('"aa b" "c dd"')
// => ["aa b ",
//     "c  dd"]
```

Format a CSS `grid-template-areas` declaration value.

```ts
interface GetGridTemplateAreasOptions {
  /** `grid-template-areas` value. */
  value: string
  /**
   * Start column of the `grid-template-areas` property name.
   */
  startColumn?: number
  /**
   * Number of spaces to use for indenting rows.
   * @default 2
   */
  tabWidth?: number
  /**
   * Convert `grid-template-areas` value to use single quotes.
   * @default false
   */
  singleQuote?: boolean
  /**
   * Use tabs for indenting rows.
   * @default false
   */
  useTabs?: boolean
}

import { getGridTemplateAreas } from 'format-css-grid'

const gridTemplateAreas = formatGridTemplateAreas({
  value: '"aa b" "c dd"',
  tabWidth: 2,
})
// => '\n  "aa b "\n  "c  dd"'
```
