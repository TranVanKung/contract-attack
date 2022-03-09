import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

const {
  PRIVATE_KEY = "",
  MNEMONIC = "",
  REPORT_GAS = "",
  ETHERSCAN_API_KEY = "",
} = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config = {
  solidity: "0.8.4",
  networks: {
    // @hardhat network config for Vault contract test
    // hardhat: {
    //   initialBaseFeeGas: 0,
    //   mining: {
    //     auto: false,
    //     interval: 3000,
    //   },
    // },
    dev: {
      url: "http://localhost:7545",
      gasPrice: 20,
      accounts: {
        mnemonic: MNEMONIC,
        count: 10,
      },
      saveDeployments: true,
    },
    bsctest: {
      url: "https://data-seed-prebsc-2-s2.binance.org:8545",
      accounts: [PRIVATE_KEY],
      gasPrice: 10000000000,
      blockGasLimit: 1000000,
    },
    solanartest: {
      url: "https://api.testnet.solana.com",
      accounts: [PRIVATE_KEY],
      gasPrice: 10000000000,
      blockGasLimit: 10000000,
    },
    polygontest: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [PRIVATE_KEY],
      gasPrice: 10000000000,
      blockGasLimit: 10000000,
    },
    main: {
      url: "https://bsc-dataseed1.binance.org",
      accounts: [PRIVATE_KEY],
      gasPrice: 5100000000,
      blockGasLimit: 1000000,
    },
  },
  gasReporter: {
    enabled: REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
