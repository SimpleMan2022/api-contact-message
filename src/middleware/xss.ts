import xss from "xss"

const xssOptions = {
  whiteList: {}, // No HTML tags are allowed
  blackList: {
    script: ["src", "onerror", "onload"], // Inline JavaScript
    iframe: ["src"], // Embedded frames
    img: ["src", "onerror"], // Images with potential JavaScript
    a: ["href", "onclick"], // Links that may contain JavaScript
    form: ["action"], // Forms that might redirect
    input: ["type", "value", "onchange"], // Form inputs with potential JavaScript
    button: ["onclick"], // Buttons with potential JavaScript
    object: ["data", "type", "codebase"], // Objects that may include JavaScript
    embed: ["type", "src"], // Embedded content
    base: ["href"], // Base tag for relative URLs
    meta: ["http-equiv", "content"], // Meta tags that might be used for XSS
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: true,
}

export const containsXSS = (input: string): boolean => {
  const sanitizedInput = xss(input, xssOptions)

  // Add additional regex patterns to catch more potential threats
  const xssPatterns = [
    /<script.*?>.*?<\/script>/i,
    /<iframe.*?>.*?<\/iframe>/i,
    /<object.*?>.*?<\/object>/i,
    /<embed.*?>.*?<\/embed>/i,
    /javascript:/i,
    /data:/i,
    /<img.*?>/i,
    /<a\s+[^>]*href\s*=\s*['"]\s*javascript:/i,
    /<a\s+[^>]*onclick\s*=\s*['"][^'"]*javascript:/i,
    /console\.log/i,
  ]

  return (
    xssPatterns.some((pattern) => pattern.test(input)) ||
    sanitizedInput !== input
  )
}
