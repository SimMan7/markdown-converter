import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Markdown to PDF Conversion Tips & Guides | convertmdtopdf.online',
  description: 'Learn how to convert Markdown to PDF, discover the best free converters, and master Markdown tips and tricks. Expert guides for technical writers and developers.',
  keywords: 'markdown to pdf blog, markdown conversion guides, free pdf converter tips, technical writing, markdown tutorials',
  openGraph: {
    title: 'Blog - Markdown to PDF Conversion Tips & Guides',
    description: 'Learn how to convert Markdown to PDF, discover the best free converters, and master Markdown tips and tricks.',
    url: 'https://convertmdtopdf.online/blog',
  },
}

const blogPosts = [
  {
    slug: 'how-to-convert-markdown-to-pdf',
    title: 'How to Convert Markdown Files to PDF Online for Free',
    excerpt: 'Learn the step-by-step process of converting your Markdown files to professional PDF documents using free online tools. Perfect for developers, writers, and content creators.',
    date: '2025-01-15',
    readTime: '5 min read',
    category: 'Tutorial',
    featured: true,
  },
  {
    slug: 'best-free-markdown-to-pdf-converters-2025',
    title: 'Best Free Markdown to PDF Converters in 2025',
    excerpt: 'Discover the top free Markdown to PDF converters available in 2025. Compare features, ease of use, and conversion quality to find the perfect tool for your needs.',
    date: '2025-01-10',
    readTime: '8 min read',
    category: 'Review',
    featured: true,
  },
  {
    slug: 'convert-markdown-to-word-documents',
    title: 'Step-by-Step Guide: Convert Markdown to Word Documents',
    excerpt: 'Master the art of converting Markdown files to Word documents (.docx) with our comprehensive guide. Preserve formatting and structure for professional documents.',
    date: '2025-01-05',
    readTime: '6 min read',
    category: 'Tutorial',
    featured: false,
  },
  {
    slug: 'markdown-tips-and-tricks',
    title: 'Markdown Tips and Tricks for Technical Writers',
    excerpt: 'Essential Markdown tips and tricks to improve your technical writing. Learn advanced formatting techniques, best practices, and productivity hacks.',
    date: '2025-01-01',
    readTime: '10 min read',
    category: 'Tips',
    featured: false,
  },
  {
    slug: 'troubleshooting-markdown-to-pdf-conversion',
    title: 'Troubleshooting Markdown to PDF Conversion Issues',
    excerpt: 'Common problems and solutions when converting Markdown to PDF. Fix formatting issues, resolve conversion errors, and ensure perfect output every time.',
    date: '2024-12-28',
    readTime: '7 min read',
    category: 'Troubleshooting',
    featured: false,
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Ad Sidebar Left */}
      <div className="ad-sidebar ad-sidebar-left">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Advertise Here</h3>
          <p className="text-sm text-gray-600">Premium ad space available</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500">Ad Space</p>
          <p className="text-xs text-gray-400 mt-2">230px × 600px</p>
        </div>
      </div>

      {/* Ad Sidebar Right */}
      <div className="ad-sidebar ad-sidebar-right">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Advertise Here</h3>
          <p className="text-sm text-gray-600">Premium ad space available</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500">Ad Space</p>
          <p className="text-xs text-gray-400 mt-2">230px × 600px</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Markdown to PDF Blog
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Expert guides, tips, and tutorials for converting Markdown files to PDF and Word documents.
            </p>
          </div>
        </header>

        {/* Blog Content */}
        <main className="py-12">
          <div className="max-w-4xl mx-auto">
            {/* Featured Posts */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-8 gradient-text">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {blogPosts.filter(post => post.featured).map((post) => (
                  <article key={post.slug} className="card hover:shadow-lg transition-shadow">
                    <div className="mb-4">
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-sm ml-3">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">
                      <Link href={`/blog/${post.slug}`} className="hover:text-purple-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <time className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</time>
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="text-purple-600 hover:text-purple-800 font-semibold text-sm"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* All Posts */}
            <section>
              <h2 className="text-3xl font-bold mb-8 gradient-text">All Articles</h2>
              <div className="space-y-6">
                {blogPosts.map((post) => (
                  <article key={post.slug} className="card hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                            {post.category}
                          </span>
                          <span className="text-gray-500 text-sm ml-3">{post.readTime}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">
                          <Link href={`/blog/${post.slug}`} className="hover:text-purple-600 transition-colors">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 mb-3">{post.excerpt}</p>
                        <time className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</time>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="btn-primary text-sm"
                        >
                          Read Article
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Newsletter Signup */}
            <section className="mt-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl p-8">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
                <p className="mb-6 opacity-90">
                  Get the latest Markdown conversion tips and tutorials delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button className="btn-primary bg-white text-purple-600 hover:bg-gray-100">
                    Subscribe
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">convertmdtopdf.online</h3>
                <p className="text-gray-400">
                  Free online Markdown to PDF and Word converter. 
                  Professional document conversion made simple.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                  <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/blog/how-to-convert-markdown-to-pdf" className="hover:text-white transition-colors">How to Convert Markdown to PDF</Link></li>
                  <li><Link href="/blog/markdown-tips" className="hover:text-white transition-colors">Markdown Tips & Tricks</Link></li>
                  <li><Link href="/blog/troubleshooting" className="hover:text-white transition-colors">Troubleshooting Guide</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <p className="text-gray-400">
                  Questions or feedback?<br />
                  We'd love to hear from you.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 convertmdtopdf.online. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Markdown to PDF Blog",
            "description": "Expert guides, tips, and tutorials for converting Markdown files to PDF and Word documents.",
            "url": "https://convertmdtopdf.online/blog",
            "publisher": {
              "@type": "Organization",
              "name": "convertmdtopdf.online"
            },
            "blogPost": blogPosts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "datePublished": post.date,
              "url": `https://convertmdtopdf.online/blog/${post.slug}`,
              "author": {
                "@type": "Organization",
                "name": "convertmdtopdf.online"
              }
            }))
          })
        }}
      />
    </div>
  )
}
