// src/lib/blog.ts

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'security' | 'performance' | 'tutorials';
  publishedAt: string;
  readTime: string;
  author: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'client-side-web-tools-security',
    title: 'Why Client-Side Tools Are the Future of Developer Security',
    excerpt: 'Uploading raw code, configuration keys, or private JSON payloads to external servers is a security hazard. Here is how client-side execution solves privacy risks.',
    category: 'security',
    publishedAt: 'June 25, 2026',
    readTime: '4 min read',
    author: 'Sarah Lin',
    content: `
# Why Client-Side Tools Are the Future of Developer Security

Every day, thousands of developers copy and paste sensitive JSON configs, JWT tokens, SQL queries, or passwords into online formatters and calculators. What they do not realize is that many of these websites log inputs, send them to remote backends, or store them in caching layers.

## The Problem with Server-Based Tools

When you upload a JWT token to a remote parser:
1. **Exposure**: Your signatures and claim keys are sent over the network.
2. **Logs**: Application server logs might retain payloads, exposing internal databases or user details.
3. **Data Harvesting**: Some free utilities monetize by collecting inputs or cookies.

## The Solution: Zero-Server Execution

At **AllSetTools**, we design every text, developer, image, and financial tool to execute **purely in the client browser**. 

- **No Remote Requests**: Your JWT tokens, private text documents, or images are never uploaded to a server.
- **Immediate Executions**: Operations utilize local Javascript processes and HTML5 canvas layers, removing latency.
- **Offline Capable**: Once the page is loaded, most tools run without an internet connection.

By leveraging client-side Web APIs, developers can safely format, minify, generate, and calculate metrics without worrying about data leakage.
`
  },
  {
    slug: 'image-compression-techniques-for-web',
    title: 'How to Compress Images for Web Performance: A Developer Guide',
    excerpt: 'Learn the difference between lossy and lossless image compression and how browser canvas scaling performs instant client-side adjustments.',
    category: 'performance',
    publishedAt: 'June 20, 2026',
    readTime: '5 min read',
    author: 'Marcus Chen',
    content: `
# How to Compress Images for Web Performance

Large media files are the #1 contributor to slow page load times. To achieve a Google Lighthouse score above 95, developers must carefully compress and format images.

## Lossy vs. Lossless Compression

- **Lossy**: Discards visually imperceptible color information. Ideal for JPEG and WebP formats. Shrinks file size by 70-90%.
- **Lossless**: Compresses pixel structures without altering original visual states. Ideal for PNG icons. Shrinks file size by 20-45%.

## Client-Side Canvas Compression

Did you know your browser can handle compression without server scripts? Utilizing the HTML5 Canvas API:
1. Load the image file into a client-side \`Image\` object.
2. Render it onto an invisible canvas boundary.
3. Use \`canvas.toDataURL("image/jpeg", quality)\` where quality is a value from 0 to 1.

This allows users to compress multi-megabyte images in milliseconds, keeping the entire file process local and secure.
`
  },
  {
    slug: 'understanding-jwt-verification-claims',
    title: 'Understanding JWT Claims and Browser-Based Claims Decoding',
    excerpt: 'A deep dive into JSON Web Token (JWT) structures, headers, cryptographic payloads, and how to verify expiration values.',
    category: 'tutorials',
    publishedAt: 'June 15, 2026',
    readTime: '3 min read',
    author: 'Aleksey Petrov',
    content: `
# Understanding JWT Claims and Decoder Operations

JSON Web Tokens (JWT) are the standard for stateless user authentication. However, inspecting claim details during token validation is crucial for checking user roles or security clearances.

## The Three Components of a JWT

A JWT is composed of three strings separated by dots (\`.\`):
1. **Header**: Declares signature types and tokens.
2. **Payload**: Houses user details, expiration timestamps (\`exp\`), issue dates (\`iat\`), and permissions.
3. **Signature**: Cryptographic code validating that the token has not been tampered with.

## Decoding JWTs Client-Side

Because JWT structures use standard Base64URL encoding, decoding them is straightforward. The browser does not need to send the key to a database node to decode the claims. In Javascript:
\`\`\`javascript
const base64Url = token.split('.')[1];
const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
const jsonPayload = decodeURIComponent(window.atob(base64));
console.log(JSON.parse(jsonPayload));
\`\`\`
Checking claims locally enables developers to diagnose authorization issues instantly, ensuring security keys are not stored in third-party logs.
`
  }
];
