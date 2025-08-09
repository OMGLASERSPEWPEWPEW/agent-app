# Agent App Setup

A React Native mobile app that connects to your AI agent server for intelligent assistance.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed on your MacBook
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your iPhone (from App Store)
- Agent server running on your PC

### Installation

1. **Create the project directory**
   ```bash
   mkdir agent-app
   cd agent-app
   ```

2. **Initialize with Expo**
   ```bash
   npx create-expo-app@latest . --template blank-typescript
   ```

3. **Install dependencies**
   ```bash
   npm install @expo/vector-icons @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack expo-linear-gradient react-native-safe-area-context react-native-screens expo-constants expo-device expo-network @react-native-async-storage/async-storage expo-file-system expo-sqlite
   ```

4. **Add the source files**
   - Copy all the provided source files into the project
   - Replace the default App.tsx with our custom one

5. **Start the development server**
   ```bash
   npx expo start
   ```

6. **Connect your iPhone**
   - Open Expo Go app on your iPhone
   - Scan the QR code from the terminal
   - Or connect via the same WiFi network

## 📱 App Structure

```
agent-app/
├── App.tsx                     # Main app component
├── index.js                    # Entry point
├── src/
│   ├── context/
│   │   └── ApiContext.tsx      # API connection management
│   └── screens/
│       ├── HomeScreen.tsx      # Dashboard with server status
│       ├── ChatScreen.tsx      # AI chat interface
│       └── SettingsScreen.tsx  # Server configuration
└── package.json
```

## 🔧 Configuration

### Setting Up Server Connection

1. **Find your PC's IP address**
   ```bash
   # On Windows PC (where your server runs)
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. **Configure in the app**
   - Open the app on your iPhone
   - Go to Settings tab
   - Enter your server URL: `http://YOUR_PC_IP:3001`
   - Tap "Save URL" and then "Test" to verify connection

### Default Server URL
The app defaults to `http://192.168.1.100:3001` - update this in Settings for your network.

## 🛠️ Features

### Current Features
- **Chat Interface**: Direct communication with AI agent
- **Server Status**: Real-time connection monitoring
- **Settings**: Configure server URL and test connection
- **Cross-Platform**: Works on iOS and Android via Expo

### App Store Compatibility
The app is designed with Apple App Store and Google Play Store requirements in mind:

- Uses only approved APIs and libraries
- No sensitive permissions required
- Self-contained with proper error handling
- Clean, native-style interface design

## 📋 Development Scripts

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser (for testing)
npm run web
```

## 🔗 Connection Types

### Local Network (Current Setup)
- Server runs on your PC
- Mobile app connects via local IP
- Perfect for personal use and testing

### Internet Deployment (Future)
1. **Server**: Deploy to cloud service (AWS, Digital Ocean)
2. **Domain**: Point domain to server
3. **HTTPS**: Add SSL certificate
4. **Mobile**: Update server URL in app

## 📦 Expo Configuration

For app store deployment, update `app.json`:

```json
{
  "expo": {
    "name": "AI Agent",
    "slug": "agent-app",
    "platforms": ["ios", "android"],
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.agentapp",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourcompany.agentapp",
      "versionCode": 1
    }
  }
}
```

## 🎨 Customization

### Styling
- Styles are separated from logic in dedicated style files
- Uses React Native's built-in styling system
- Color scheme and themes easily configurable
- Responsive design for different screen sizes

### Adding Features
The app is structured for easy expansion:
- Add new screens in `src/screens/`
- Create services in `src/services/`
- Extend context in `src/context/`
- Keep UX and logic cleanly separated

## 🐛 Troubleshooting

### Common Issues

**Can't connect to server:**
- Verify both devices on same WiFi network
- Check server is running on PC
- Confirm Windows Firewall allows Node.js
- Test server URL in phone's browser

**App crashes or won't start:**
- Clear Expo cache: `npx expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check React Native version compatibility

**Chat not working:**
- Check server logs for errors
- Verify API endpoints are responding
- Test with simple HTTP client first

### Development Tips

- Use `npx expo start --tunnel` for remote testing
- Enable debugging with `npx expo start --dev-client`
- Monitor network requests in Chrome DevTools
- Use console logs for troubleshooting API calls

## 🚀 Deployment

### Build for App Stores

1. **Configure app.json** with proper identifiers
2. **Add required assets** (icons, splash screens)
3. **Build with EAS Build** or Expo Build
4. **Submit to stores** via Expo Application Services

### Required Assets for App Stores
- **App Icons**: Add app icons in all required sizes
- **Launch Screen**: Create proper launch screen
- **Privacy Policy**: Add privacy policy URL
- **App Store Description**: Prepare app description and screenshots

---

**Need help?** Check the troubleshooting section or ensure your agent-server is running properly.