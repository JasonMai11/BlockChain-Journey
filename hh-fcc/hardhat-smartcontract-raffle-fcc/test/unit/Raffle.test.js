const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");
const { toBigInt } = require("ethers");


!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", function() {
        let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval
        const chainId = network.config.chainId
        
        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer
            console.log("the below is the deployer")
            console.log(deployer)
            await deployments.fixture(["all"])
            raffle = await ethers.getContract("Raffle", deployer)
            vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            raffleEntranceFee = await raffle.getEntranceFee()
            interval = await raffle.getInterval()
        })

        describe("constructor", function() {
            it("initializes the raffle correctly", async function () {
                const raffleState = await raffle.getRaffleState()
                const entranceFee = await raffle.getEntranceFee()
                assert.equal(raffleState.toString(), '0')
                assert.equal(interval.toString(), networkConfig[chainId]["keepersUpdateInterval"])
                assert.equal(entranceFee.toString(), '10000000000000000')
            })
        })

        describe("enterRaffle", function() {
            it("reverts when you don't pay enough", async function () {
                await expect(raffle.enterRaffle()).to.be.revertedWith("Raffle__SendMoreToEnterRaffle")
            })
            it("records players when they enter", async function () {
                await raffle.enterRaffle({ value: raffleEntranceFee })
                const playerFromContract = await raffle.getPlayer(0)
                assert.equal(playerFromContract, deployer)
            })
            it("emits event on enter", async function () {
                const emition = await raffle.enterRaffle({ value: raffleEntranceFee })
                expect(emition).to.emit(raffle, "RaffleEnter")
            })
            // it("doesn't allow entrance when raffle is calculating", async function () {
            //     await raffle.enterRaffle({ value: raffleEntranceFee })
            //     // for a documentation of the methods below, go here: https://hardhat.org/hardhat-network/reference
            //     await network.provider.send("evm_increaseTime", [Number(interval) + 1])
            //     await network.provider.request({ method: "evm_mine", params: [] })
            //     // we pretend to be a keeper for a second
            //     await raffle.performUpkeep(["0x"]) // changes the state to calculating for our comparison below
            //     await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith( // is reverted as raffle is calculating
            //         "Raffle__NotOpen"
            //     )

            // })
        })
})