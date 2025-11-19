// ==================== CONFIGURATION ====================
const CONFIG = {
    domain: 'leaderboard-app123.netlify.app',
    apkUrl: 'https://github.com/jprabhat/competition-website/releases/download/v1.0.0/app-release.apk',
    packageName: 'com.leaderboard.leaderboard',
    deepLinkTimeout: 2000,
};

// ==================== UTILITIES ====================
function getCompetitionId() {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);

    if (pathSegments.length >= 2 && pathSegments[0] === 'comp') {
        return pathSegments[1];
    }

    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || 'UNKNOWN';
}

function showElement(el) {
    el?.classList.remove('hidden');
}

function hideElement(el) {
    el?.classList.add('hidden');
}

function showStatus(msg, type = 'info') {
    const status = document.getElementById('status');
    if (!status) return;
    status.textContent = msg;
    status.className = `status ${type}`;
    showElement(status);
}

function showLoader() {
    showElement(document.getElementById('loader'));
    hideElement(document.getElementById('status'));
}

function hideLoader() {
    hideElement(document.getElementById('loader'));
}

// ==================== DEEP LINK HANDLER ====================
class DeepLinkHandler {
    constructor(competitionId) {
        this.competitionId = competitionId;
        this.appOpened = false;
        this.attemptedOpen = false; // Prevent multiple attempts

        this.httpsLink = `https://${CONFIG.domain}/comp/${competitionId}`;
        this.customSchemeLink = `leaderboardapp://open?comp=${competitionId}`;

        this.openAppBtn = document.getElementById('openAppBtn');
        this.downloadAppBtn = document.getElementById('downloadAppBtn');

        this.init();
    }

    init() {
        const display = document.getElementById('competitionIdDisplay');
        if (display) display.textContent = this.competitionId;

        this.openAppBtn?.addEventListener('click', () => this.attemptDeepLink());
        this.downloadAppBtn?.addEventListener('click', () => this.downloadApp());

        // Listen for visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.attemptedOpen) {
                // User switched away - likely app opened
                this.appOpened = true;
                hideLoader();
                showStatus('✅ App opened successfully!', 'success');
            }
        });

        // Auto-attempt on mobile devices only once
        if (this.isMobileDevice()) {
            setTimeout(() => this.attemptDeepLink(), 500);
        }
    }

    isMobileDevice() {
        return /Android/i.test(navigator.userAgent);
    }

    attemptDeepLink() {
        // Prevent multiple simultaneous attempts
        if (this.attemptedOpen) {
            console.log('⚠️ Already attempting to open app');
            return;
        }

        this.attemptedOpen = true;
        this.appOpened = false;

        showLoader();
        showStatus('🔄 Opening app...', 'info');

        const startTime = Date.now();

        // Try HTTPS deep link first
        window.location.href = this.httpsLink;

        // Fallback to custom scheme after short delay
        setTimeout(() => {
            if (!this.appOpened) {
                window.location.href = this.customSchemeLink;
            }
        }, 800);

        // Check if app opened after timeout
        setTimeout(() => {
            const timeElapsed = Date.now() - startTime;
            
            // If page is still visible after timeout, app didn't open
            if (!document.hidden && !this.appOpened) {
                this.showDownloadOption();
            }
        }, CONFIG.deepLinkTimeout);
    }

    showDownloadOption() {
        hideLoader();
        showStatus('⚠️ App not installed. Please download it first!', 'error');
        showElement(this.downloadAppBtn);

        // Reset flag to allow retry
        this.attemptedOpen = false;

        if (this.openAppBtn) {
            this.openAppBtn.innerHTML = `
                <span class="btn-icon">🔄</span>
                <span>Try Again</span>
            `;
        }
    }

    downloadApp() {
        window.location.href = CONFIG.apkUrl;
        showStatus('📥 Downloading app... Install and reopen this page!', 'success');
    }
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('/comp')) {
        const id = getCompetitionId();
        new DeepLinkHandler(id);
        console.log(`🚀 Deep Link Handler initialized for: ${id}`);
    }
});

// ==================== HOME PAGE ====================
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('📱 Download started from homepage');
    });
});