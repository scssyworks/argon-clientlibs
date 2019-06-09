# ArgonUI-clientlibs
Converts a regular javascript or css package to an AEM client library

# Install
```sh
npm install --save-dev argonui-clientlibs
```

This package is part of <a href="https://www.npmjs.com/package/argonui">ArgonUI Boilerplate</a>. However, it can function independently based on your project needs.

# How does it work?

The package requires ``argon.config.js`` file. The configuration looks something like this:<br>
```js
const clientlibDist = `apps/settings/wcm/designs`;
const projectName = `argonui`;
module.exports = {
    jcrRoot: 'dist/jcr_root', // This path will have preference over "target" if it exists
    target: 'dist', // Target root folder
    clientlibs: {
        vendor: {
            categories: ['argonui.vendor'],
            basePath: `${clientlibDist}/${projectName}/clientlibs/vendor.publish`,
            paths: [
                `${clientlibDist}/${projectName}/clientlibs/vendor.publish`
            ]
        },
        global: {
            categories: ['argonui.global'], // Clientlib categories
            // Processor configuration for clientlib minification
            jsProcessor: [
                'min:gcc',
                'obfuscate=true',
                'languageIn=ECMASCRIPT5',
                'languageOut=ECMASCRIPT5'
            ],
            basePath: `${clientlibDist}/${projectName}/clientlibs/global.publish`, // where .content.xml will be placed
            paths: [
                // Scan these folders for js and css files
                `${clientlibDist}/${projectName}/clientlibs/global.publish`,
                `${clientlibDist}/${projectName}/clientlibs/common.publish`,
            ]
        }
    }
};
```

To convert a regular JS path to a client library run following command<br>
```sh
npx create-clientlib
```
OR
```sh
npx create-clientlib --config=someOtherFileName.config.js
```