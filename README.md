Here's the markdown source you can paste for your README.md:

# Hit Spooner

Hit Spooner is a Chrome extension designed to enhance your experience on Amazon Mechanical Turk (MTurk). The extension allows you to efficiently manage and interact with HITs (Human Intelligence Tasks) by providing features like fetching, filtering, auto-accept, dashboard and requester management.

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

## Contributing

Contributions are welcome! Please open an issue or submit a merge request for any bug fixes or feature enhancements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

For any questions or issues, please refer to the [issues page](https://github.com/cldevdad/hit-spooner/issues) on GitHub.
