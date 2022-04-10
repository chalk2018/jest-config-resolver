import type { Config } from "@jest/types";
export type TestConfig = {
  ts?: boolean;
  onlyAdded?: Array<keyof Config.ProjectConfig>;
  depDir?: string;
  depMapper?: { [key: string]: string };
} & Config.ProjectConfig;
export type run = () => any;
export type configResolver = (testConfig: TestConfig) => Config.ProjectConfig;
