'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [isConverting, setIsConverting] = useState(false)
  const [convertedFiles, setConvertedFiles] = useState<{pdf?: string, word?: string}>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/markdown' || selectedFile?.name.endsWith('.md') || selectedFile?.name.endsWith('.markdown')) {
      setFile(selectedFile)
      // Simulate preview generation
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setPreview(content)
      }
      reader.readAsText(selectedFile)
    } else {
      alert('Please select a valid Markdown file (.md or .markdown)')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('dragover')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('dragover')
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === 'text/markdown' || droppedFile.name.endsWith('.md') || droppedFile.name.endsWith('.markdown'))) {
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setPreview(content)
      }
      reader.readAsText(droppedFile)
    } else {
      alert('Please drop a valid Markdown file (.md or .markdown)')
    }
  }

  const handleConvert = async () => {
    if (!file) return
    
    setIsConverting(true)
    // Simulate conversion process
    setTimeout(() => {
      setConvertedFiles({
        pdf: `converted-${file.name.replace('.md', '.pdf')}`,
        word: `converted-${file.name.replace('.md', '.docx')}`
      })
      setIsConverting(false)
    }, 2000)
  }

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
        <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Free Markdown to PDF and Word Converter
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Convert your Markdown files to professional PDF and Word documents instantly. 
              No registration required, completely free.
            </p>
          </div>
        </header>

        {/* Main Converter Section */}
        <main className="py-12">
          <div className="max-w-4xl mx-auto">
            {/* File Upload Area */}
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-center mb-6 gradient-text">
                Upload Your Markdown File
              </h2>
              
              <div 
                className="upload-area"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold mb-2">Drag & Drop or Click to Upload</h3>
                <p className="text-gray-600 mb-4">Support for .md and .markdown files</p>
                <p className="text-sm text-gray-500">Maximum file size: 16MB</p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md,.markdown"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {file && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">
                    <strong>Selected file:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}

              <div className="text-center mt-6">
                <button
                  onClick={handleConvert}
                  disabled={!file || isConverting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConverting ? (
                    <>
                      <span className="loading-spinner mr-2"></span>
                      Converting...
                    </>
                  ) : (
                    'Convert to PDF & Word'
                  )}
                </button>
              </div>
            </div>

            {/* Preview Section */}
            {preview && (
              <div className="card mb-8">
                <h3 className="text-xl font-semibold mb-4">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{preview}</pre>
                </div>
              </div>
            )}

            {/* Download Section */}
            {convertedFiles.pdf && (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Download Converted Files</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button className="btn-primary bg-red-600 hover:bg-red-700">
                    📄 Download as PDF
                  </button>
                  <button className="btn-primary bg-blue-600 hover:bg-blue-700">
                    📝 Download as Word
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
              Why Choose Our Converter?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Convert files in seconds with our optimized processing engine.</p>
              </div>
              <div className="card text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-gray-600">Your files are processed securely and automatically deleted after conversion.</p>
              </div>
              <div className="card text-center">
                <div className="text-4xl mb-4">💯</div>
                <h3 className="text-xl font-semibold mb-2">100% Free</h3>
                <p className="text-gray-600">No registration, no hidden fees, no watermarks - completely free to use.</p>
              </div>
            </div>
          </div>

          {/* AI Platform Section */}
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl p-8">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Frustrated with AI Platform PDF Conversions?</h2>
              <p className="text-xl mb-8 opacity-90">
                If you keep getting Markdown files from AI platforms like ChatGPT, Claude, or other AI tools 
                and you're unhappy with their PDF conversion quality, use our website to convert your Markdown 
                to professional PDF or Word documents for free.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-2">Better Quality</h3>
                  <p className="opacity-90">Professional formatting that preserves your document structure and styling better than AI platform exports.</p>
                </div>
                <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
                  <p className="opacity-90">Convert to both PDF and Word (.docx) formats for maximum compatibility and editing flexibility.</p>
                </div>
                <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-2">Completely Free</h3>
                  <p className="opacity-90">No registration required, no hidden fees, no watermarks - just high-quality conversions at no cost.</p>
                </div>
              </div>
              <button className="btn-primary bg-white text-purple-600 hover:bg-gray-100">
                Convert Your AI-Generated Markdown Now
              </button>
            </div>
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
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
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
    </div>
  )
}
