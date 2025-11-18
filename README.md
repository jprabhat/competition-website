# Competition Leaderboard Website

This website handles deep linking for the Competition Leaderboard mobile app.

## Features

- 🏠 Home page with app information
- 📱 Smart deep linking for installed apps
- ⬇️ APK download for non-installed apps
- 🔗 QR code landing pages for competitions

## Deployment

Deployed on Netlify with custom domain support.

## File Structure

- `index.html` - Home page
- `comp.html` - Competition landing page
- `css/style.css` - All styles
- `js/app.js` - Deep linking logic
- `.well-known/assetlinks.json` - Android App Links verification
- `_redirects` - Netlify routing rules
- `netlify.toml` - Netlify configuration

## Setup

1. Replace domain in `js/app.js` with your actual domain
2. Add your APK file to `downloads/app-release.apk`
3. Update `assetlinks.json` with your app's SHA256 fingerprint
4. Deploy to Netlify

## Testing

Test deep links with:
```bash
adb shell am start -a android.intent.action.VIEW -d "https://yourdomain.com/comp/COMP123"
```

## Support

For issues, contact support@yourcompany.com