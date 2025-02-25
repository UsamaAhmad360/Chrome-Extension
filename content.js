// This script can be used to auto-fill forms or inject session-specific data
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("#loginForm");
    if (loginForm) {
      // Retrieve account details from storage
      chrome.storage.sync.get("accountDetails", (data) => {
        if (data.accountDetails) {
          // Fill in the login form with stored details
          document.querySelector("#username").value = data.accountDetails.username;
          document.querySelector("#password").value = data.accountDetails.password;
        }
      });
    }
  });
  