// File upload and processing functionality
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const previewSection = document.getElementById('preview-section');
    const previewContent = document.getElementById('preview-content');
    const downloadPdfBtn = document.getElementById('download-pdf');
    const downloadWordBtn = document.getElementById('download-word');
    
    let currentFilename = null;

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Click to upload
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Handle file upload
    function handleFile(file) {
        if (!file.name.match(/\.(md|markdown)$/i)) {
            showNotification('Please select a valid Markdown file (.md or .markdown)', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        // Show loading state
        uploadArea.innerHTML = '<div class="loading"><div class="spinner"></div><p>Uploading...</p></div>';

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentFilename = data.filename;
                showPreview(data.preview_html, data.original_filename);
                showNotification('File uploaded successfully!', 'success');
            } else {
                showNotification(data.error || 'Upload failed', 'error');
                resetUploadArea();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Upload failed. Please try again.', 'error');
            resetUploadArea();
        });
    }

    // Show preview
    function showPreview(htmlContent, originalFilename) {
        previewContent.innerHTML = htmlContent;
        previewSection.style.display = 'block';
        
        // Enable download buttons
        downloadPdfBtn.disabled = false;
        downloadWordBtn.disabled = false;
        
        // Reset upload area
        resetUploadArea();
        
        // Scroll to preview
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Reset upload area
    function resetUploadArea() {
        uploadArea.innerHTML = `
            <div class="upload-content">
                <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <h3>Upload Markdown File</h3>
                <p>Drag and drop your .md or .markdown file here, or click to browse</p>
                <button class="upload-btn" onclick="document.getElementById('file-input').click()">Choose File</button>
            </div>
        `;
    }

    // Download PDF
    downloadPdfBtn.addEventListener('click', function() {
        if (!currentFilename) return;
        
        downloadPdfBtn.disabled = true;
        downloadPdfBtn.textContent = 'Generating PDF...';
        
        fetch(`/download/pdf/${currentFilename}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Convert base64 to blob and download
                const byteCharacters = atob(data.data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = data.filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                showNotification('PDF downloaded successfully!', 'success');
            } else {
                showNotification(data.error || 'PDF generation failed', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('PDF generation failed. Please try again.', 'error');
        })
        .finally(() => {
            downloadPdfBtn.disabled = false;
            downloadPdfBtn.textContent = 'Download PDF';
        });
    });

    // Download Word
    downloadWordBtn.addEventListener('click', function() {
        if (!currentFilename) return;
        
        downloadWordBtn.disabled = true;
        downloadWordBtn.textContent = 'Generating Word...';
        
        fetch(`/download/docx/${currentFilename}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Convert base64 to blob and download
                const byteCharacters = atob(data.data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = data.filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                showNotification('Word document downloaded successfully!', 'success');
            } else {
                showNotification(data.error || 'Word generation failed', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Word generation failed. Please try again.', 'error');
        })
        .finally(() => {
            downloadWordBtn.disabled = false;
            downloadWordBtn.textContent = 'Download Word';
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

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
});
