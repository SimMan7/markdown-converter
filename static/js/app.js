// MarkdownConverter JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initFileUpload();
    initDownloadButtons();
    initScrollToTop();
    
    // Auto-dismiss alerts after 5 seconds
    setTimeout(function() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(function(alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
    }, 5000);
});

function initFileUpload() {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('file');
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            const file = fileInput.files[0];
            
            if (!file) {
                e.preventDefault();
                showAlert('Please select a file to upload.', 'warning');
                return;
            }
            
            // Validate file type
            const allowedTypes = ['.md', '.markdown'];
            const fileName = file.name.toLowerCase();
            const isValidType = allowedTypes.some(type => fileName.endsWith(type));
            
            if (!isValidType) {
                e.preventDefault();
                showAlert('Please select a valid Markdown file (.md or .markdown).', 'danger');
                return;
            }
            
            // Validate file size (16MB)
            const maxSize = 16 * 1024 * 1024;
            if (file.size > maxSize) {
                e.preventDefault();
                showAlert('File size exceeds 16MB limit. Please select a smaller file.', 'danger');
                return;
            }
            
            // Show loading modal
            loadingModal.show();
            
            // Add loading state to submit button
            const submitBtn = uploadForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }
        });
    }
    
    // File input change handler for immediate feedback
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Show file info
                const fileInfo = document.createElement('div');
                fileInfo.className = 'small text-muted mt-2';
                
                // Safe DOM manipulation to prevent XSS
                const icon = document.createElement('i');
                icon.className = 'fas fa-file-alt me-1';
                
                const textNode = document.createTextNode(`Selected: ${file.name} (${formatFileSize(file.size)})`);
                
                fileInfo.appendChild(icon);
                fileInfo.appendChild(textNode);
                
                // Remove any existing file info
                const existingInfo = fileInput.parentNode.querySelector('.file-info');
                if (existingInfo) {
                    existingInfo.remove();
                }
                
                fileInfo.className += ' file-info';
                fileInput.parentNode.appendChild(fileInfo);
            }
        });
    }
}

function initDownloadButtons() {
    const downloadButtons = document.querySelectorAll('a[href*="/download/"]');
    
    downloadButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            // Add loading state
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Preparing download...';
            button.classList.add('disabled');
            
            // Reset button after delay
            setTimeout(function() {
                button.innerHTML = originalText;
                button.classList.remove('disabled');
            }, 3000);
        });
    });
}

function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'btn btn-primary position-fixed';
    scrollBtn.style.cssText = 'bottom: 20px; right: 20px; z-index: 1000; border-radius: 50%; width: 50px; height: 50px; display: none;';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.title = 'Scroll to top';
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // Smooth scroll to top
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at the top of main content
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(alertDiv, main.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(function() {
            const bsAlert = new bootstrap.Alert(alertDiv);
            bsAlert.close();
        }, 5000);
    }
}

function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-triangle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// Enhanced file drag and drop functionality
function initDragAndDrop() {
    const fileInput = document.getElementById('file');
    const uploadCard = fileInput?.closest('.card');
    
    if (!uploadCard || !fileInput) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadCard.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadCard.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadCard.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    uploadCard.addEventListener('drop', handleDrop, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight(e) {
        uploadCard.classList.add('border-primary');
    }
    
    function unhighlight(e) {
        uploadCard.classList.remove('border-primary');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            fileInput.files = files;
            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
}

// Initialize drag and drop when DOM is ready
document.addEventListener('DOMContentLoaded', initDragAndDrop);
