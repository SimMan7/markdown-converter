// Shared in-memory storage for Vercel functions
// Note: This will reset on each deployment, but works for temporary file storage

class FileStorage {
  constructor() {
    this.files = new Map();
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 60 * 1000); // Cleanup every hour
  }

  set(filename, data) {
    this.files.set(filename, {
      ...data,
      timestamp: Date.now()
    });
    console.log(`File stored: ${filename}`);
  }

  get(filename) {
    const file = this.files.get(filename);
    if (file) {
      console.log(`File retrieved: ${filename}`);
      return file;
    }
    console.log(`File not found: ${filename}`);
    return null;
  }

  has(filename) {
    return this.files.has(filename);
  }

  delete(filename) {
    const deleted = this.files.delete(filename);
    if (deleted) {
      console.log(`File deleted: ${filename}`);
    }
    return deleted;
  }

  cleanup() {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour
    
    for (const [filename, data] of this.files.entries()) {
      if (now - data.timestamp > maxAge) {
        this.files.delete(filename);
        console.log(`Cleaned up old file: ${filename}`);
      }
    }
  }

  getStats() {
    return {
      totalFiles: this.files.size,
      files: Array.from(this.files.keys())
    };
  }
}

// Create a singleton instance
const fileStorage = new FileStorage();

export default fileStorage;
