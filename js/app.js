// ==================== CONFIGURATION ====================
// ==================== CONFIGURATION ====================
const CONFIG = {
    domain: 'https://leaderboard-app123.netlify.app/',   // or custom domain

    // APK hosted on GitHub Releases (Netlify can't host big files)
    apkUrl: 'https://github.com/jprabhat/competition-website/releases/download/v1.0.0/app-release.apk',

    // MUST match Flutter Android package name
    packageName: 'com.leaderboard.leaderboard',

    deepLinkTimeout: 2500,
};


// ==================== UTILITIES ====================
function getCompetitionId() {
    // Try to get from URL path: /comp/COMP123
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    
    if (pathSegments.length >= 2 && pathSegments[0] === 'comp') {
        return pathSegments[1];
    }
    
    // Fallback: try query parameter: ?id=COMP123
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || 'UNKNOWN';
}

function showElement(element) {
    element?.classList.remove('hidden');
}

function hideElement(element) {
    element?.classList.add('hidden');
}

function showStatus(message, type = 'info') {
    const status = document.getElementById('status');
    if (!status) return;
    
    status.textContent = message;
    status.className = `status ${type}`;
    showElement(status);
}

function showLoader() {
    const loader = document.getElementById('loader');
    const status = document.getElementById('status');
    showElement(loader);
    hideElement(status);
}

function hideLoader() {
    const loader = document.getElementById('loader');
    hideElement(loader);
}

// ==================== DEEP LINK HANDLER ====================
class DeepLinkHandler {
    constructor(competitionId) {
        this.competitionId = competitionId;
        this.appOpened = false;
        this.attemptCount = 0;
        
        // Generate deep link URLs
        this.httpsLink = `https://${CONFIG.domain}/comp/${competitionId}`;
        this.customSchemeLink = `leaderboardapp://open?comp=${competitionId}`;
        
        // Get DOM elements
        this.openAppBtn = document.getElementById('openAppBtn');
        this.downloadAppBtn = document.getElementById('downloadAppBtn');
        
        this.init();
    }
    
    init() {
        // Set competition ID in UI
        const display = document.getElementById('competitionIdDisplay');
        if (display) {
            display.textContent = this.competitionId;
        }
        
        // Bind event listeners
        this.openAppBtn?.addEventListener('click', () => this.attemptDeepLink());
        this.downloadAppBtn?.addEventListener('click', () => this.downloadApp());
        
        // Listen for visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.appOpened = true;
                hideLoader();
                showStatus('✅ App opened successfully!', 'success');
            }
        });
        
        // Auto-attempt on mobile devices
        if (this.isMobileDevice() && this.attemptCount === 0) {
            setTimeout(() => this.attemptDeepLink(), 500);
        }
    }
    
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    attemptDeepLink() {
        this.attemptCount++;
        showLoader();
        showStatus('🔄 Opening app...', 'info');
        
        // Try HTTPS deep link first (for verified links)
        this.tryOpenLink(this.httpsLink);
        
        // Fallback to custom scheme after 1 second
        setTimeout(() => {
            if (!this.appOpened) {
                this.tryOpenLink(this.customSchemeLink);
            }
        }, 1000);
        
        // Check if app opened after timeout
        setTimeout(() => {
            this.checkIfAppOpened();
        }, CONFIG.deepLinkTimeout);
    }
    
    tryOpenLink(url) {
        try {
            // Create invisible iframe method (more reliable)
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            
            // Also try direct navigation
            window.location.href = url;
            
            // Clean up iframe after 2 seconds
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 2000);
        } catch (e) {
            console.error('Deep link error:', e);
        }
    }
    
    checkIfAppOpened() {
        if (document.hidden || document.webkitHidden || this.appOpened) {
            // App likely opened
            this.appOpened = true;
            hideLoader();
            showStatus('✅ App opened successfully!', 'success');
        } else {
            // App not installed
            hideLoader();
            this.showDownloadOption();
        }
    }
    
    showDownloadOption() {
        showStatus('⚠️ App not installed. Please download it first!', 'error');
        showElement(this.downloadAppBtn);
        
        if (this.openAppBtn) {
            this.openAppBtn.innerHTML = `
                <span class="btn-icon">🔄</span>
                <span>Try Again</span>
            `;
        }
    }
    
    downloadApp() {
        // Start download
        window.location.href = CONFIG.apkUrl;
        
        showStatus('📥 Downloading app... Install and scan QR again!', 'success');
        
        // Show installation guide after 2 seconds
        setTimeout(() => {
            showStatus(
                '📱 After installing, scan the QR code again to open the app directly!',
                'info'
            );
        }, 2000);
    }
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on competition page
    if (window.location.pathname.includes('/comp')) {
        const competitionId = getCompetitionId();
        new DeepLinkHandler(competitionId);
        
        console.log('🚀 Deep Link Handler initialized for:', competitionId);
    }
});

// ==================== HOME PAGE - DOWNLOAD BUTTON ====================
// Add smooth scroll and download tracking
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        console.log('📱 Download initiated from home page');
        // Analytics tracking can be added here
    });
});