exports.config = {
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:4210',
      show: !Boolean(process.env.CI),
      // headless: Boolean(process.env.CI),
      windowSize: '1200x900',
      chrome: {
        args: ['--use-fake-ui-for-media-stream'],
      }
    }
  },
  include: {
    I: './steps_file.js'
  },
  mocha: {},
  bootstrap: null,
  timeout: null,
  teardown: null,
  hooks: [],
  gherkin: {
    features: './features/*.feature',
    steps: ['./step_definitions/steps.js']
  },
  plugins: {
    screenshotOnFail: {
      enabled: true
    },
    retryFailedStep: {
      enabled: true,
    },
    tryTo: {
      enabled: true,
    }
  },
  stepTimeout: 0,
  stepTimeoutOverride: [{
      pattern: 'wait.*',
      timeout: 0
    },
    {
      pattern: 'amOnPage',
      timeout: 0
    }
  ],
  tests: './*_test.js',
  name: 'tests'
}
