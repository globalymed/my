# API Keys Security Guide

This guide explains how to securely manage API keys in this project.

## Brevo API Key Security

The Brevo API key has been removed from the codebase and replaced with environment variables for security.

### For Frontend (React/Vite)

1. Add your Brevo API key to the following files:
   - `.env` file as `REACT_APP_BREVO_API_KEY=your_brevo_api_key_here`
   - `.env.local` file as `VITE_BREVO_API_KEY=your_brevo_api_key_here`

2. Make sure your `.env.local` file is in `.gitignore` to prevent it from being pushed to your repository.

### For Firebase Functions

For Firebase cloud functions, set the environment variables using the Firebase CLI:

```bash
firebase functions:config:set brevo.api_key="your_brevo_api_key_here"
```

After setting this configuration, deploy your functions:

```bash
firebase deploy --only functions
```

## Important Security Notes

1. **NEVER** commit API keys directly to your code repository.
2. Add `.env.local` and any other files containing secrets to your `.gitignore` file.
3. For existing repositories where API keys were previously exposed:
   - Consider the exposed API key compromised
   - Generate a new API key in your Brevo account
   - Revoke the old exposed API key
   - Use the new API key with the environment variable approach

## Checking Your Repository

To verify that no API keys are exposed in your repository, you can run:

```bash
git grep -i "xkeysib" --  ":(exclude)*.md"
```

This command searches for the API key prefix "xkeysib" in your codebase, excluding markdown files. 