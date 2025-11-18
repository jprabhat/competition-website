// ==================== CONFIGURATION ====================
const CONFIG = {
    domain: 'leaderboard-app123.netlify.app',  // correct domain (no https://)
    apkUrl: 'https://github.com/jprabhat/competition-website/releases/download/v1.0.0/app-release.apk',
    packageName: 'com.leaderboard.leaderboard',
    deepLinkTimeout: 2500,
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

        // Correct deep link URLs
        this.httpsLink = `https://${CONFIG.domain}/comp/${competitionId}`;
        this.customSchemeLink = `leaderboardapp://competition?id=${competitionId}`;

        this.openAppBtn = document.getElementById('openAppBtn');
        this.downloadAppBtn = document.getElementById('downloadAppBtn');

        this.init();
    }

    init() {
        const display = document.getElementById('competitionIdDisplay');
        if (display) display.textContent = this.competitionId;

        this.openAppBtn?.addEventListener('click', () => this.attemptDeepLink());
        this.downloadAppBtn?.addEventListener('click', () => this.downloadApp());

        // Detect if app opens (browser becomes hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.appOpened = true;
                hideLoader();
                showStatus('✅ App opened successfully!', 'success');
            }
        });

        if (this.isMobileDevice()) {
            setTimeout(() => this.attemptDeepLink(), 400);
        }
    }

    isMobileDevice() {
        return /Android/i.test(navigator.userAgent);
    }

    attemptDeepLink() {
        showLoader();
        showStatus('🔄 Opening app...', 'info');

        // 1. Try verified HTTPS link
        window.location.href = this.httpsLink;

        // 2. Fallback to custom scheme if not opened
        setTimeout(() => {
            if (!this.appOpened) {
                window.location.href = this.customSchemeLink;
            }
        }, 900);

        // 3. Final check
        setTimeout(() => this.checkIfAppOpened(), CONFIG.deepLinkTimeout);
    }

    checkIfAppOpened() {
        if (document.hidden || this.appOpened) {
            showStatus('✅ App opened successfully!', 'success');
            hideLoader();
        } else {
            this.showDownloadOption();
        }
    }

    showDownloadOption() {
        hideLoader();
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
        window.location.href = CONFIG.apkUrl;
        showStatus('📥 Downloading app... Install and reopen!', 'success');
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
