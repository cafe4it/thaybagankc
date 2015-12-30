Package.describe({
    name: 'nxcong:x-ray',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'The next web scraper. See through the <html> noise. http://lapwinglabs.com - version 2.0.2',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({"x-ray" : "2.0.2"})

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.addFiles('x-ray.js',['server']);
    api.export('Xray',['server']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('nxcong:x-ray');
    api.addFiles('x-ray-tests.js');
});
