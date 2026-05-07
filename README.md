# ESEMI Project

## Security Notice: Firebase Configuration

The Firebase configuration has been moved to a separate file to prevent accidental leaks of API keys on GitHub.

### Setup Instructions

1.  Locate `firebase-config.example.js` in the project root.
2.  Duplicate it and rename the copy to `firebase-config.js`.
3.  Open `firebase-config.js` and replace the placeholders with your actual Firebase project credentials.
4.  The `.gitignore` file is configured to ignore `firebase-config.js`, so your keys will not be committed to GitHub.

### How to Fix a Leaked Key

If your API key was already committed to GitHub:

1.  **Rotate the Key**: Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), find the API key, and "Regenerate" it.
2.  **Restrict the Key**: In the same console, add **HTTP Referrer restrictions**. Add your website's domain (e.g., `*.yourdomain.com`) to ensure the key can only be used by your site.
3.  **Update the Config**: Put the new key into your local `firebase-config.js`.
4.  **Clean Git History (Optional but Recommended)**: Use a tool like [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) or `git filter-repo` to remove the old key from your repository's history.
