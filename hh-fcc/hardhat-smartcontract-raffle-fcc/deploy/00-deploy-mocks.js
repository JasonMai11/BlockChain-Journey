const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = ethers.parseUnits("0.25", "ether") // 0.25 LINK per request
const GAS_PRICE_LINK = 1e9              // (link per gas) calculated value based on the gas price of the chain

module.exports = async function({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.name
  
  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...")
    // deploy a mock vrf coordinator
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args: [
        BASE_FEE,
        GAS_PRICE_LINK
      ],
    })
    log("Mock VRF Coordinator deployed!")
    log("------------------------------------")
  }
}

module.exports.tags = ["all", "mocks"]