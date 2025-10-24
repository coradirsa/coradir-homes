module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3003/'],
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'ready - started server on',
      startServerReadyTimeout: 180000,
      numberOfRuns: 3,
      settings: {
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 360,
          height: 640,
          deviceScaleFactor: 2,
          disabled: false,
        },
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
    },
  },
};

