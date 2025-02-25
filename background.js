let sessionTabs = {};  // Store session data for each tab
let windowSessions = {}; // Store sessions per window

// Initialize sessions when a tab is created
chrome.tabs.onCreated.addListener((tab) => {
  const sessionId = generateSessionId();
  sessionTabs[tab.id] = {
    sessionId,
    accountDetails: null,
  };
});

// Listen for tab switches to update session IDs
chrome.tabs.onActivated.addListener((activeInfo) => {
  const sessionId = sessionTabs[activeInfo.tabId].sessionId;
  updateTabSession(activeInfo.tabId, sessionId);
});

// Listen for tab removal to clean up session data
chrome.tabs.onRemoved.addListener((tabId) => {
  delete sessionTabs[tabId];
});

// Listen for window creation and store window state
chrome.windows.onCreated.addListener((window) => {
  windowSessions[window.id] = [];
});

// Listen for window removal to clean up session data
chrome.windows.onRemoved.addListener((windowId) => {
  delete windowSessions[windowId];
});

// Generate a unique session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2);
}

// Update session data for a tab
function updateTabSession(tabId, sessionId) {
  // Set session cookies or other session data for the tab
  chrome.cookies.set({
    url: "https://example.com", // Change to your target URL
    name: "sessionid",
    value: sessionId,
    domain: "example.com",  // Change to your domain
    path: "/",
    secure: true,
    httpOnly: true
  });
}

// Save session states to sync storage
function saveWindowSessions() {
  chrome.storage.sync.set({ savedSessions: windowSessions }, () => {
    console.log("Session states saved.");
  });
}

// Restore session states from storage
function restoreWindowState(windowId) {
  const savedState = windowSessions[windowId];
  if (savedState) {
    chrome.windows.create({ url: 'about:blank' }, (newWindow) => {
      savedState.forEach((tabState) => {
        chrome.tabs.create({
          windowId: newWindow.id,
          url: 'https://example.com', // Change to desired URL
        }, (tab) => {
          sessionTabs[tab.id] = tabState;
          updateTabSession(tab.id, tabState.sessionId);
        });
      });
    });
  }
}

// Listen for storage changes (for synchronization)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.savedSessions) {
    windowSessions = changes.savedSessions.newValue;
  }
});
