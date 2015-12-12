Package.describe({
    name: 'bagankc:zf6',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'Zurb Foundation 6.0.1',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.use('jquery', 'client');
    api.addFiles('zf6.js', ['client']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('bagankc:zf6');
    api.addFiles('zf6-tests.js');
});
