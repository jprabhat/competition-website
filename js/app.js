// // ==================== CONFIGURATION ====================
// const CONFIG = {
//     domain: 'leaderboard-app123.netlify.app',
//     apkUrl: 'https://github.com/jprabhat/competition-website/releases/download/v1.0.0/app-release.apk',
//     packageName: 'com.leaderboard.leaderboard',
//     deepLinkTimeout: 2500,
// };

// // ==================== UTILITIES ====================
// function getCompetitionId() {
//     const pathSegments = window.location.pathname.split('/').filter(Boolean);

//     if (pathSegments.length >= 2 && pathSegments[0] === 'comp') {
//         return pathSegments[1];
//     }

//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get('id') || 'UNKNOWN';
// }

// function showElement(el) {
//     el?.classList.remove('hidden');
// }

// function hideElement(el) {
//     el?.classList.add('hidden');
// }

// function showStatus(msg, type = 'info') {
//     const status = document.getElementById('status');
//     if (!status) return;
//     status.textContent = msg;
//     status.className = `status ${type}`;
//     showElement(status);
// }

// function showLoader() {
//     showElement(document.getElementById('loader'));
//     hideElement(document.getElementById('status'));
// }

// function hideLoader() {
//     hideElement(document.getElementById('loader'));
// }

// // ==================== DEEP LINK HANDLER ====================
// class DeepLinkHandler {
//     constructor(competitionId) {
//         this.competitionId = competitionId;
//         this.appOpened = false;
//         this.attemptedOpen = false;
//         this.checkTimer = null;

//         this.httpsLink = `https://${CONFIG.domain}/comp/${competitionId}`;
//         this.customSchemeLink = `leaderboardapp://open?comp=${competitionId}`;

//         this.openAppBtn = document.getElementById('openAppBtn');
//         this.downloadAppBtn = document.getElementById('downloadAppBtn');

//         this.init();
//     }

//     init() {
//         const display = document.getElementById('competitionIdDisplay');
//         if (display) display.textContent = this.competitionId;

//         this.openAppBtn?.addEventListener('click', () => this.attemptDeepLink());
//         this.downloadAppBtn?.addEventListener('click', () => this.downloadApp());

//         // Listen for page becoming hidden (app might have opened)
//         document.addEventListener('visibilitychange', () => {
//             if (document.hidden && this.attemptedOpen && !this.appOpened) {
//                 this.appOpened = true;
//                 this.clearCheckTimer();
//                 hideLoader();
//                 showStatus('✅ App opened successfully!', 'success');
//             }
//         });

//         // Listen for page blur (user switched away)
//         window.addEventListener('blur', () => {
//             if (this.attemptedOpen && !this.appOpened) {
//                 this.appOpened = true;
//                 this.clearCheckTimer();
//                 hideLoader();
//                 showStatus('✅ App opened successfully!', 'success');
//             }
//         });

//         // Auto-attempt on mobile devices
//         if (this.isMobileDevice()) {
//             setTimeout(() => this.attemptDeepLink(), 500);
//         }
//     }

//     isMobileDevice() {
//         return /Android/i.test(navigator.userAgent);
//     }

//     clearCheckTimer() {
//         if (this.checkTimer) {
//             clearTimeout(this.checkTimer);
//             this.checkTimer = null;
//         }
//     }

//     attemptDeepLink() {
//         // Prevent multiple simultaneous attempts
//         if (this.attemptedOpen && !this.appOpened) {
//             console.log('⚠️ Already attempting to open app');
//             return;
//         }

//         // Reset state for new attempt
//         this.attemptedOpen = true;
//         this.appOpened = false;
//         this.clearCheckTimer();

//         showLoader();
//         showStatus('🔄 Opening app...', 'info');

//         // Try HTTPS deep link first
//         window.location.href = this.httpsLink;

//         // Fallback to custom scheme after short delay
//         setTimeout(() => {
//             if (!this.appOpened) {
//                 window.location.href = this.customSchemeLink;
//             }
//         }, 800);

//         // Set timer to check if app opened
//         this.checkTimer = setTimeout(() => {
//             // If we're still here and page is focused, app didn't open
//             if (!this.appOpened && !document.hidden) {
//                 this.showDownloadOption();
//             }
//         }, CONFIG.deepLinkTimeout);
//     }

//     showDownloadOption() {
//         this.clearCheckTimer();
//         hideLoader();
//         showStatus('⚠️ App not installed. Please download it first!', 'error');
//         showElement(this.downloadAppBtn);

//         // Reset flag to allow retry
//         this.attemptedOpen = false;

//         if (this.openAppBtn) {
//             this.openAppBtn.innerHTML = `
//                 <span class="btn-icon">🔄</span>
//                 <span>Try Again</span>
//             `;
//         }
//     }

//     downloadApp() {
//         window.location.href = CONFIG.apkUrl;
//         showStatus('📥 Downloading app... Install and reopen this page!', 'success');
//     }
// }

// // ==================== INITIALIZE ====================
// document.addEventListener('DOMContentLoaded', () => {
//     if (window.location.pathname.includes('/comp')) {
//         const id = getCompetitionId();
//         new DeepLinkHandler(id);
//         console.log(`🚀 Deep Link Handler initialized for: ${id}`);
//     }
// });

// // ==================== HOME PAGE ====================
// document.querySelectorAll('.download-btn').forEach(btn => {
//     btn.addEventListener('click', () => {
//         console.log('📱 Download started from homepage');
//     });
// });


// ==================== CONFIGURATION ====================
const CONFIG = {
    domain: 'leaderboard-app123.netlify.app',
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
}

function hideLoader() {
    hideElement(document.getElementById('loader'));
}

// ==================== DEEP LINK HANDLER ====================
class DeepLinkHandler {
    constructor(competitionId) {
        this.competitionId = competitionId;
        this.appOpened = false;
        this.attemptInProgress = false;

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

        // Auto-attempt on mobile devices
        if (this.isMobileDevice()) {
            setTimeout(() => this.attemptDeepLink(), 500);
        }
    }

    isMobileDevice() {
        return /Android/i.test(navigator.userAgent);
    }

    attemptDeepLink() {
        if (this.attemptInProgress) {
            return;
        }

        this.attemptInProgress = true;
        this.appOpened = false;

        showLoader();
        showStatus('🔄 Opening app...', 'info');

        const startTime = Date.now();

        // Create hidden iframe for deep link (doesn't navigate away from page)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Track if user leaves
        const onPageHide = () => {
            this.appOpened = true;
            hideLoader();
            showStatus('✅ App opened successfully!', 'success');
        };

        document.addEventListener('visibilitychange', onPageHide);
        window.addEventListener('blur', onPageHide);
        window.addEventListener('pagehide', onPageHide);

        // Try custom scheme in iframe
        try {
            iframe.src = this.customSchemeLink;
        } catch (e) {
            // Ignore errors
        }

        // Try HTTPS link in iframe after delay
        setTimeout(() => {
            if (!this.appOpened) {
                try {
                    iframe.src = this.httpsLink;
                } catch (e) {
                    // Ignore errors
                }
            }
        }, 800);

        // GUARANTEED timeout that will ALWAYS run
        const timeoutId = setTimeout(() => {
            // Clean up
            document.removeEventListener('visibilitychange', onPageHide);
            window.removeEventListener('blur', onPageHide);
            window.removeEventListener('pagehide', onPageHide);
            
            try {
                document.body.removeChild(iframe);
            } catch (e) {
                // Ignore if already removed
            }

            // If app didn't open, show download
            if (!this.appOpened) {
                this.showDownloadOption();
            }
        }, CONFIG.deepLinkTimeout);
    }

    showDownloadOption() {
        hideLoader();
        showStatus('⚠️ App not installed. Please download it first!', 'error');
        showElement(this.downloadAppBtn);

        this.attemptInProgress = false;

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
    }
});

// ==================== HOME PAGE ====================
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('📱 Download started from homepage');
    });
});