import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("@nomicfoundation/hardhat-ignition");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  paths: {
    artifacts: "../src/artifacts",
  },
};

export default config;
