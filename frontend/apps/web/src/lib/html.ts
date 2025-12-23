/**
 * HTML utility functions.
 */

/**
 * Strip HTML tags from a string and return plain text.
 * Also removes image tags, scripts, and style elements.
 */
export function stripHtmlTags(html: string | null | undefined): string {
  if (!html) return ''

  // Create a temporary DOM element to parse HTML
  const temp = document.createElement('div')
  temp.innerHTML = html

  // Remove unwanted elements
  const unwantedTags = ['img', 'script', 'style', 'iframe', 'svg']
  unwantedTags.forEach((tag) => {
    const elements = temp.getElementsByTagName(tag)
    while (elements[0]) {
      elements[0].remove()
    }
  })

  // Get text content and clean up whitespace
  return temp.textContent?.trim().replace(/\s+/g, ' ') || ''
}

/**
 * Process HTML content for safe rendering.
 * Handles HTML entity decoding for plain text and ensures proper formatting.
 *
 * NOTE: We do NOT decode HTML entities for content that already contains HTML tags,
 * because that would convert escaped code examples like `&lt;img&gt;` into actual
 * HTML elements, breaking inline code display.
 */
export function processHtmlContent(html: string | null | undefined): string {
  if (!html) return ''

  // Check if content already contains HTML tags BEFORE decoding
  // This preserves escaped entities inside <code> tags like &lt;img&gt;
  if (html.match(/<[a-z][\s\S]*>/i)) {
    // Content has HTML tags - return as-is without entity decoding
    return html
  }

  // For plain text content, decode HTML entities
  const temp = document.createElement('textarea')
  temp.innerHTML = html
  const decoded = temp.value

  // Wrap plain text in paragraphs
  return decoded
    .split(/\n\n+/)
    .map((para) => para.trim())
    .filter((para) => para.length > 0)
    .map((para) => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('')
}
