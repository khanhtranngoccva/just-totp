class SystemError extends Error {
}

export class EnvironmentError extends SystemError {
  constructor(variable: string) {
    super(`Environment variable ${variable} is missing or inaccurate. Check your environment or .env file.`);
  }
}
