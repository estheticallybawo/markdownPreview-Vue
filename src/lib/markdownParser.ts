import { marked } from 'marked'

/**
 * Initialize marked with security options
 */
marked.setOptions({
  breaks: true,
  gfm: true, // GitHub Flavored Markdown
})

/**
 * Parse markdown to HTML
 */
export const parseMarkdown = async (markdown: string): Promise<string> => {
  try {
    if (!markdown || typeof markdown !== 'string') {
      return ''
    }
    return await marked(markdown)
  } catch (error) {
    console.error('Error parsing markdown:', error)
    return `<p>Error parsing markdown: ${error}</p>`
  }
}

/**
 * Create a debounced parser function
 */
export const createDebouncedParser = (
  delay: number = 300,
): ((markdown: string, callback: (html: string) => void) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (markdown: string, callback: (html: string) => void) => {
    // Clear previous timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    // Set new timeout
    timeoutId = setTimeout(async () => {
      const html = await parseMarkdown(markdown)
      callback(html)
      timeoutId = null
    }, delay)
  }
}
