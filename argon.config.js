const clientlibDist = `apps/settings/wcm/designs`;
const projectName = `argonui`;
module.exports = {
    jcrRoot: 'dist/jcr_root',
    target: 'dist',
    clientlibs: {
        vendor: {
            categories: ['argonui.vendor'],
            basePath: `${clientlibDist}/${projectName}/clientlibs/vendor.publish`,
            dependencies: ['granite.jquery'],
            paths: [
                `${clientlibDist}/${projectName}/clientlibs/vendor.publish`
            ]
        },
        global: {
            categories: ['argonui.global'],
            jsProcessor: [
                'min:gcc',
                'obfuscate=true',
                'languageIn=ECMASCRIPT5',
                'languageOut=ECMASCRIPT5'
            ],
            basePath: `${clientlibDist}/${projectName}/clientlibs/global.publish`,
            paths: [
                `${clientlibDist}/${projectName}/clientlibs/global.publish`,
                `${clientlibDist}/${projectName}/clientlibs/common.publish`,
            ]
        }
    }
};