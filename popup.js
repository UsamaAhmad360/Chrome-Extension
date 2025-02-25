document.getElementById("save-session").addEventListener("click", () => {
    chrome.runtime.getBackgroundPage((background) => {
      background.saveWindowSessions();
    });
  });
  
  document.getElementById("restore-session").addEventListener("click", () => {
    chrome.runtime.getBackgroundPage((background) => {
      chrome.storage.sync.get("savedSessions", (result) => {
        if (result.savedSessions) {
          let windowId = Object.keys(result.savedSessions)[0]; // Get the first saved window
          background.restoreWindowState(parseInt(windowId));
        }
      });
    });
  });
  
  document.getElementById("clear-sessions").addEventListener("click", () => {
    chrome.storage.sync.set({ savedSessions: {} }, () => {
      alert("All sessions have been cleared.");
    });
  });
  