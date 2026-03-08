# Hit Spooner

Hit Spooner is a Chrome extension designed to enhance your experience on Amazon Mechanical Turk (MTurk). The extension allows you to efficiently manage and interact with HITs (Human Intelligence Tasks) by providing features like fetching, filtering, auto-accept, dashboard and requester management.

## Features

### 🔍 HIT Management
- **Automatic HIT Fetching:** Continuously searches for and fetches available HITs based on your filters
- **Smart Filtering:** Filter HITs by minimum reward, qualification status, Master's qualification, and sort options
- **Scoop & Shovel:** Automatically accept HITs using the scoop (single HIT) or shovel (queue up multiple HITs) system
- **HIT Queue:** View and manage your current queue of accepted HITs
- **Earnings Tracking:** Monitor your total earnings and earnings per hour in real-time

### 🛡️ Requester Management
- **Block Requesters:** Block problematic requesters and automatically filter out all their HITs from your search results
  - Block requesters with poor approval rates or unfair practices
  - Manage blocked requesters through a dedicated modal
  - Unblock individual requesters or clear all blocks at once
  - Blocks persist across browser sessions
- **Favorite Requesters:** Mark your favorite requesters for quick identification
- **Requester Info Panel:** View detailed information about requesters including:
  - MTurk approval rates
  - Turkerview ratings (pay, communication, speed)
  - Average hourly wages
  - Recent HITs from the requester

### 📊 Dashboard & Analytics
- **Dashboard Modal:** View comprehensive statistics about your MTurk activity
- **Earnings Overview:** Track available earnings and total earned
- **Weekly Stats:** Monitor your performance over time with detailed statistics
- **Daily Stats Table:** Break down your daily activity and earnings

### ⚙️ Customization
- **8 Theme Options:** Choose from light, dark, blue, green, purple, pink, steel, and news themes
- **Sound Notifications:** Enable sound alerts when HITs are caught (multiple sound types available)
- **Update Intervals:** Configure how frequently HITs are fetched (1s to 3s options)
- **Flexible Layout:** Customizable panel sizes and column layouts

### 🎯 Keyboard Shortcuts & Controls
- **Quick Actions:** One-click access to preview, scoop, or shovel HITs
- **Auto-Pause:** Pause HIT gathering at any time
- **Auto-Resume:** Resume gathering with a single click

For detailed documentation on specific features, see the [docs](./docs) folder.

## Installation

To install and run Hit Spooner locally:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/cldevdad/hit-spooner.git
   cd hit-spooner
   ```

2. **Install Dependencies:**
   Make sure you have [Yarn](https://yarnpkg.com/) installed, then run:

   ```bash
   yarn
   ```

3. **Build the Extension:**
   To create a production build:

   ```bash
   yarn build
   ```

4. **Run in Development Mode:**
   To start the development server and watch for changes:

   ```bash
   yarn serve
   ```

   > **Tip:** For easier development, you can install the [Extensions Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) Chrome extension. This tool allows you to reload your extension with a single click, making it convenient to see your changes immediately without manually refreshing the extensions page.

5. **Load the Extension in Chrome:**

   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" by toggling the switch in the top-right corner.
   - Click on "Load unpacked" and select the `dist` folder inside your project directory.

6. **Reload the Extension:**
   After making changes, run the following to reload the extension automatically:
   ```bash
   yarn build
   ```

## Documentation

For more detailed information about specific features:

- **[Block Requesters Feature](./docs/BLOCK_REQUESTERS_FEATURE.md)** - Complete guide on blocking and managing requesters
- **[Block Requesters Summary](./docs/BLOCK_REQUESTERS_SUMMARY.md)** - Technical implementation details

## Contributing

Contributions are welcome! Please open an issue or submit a merge request for any bug fixes or feature enhancements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

For any questions or issues, please refer to the [issues page](https://github.com/cldevdad/hit-spooner/issues) on GitHub.
