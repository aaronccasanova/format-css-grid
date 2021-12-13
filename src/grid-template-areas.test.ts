import {
  skipValues,
  formatGridTemplateAreas,
  getGridTemplateAreas,
} from './grid-template-areas'

describe('formatGridTemplateAreas', () => {
  it.each(skipValues)('should ignore non row value: %s', (skipValue) => {
    expect(formatGridTemplateAreas(skipValue)).toStrictEqual([skipValue])
  })

  describe('splits grid-template-areas value into an array', () => {
    it('splits a single row into an array', () => {
      expect(formatGridTemplateAreas('"a b"')).toStrictEqual(['a b'])
    })

    it('splits multiple rows into an array', () => {
      expect(formatGridTemplateAreas('"a b" "c d"')).toStrictEqual([
        'a b',
        'c d',
      ])
    })
  })

  describe('adds spacing to match the longest word in each column', () => {
    it('formats 1st row 1st column', () => {
      expect(formatGridTemplateAreas('"a b" "cc d"')).toStrictEqual([
        'a  b',
        'cc d',
      ])
    })

    it('formats 1st row 2nd column', () => {
      expect(formatGridTemplateAreas('"a b" "c dd"')).toStrictEqual([
        'a b ',
        'c dd',
      ])
    })

    it('formats 2nd row 1st column', () => {
      expect(formatGridTemplateAreas('"aa b" "c d"')).toStrictEqual([
        'aa b',
        'c  d',
      ])
    })

    it('formats 2nd row 2nd column', () => {
      expect(formatGridTemplateAreas('"a bb" "c d"')).toStrictEqual([
        'a bb',
        'c d ',
      ])
    })

    it('formats 1st row 1st and 2nd column', () => {
      expect(formatGridTemplateAreas('"a b" "cc ddd"')).toStrictEqual([
        'a  b  ',
        'cc ddd',
      ])
    })

    it('formats 2nd row 1st and 2nd column', () => {
      expect(formatGridTemplateAreas('"aa bbb" "c d"')).toStrictEqual([
        'aa bbb',
        'c  d  ',
      ])
    })
  })

  describe('adds null cell tokens to unbalanced columns', () => {
    it('adds null cell token in 1st row', () => {
      expect(formatGridTemplateAreas('"a" "c d"')).toStrictEqual(['a .', 'c d'])
    })

    it('adds null cell token in 2nd row', () => {
      expect(formatGridTemplateAreas('"a b" "c"')).toStrictEqual(['a b', 'c .'])
    })

    it('adds null cell token in 1st row with padding', () => {
      expect(formatGridTemplateAreas('"a" "cc ddd"')).toStrictEqual([
        'a  .  ',
        'cc ddd',
      ])
    })

    it('adds null cell token in 2nd row with padding', () => {
      expect(formatGridTemplateAreas('"aa bbb" "c"')).toStrictEqual([
        'aa bbb',
        'c  .  ',
      ])
    })
  })
})

describe('getGridTemplateAreas', () => {
  it('adds a single leading space if value has one row', () => {
    expect(
      getGridTemplateAreas({
        value: '"a b"',
      }),
    ).toBe(' "a b"')
  })

  it('adds new lines between rows', () => {
    expect(
      getGridTemplateAreas({
        value: '"a b" "c d"',
        tabWidth: 0,
      }),
    ).toBe('\n"a b"\n"c d"')
  })

  it('adds default indentation with spaces', () => {
    expect(
      getGridTemplateAreas({
        value: '"a b" "c d"',
      }),
    ).toBe('\n  "a b"\n  "c d"')
  })

  it('adds custom indentation with spaces', () => {
    expect(
      getGridTemplateAreas({
        value: '"a b" "c d"',
        tabWidth: 4,
      }),
    ).toBe('\n    "a b"\n    "c d"')
  })

  it('adds default indentation at a given column with spaces', () => {
    expect(
      getGridTemplateAreas({
        value: '"a b" "c d"',
        startColumn: 3,
      }),
    ).toBe('\n    "a b"\n    "c d"')
  })

  it('adds custom indentation at a given column with spaces', () => {
    expect(
      getGridTemplateAreas({
        value: '"a b" "c d"',
        tabWidth: 4,
        startColumn: 3,
      }),
    ).toBe('\n      "a b"\n      "c d"')
  })

  it('adds indentation with tabs', () => {
    expect(
      getGridTemplateAreas({
        value: '"a b" "c d"',
        tabWidth: 4, // This should be ignored
        useTabs: true,
      }),
    ).toBe('\n\t"a b"\n\t"c d"')
  })

  it('adds indentation at a given column with tabs', () => {
    expect(
      getGridTemplateAreas({
        value: '"a b" "c d"',
        startColumn: 3,
        useTabs: true,
      }),
    ).toBe('\n  \t"a b"\n  \t"c d"')
  })

  it('formats with single quotes', () => {
    expect(
      getGridTemplateAreas({
        value: '"a b" "c d"',
        singleQuote: true,
      }),
    ).toBe("\n  'a b'\n  'c d'")
  })
})
