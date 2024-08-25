(async () => {
  const open = (await import("open")).default;

  // Open the URL in the default web browser
  const browser = await open("http://reload.extensions", { wait: false });

  // Close the browser tab after a short delay
  setTimeout(() => {
    browser.kill();
  }, 1000);
})();
