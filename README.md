# Twist Twisted

This makes several improvements on twist.com. You can try it out quickly by going to https://twist.com and copy/pasting this in the console:

```javascript
const script = document.createElement('script')
script.setAttribute('src', 'https://mikabytes.github.io/twist-twisted/index.js')
document.head.appendChild(script)
```

You'll need to do it everytime you restart the page though.

The better way is to install Tampermonkey or something similar and create a script doing the same.

## How to install

1. Download Tampermonkey
2. Create new Script
3. Add the following:

```
// ==UserScript==
// @name         Twist Twisted
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Vastly improved twist.com
// @author       You
// @match        https://twist.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const script = document.createElement('script');
    script.setAttribute('src', "https://mikabytes.github.io/twist-twisted/index.js");
    document.head.appendChild(script);
})();
```

## How to develop locally

An excellent way of developing locally is to use the script above, point it to a local server (such as `npx serve`). Then, make sure to add your local files to the "Sources" tab in Chrome inspector. You will have live CSS edit!

1. Clone repository
2. Cd into the folder and run `npx serve`
3. Note the localhost address f. ex. `http://localhost:5000`
4. Edit the script so it points to the localhost address you noted in step 3 and add `/index.js` in the end.

Exampel

```
// ==UserScript==
// @name         Twist Twisted
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Vastly improved twist.com
// @author       You
// @match        https://twist.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const script = document.createElement('script');
    script.setAttribute('src', "http://localhost:5000/index.js");
    document.head.appendChild(script);
})();

```

## Contributing

Contributions are welcome, create a PR please.

## Support

This is only tested on latest Chrome.

## License

ISC
