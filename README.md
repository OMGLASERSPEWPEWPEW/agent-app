# Agent App

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
   npm install @expo/vector-icons @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack expo-linear-gradient react-native-safe-area-context react-native-screens expo-constants expo-device expo-network @react-native-async-storage/async-storage
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

## 📡 Features

### Home Screen
- Server connection status
- Quick access to chat and settings
- Conversation starters from server
- Server information display

### Chat Screen
- Real-time AI chat interface
- Message history
- Loading indicators
- Error handling for connection issues
- Support for conversation starters

### Settings Screen
- Server URL configuration
- Connection testing
- Setup instructions
- Troubleshooting help
- App information

## 🛠 Development

### Running the App

```bash
# Start development server
npx expo start

# Run on iOS simulator (requires Xcode)
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Run in web browser
npx expo start --web
```

### Building for Production

```bash
# Build for iOS (requires Apple Developer account)
eas build --platform ios

# Build for Android
eas build --platform android
```

## 🔗 API Integration

The app communicates with your agent-server using these endpoints:

- `GET /api/health` - Server health check
- `POST /api/chat/message` - Send chat messages
- `GET /api/chat/suggestions` - Get conversation starters

### API Context
The `ApiContext` manages:
- Server URL configuration
- Connection status monitoring  
- Message sending with error handling
- Automatic session management
- Network state awareness

## 🔒 Security & Privacy

- All communication with your server uses HTTP/HTTPS
- No data sent to external services
- Messages stored locally only during app session
- Server URL saved securely in device storage

## 📱 iOS App Store Preparation

### App Store Compatibility
- Uses only approved APIs and frameworks
- No restricted functionality
- Follows Apple's Human Interface Guidelines
- Implements proper error handling

### Required Changes for App Store
1. **App Icons**: Add app icons in all required sizes
2. **Launch Screen**: Create proper launch screen
3. **Privacy Policy**: Add privacy policy URL
4. **App Store Description**: Prepare app description and screenshots

### Build Configuration
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
    }
  }
}
```

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

### Local Network (Current Setup)
- Server runs on your PC
- Mobile app connects via local IP
- Perfect for personal use and testing

### Internet Deployment (Future)
1. **Server**: Deploy to cloud service (AWS, Digital Ocean)
2. **Domain**: Point domain to server
3. **HTTPS**: Add SSL certificate
4. **Mobile**: Update server URL in app

## 📄 License

MIT License - see LICENSE file for details

---

**Need help?** Check the troubleshooting section or ensure your agent-server is running properly.