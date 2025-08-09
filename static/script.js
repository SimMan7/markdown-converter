// DOM Elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const previewSection = document.getElementById('preview-section');
const previewContent = document.getElementById('preview-content');
const downloadPdfBtn = document.getElementById('download-pdf');
const downloadWordBtn = document.getElementById('download-word');

let currentFilename = null;

// File Upload Handling
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// File Processing
function handleFile(file) {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.md') && !file.name.toLowerCase().endsWith('.markdown')) {
        showNotification('Please select a Markdown file (.md or .markdown)', 'error');
        return;
    }
    
    // Validate file size (16MB max)
    if (file.size > 16 * 1024 * 1024) {
        showNotification('File size must be less than 16MB', 'error');
        return;
    }
    
    // Show loading state
    uploadArea.classList.add('loading');
    uploadArea.querySelector('.upload-content h3').textContent = 'Uploading...';
    uploadArea.querySelector('.upload-content p').textContent = 'Please wait while we process your file...';
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload file
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store filename for downloads
            currentFilename = data.filename;
            
            // Show preview
            previewContent.innerHTML = data.preview_html;
            previewSection.style.display = 'block';
            
            // Enable download buttons
            downloadPdfBtn.disabled = false;
            downloadWordBtn.disabled = false;
            
            // Show success notification
            showNotification('File uploaded successfully! Preview ready.', 'success');
            
            // Scroll to preview with smooth animation
            setTimeout(() => {
                previewSection.scrollIntoView({ behavior: 'smooth' });
            }, 500);
            
            // Reset upload area
            resetUploadArea();
        } else {
            throw new Error(data.error || 'Upload failed');
        }
    })
    .catch(error => {
        console.error('Upload error:', error);
        showNotification('Upload failed: ' + error.message, 'error');
        resetUploadArea();
    });
}

function resetUploadArea() {
    uploadArea.classList.remove('loading');
    uploadArea.querySelector('.upload-content h3').textContent = 'Upload Markdown File';
    uploadArea.querySelector('.upload-content p').textContent = 'Drag and drop your .md or .markdown file here, or click to browse';
}

// Download Handling
downloadPdfBtn.addEventListener('click', () => {
    if (currentFilename) {
        downloadFile('pdf', currentFilename);
    }
});

downloadWordBtn.addEventListener('click', () => {
    if (currentFilename) {
        downloadFile('docx', currentFilename);
    }
});

function downloadFile(format, filename) {
    // Show loading state
    const btn = format === 'pdf' ? downloadPdfBtn : downloadWordBtn;
    const originalText = btn.textContent;
    btn.textContent = 'Downloading...';
    btn.disabled = true;
    
    // Create download link
    const link = document.createElement('a');
    link.href = `/download/${format}/${filename}`;
    link.download = '';
    link.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Reset button
    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
    }, 2000);
}

// Auto-cleanup old files (optional)
setInterval(() => {
    // This could be implemented to clean up old files from server
    // For now, we'll just clear the current file after 1 hour
    if (currentFilename) {
        setTimeout(() => {
            currentFilename = null;
            downloadPdfBtn.disabled = true;
            downloadWordBtn.disabled = true;
            previewSection.style.display = 'none';
        }, 60 * 60 * 1000); // 1 hour
    }
}, 60 * 60 * 1000); // Check every hour

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}
