const logPath = process.env.APP_LOG_PATH || '';

export const logSettings = {
  path: logPath,

  // interval to log server system and process performance (cpu, memory, disk,…)
  opsInterval: 1000 * 60 * 15,

  transports: {
    server: {
      console: {
        level: 'ops',
        silent: false
      },
      file: {
        level: 'ops',
        silent: logPath === ''
      }
    },

    app: {
      console: {
        level: 'silly',
        silent: false
      },
      file: {
        level: 'silly',
        silent: logPath === ''
      }
    }
  }
};
