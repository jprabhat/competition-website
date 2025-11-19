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

// Debug logger visible on page
function debugLog(msg) {
    console.log(msg);
    const debugDiv = document.getElementById('debugInfo');
    if (debugDiv) {
        const time = new Date().toLocaleTimeString();
        debugDiv.innerHTML += `<div>[${time}] ${msg}</div>`;
        debugDiv.scrollTop = debugDiv.scrollHeight;
    }
}

// ==================== DEEP LINK HANDLER ====================
class DeepLinkHandler {
    constructor(competitionId) {
        this.competitionId = competitionId;
        this.appOpened = false;
        this.attemptInProgress = false;
        this.startTime = null;

        this.httpsLink = `https://${CONFIG.domain}/comp/${competitionId}`;
        this.customSchemeLink = `leaderboardapp://open?comp=${competitionId}`;

        this.openAppBtn = document.getElementById('openAppBtn');
        this.downloadAppBtn = document.getElementById('downloadAppBtn');

        // Add debug div
        this.addDebugDiv();
        this.init();
    }

    addDebugDiv() {
        const debugDiv = document.createElement('div');
        debugDiv.id = 'debugInfo';
        debugDiv.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            max-height: 150px;
            overflow-y: auto;
            background: rgba(0,0,0,0.8);
            color: #0f0;
            font-family: monospace;
            font-size: 10px;
            padding: 10px;
            z-index: 9999;
            display: none;
        `;
        document.body.appendChild(debugDiv);
        
        // Show debug on mobile
        if (this.isMobileDevice()) {
            debugDiv.style.display = 'block';
        }
    }

    init() {
        const display = document.getElementById('competitionIdDisplay');
        if (display) display.textContent = this.competitionId;

        this.openAppBtn?.addEventListener('click', () => this.attemptDeepLink());
        this.downloadAppBtn?.addEventListener('click', () => this.downloadApp());

        debugLog('🚀 Handler initialized');
        debugLog(`Mobile device: ${this.isMobileDevice()}`);

        // Auto-attempt on mobile devices
        if (this.isMobileDevice()) {
            debugLog('Auto-attempting in 500ms...');
            setTimeout(() => this.attemptDeepLink(), 500);
        }
    }

    isMobileDevice() {
        return /Android/i.test(navigator.userAgent);
    }

    attemptDeepLink() {
        if (this.attemptInProgress) {
            debugLog('❌ Attempt already in progress');
            return;
        }

        debugLog('▶️ Starting deep link attempt');
        this.attemptInProgress = true;
        this.appOpened = false;
        this.startTime = Date.now();

        showLoader();
        showStatus('🔄 Opening app...', 'info');

        // Setup visibility detection
        const visibilityHandler = () => {
            if (document.hidden) {
                debugLog('✅ Page hidden - app opened!');
                this.handleAppOpened();
                document.removeEventListener('visibilitychange', visibilityHandler);
                window.removeEventListener('blur', blurHandler);
            }
        };

        const blurHandler = () => {
            debugLog('👁️ Window blurred');
            setTimeout(() => {
                if (!this.appOpened && document.hidden) {
                    debugLog('✅ Blur + hidden - app opened!');
                    this.handleAppOpened();
                    document.removeEventListener('visibilitychange', visibilityHandler);
                    window.removeEventListener('blur', blurHandler);
                }
            }, 200);
        };

        document.addEventListener('visibilitychange', visibilityHandler);
        window.addEventListener('blur', blurHandler);

        // Try custom scheme
        debugLog(`🔗 Trying custom scheme: ${this.customSchemeLink}`);
        window.location.href = this.customSchemeLink;

        // Try HTTPS fallback
        setTimeout(() => {
            if (!this.appOpened) {
                debugLog(`🔗 Trying HTTPS: ${this.httpsLink}`);
                window.location.href = this.httpsLink;
            }
        }, 600);

        // Final timeout check
        setTimeout(() => {
            const elapsed = Date.now() - this.startTime;
            debugLog(`⏱️ Timeout reached after ${elapsed}ms`);
            debugLog(`Hidden: ${document.hidden}, AppOpened: ${this.appOpened}`);
            
            document.removeEventListener('visibilitychange', visibilityHandler);
            window.removeEventListener('blur', blurHandler);

            if (!this.appOpened) {
                debugLog('⚠️ Showing download option');
                this.showDownloadOption();
            }
        }, CONFIG.deepLinkTimeout);
    }

    handleAppOpened() {
        this.appOpened = true;
        hideLoader();
        showStatus('✅ App opened successfully!', 'success');
    }

    showDownloadOption() {
        debugLog('📥 Displaying download button');
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
        debugLog('⬇️ Starting download');
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