const clientlibDist = `apps/settings/wcm/designs`;
const projectName = `argon`;
module.exports = {
    jcrRoot: 'dist/jcr_root',
    target: 'dist',
    clientlibs: {
        global: {
            categories: ['argon.global'],
            jsProcessor: [
                'min:gcc',
                'obfuscate=true',
                'languageIn=ECMASCRIPT5',
                'languageOut=ECMASCRIPT5'
            ],
            basePath: `${clientlibDist}/${projectName}/clientlibs/global.publish`,
            paths: [
                `!testDirectory/js`,
                `!testDirectory/css/ignored`,
                `testDirectory/js`,
                `testDirectory/css`,
            ]
        }
    }
};