// Varbase Podcasts Base functional testing suite; usage and tags in tests/README.md.

module.exports = {
  default: {
    timeout: 60000,
    retry: 1,
    requireModule: ['tsx/cjs'],
    require: [
      'node_modules/@vardot/varbase-e2e/tests/step-definitions/**/*.js', // Varbase E2E core step definitions.
      'tests/step-definitions/**/*.js',                         // Podcasts Base custom step definitions.
    ],
    paths: [process.env.FEATURES || 'tests/features/*.feature'],
    format: [
      'progress-bar',
      'summary',
      'json:tests/reports/' + (process.env.CUCUMBER_JSON || 'cucumber_report') + '.json',
    ],
    formatOptions: {
      theme: {
        'feature keyword': ['bold', 'blue'],
        'feature name': ['blue', 'underline'],
        'scenario keyword': ['bold', 'magenta'],
        'scenario name': ['magenta', 'underline'],
        'step keyword': ['bold', 'green'],
        'step text': ['greenBright', 'italic'],
      },
    },
    worldParameters: {
      launchUrl: process.env.LAUNCH_URL || process.env.DDEV_PRIMARY_URL || 'https://localhost',
      // Testing users by role label; the CI job seeds the same accounts.
      users: {
        "webmaster": {
          "username": "webmaster",
          "email": "webmaster@vardot.com",
          "password": "dD.123123ddd"
        },
        "Normal user": {
          "email": "test.authenticated@vardot.com",
          "password": "dD.123123ddd"
        },
        "Content editor": {
          "email": "test.content_editor@vardot.com",
          "password": "dD.123123ddd"
        },
        "Content admin": {
          "email": "test.content_admin@vardot.com",
          "password": "dD.123123ddd"
        },
        "SEO admin": {
          "email": "test.seo_admin@vardot.com",
          "password": "dD.123123ddd"
        },
        "Site admin": {
          "email": "test.site_admin@vardot.com",
          "password": "dD.123123ddd"
        },
        "Super admin": {
          "email": "test.super_admin@vardot.com",
          "password": "dD.123123ddd"
        }
      },
      minWaitTime: {
        page: 8000,
        before_scenario: 0,
        after_scenario: 0,
        before_step: 0,
        after_step: 0,
      },
      selectors: {
        css: {},
        xpath: {},
        filesPath: './tests/selectors/',
        files: ['podcasts.json'],
        offset: 60,
        breakpoints: {
          xs:   { width: 375,  height: 667  },
          sm:   { width: 576,  height: 800  },
          md:   { width: 768,  height: 1024 },
          lg:   { width: 992,  height: 768  },
          xl:   { width: 1200, height: 900  },
          xxl:  { width: 1400, height: 900  },
          xxxl: { width: 1920, height: 1080, default: true },
        },
      },
      screenshot: {
        dir: './tests/screenshots',
        purge: false,
        onFailed: true,
        onEveryStep: false,
        alwaysFullscreen: false,
        failedPrefix: 'failed_',
        filenamePattern: '{datetime}.{feature_file}.feature_{step_line}.{ext}',
        filenamePatternFailed: '{failed_prefix}{datetime}.{feature_file}.feature_{step_line}.{ext}',
        infoTypes: '',
      },
      video: {
        mode: process.env.VARBASE_E2E_VIDEO || 'on-failure',
        dir: './tests/videos',
        size: { width: 1920, height: 1080 },
        filenamePattern: '{datetime}.{feature_file}.{scenario}.{status}.{ext}',
      },
      javascript: {
        mode: process.env.VARBASE_E2E_JS_ERROR_MODE || 'warn',
        levels: ['error'],
        ignore: '',
        beforeScenario: false,
        afterScenario: true,
      },
    },
  },
};
