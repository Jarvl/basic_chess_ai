# Basic Chess AI


## Setup

1. `nvm use`
2. Install dependencies: `npm install`
3. Run webpack to watch for changes in background: `npm run dev &`
4. Start HTTP server: `python3 -m http.server -d public`
5. Have fun and remember to stop the background job with `kill %1`


## bundle cache busting

Before merging a PR that updates `app/main.js`, be sure to update the `v` url param within the `bundle.js` import in `public/index.html`.

A script like this can be used (Python 3.6+)
```python
import secrets
secrets.token_urlsafe(24)
# e.g. hXQCliWSIfOVCpFdslPMr3iMuSvTZelc
```