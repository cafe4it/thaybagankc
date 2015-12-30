Package.describe({
    name: 'nxcong:cheerio',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'Fast, flexible, and lean implementation of core jQuery designed specifically for the server. http://cheeriojs.github.io/cheerio/ - version 0.19.0',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({"cheerio" : "0.19.0"});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.addFiles('cheerio.js',['server']);
    api.export('cheerio',['server']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('nxcong:cheerio');
    api.addFiles('cheerio-tests.js');
});
