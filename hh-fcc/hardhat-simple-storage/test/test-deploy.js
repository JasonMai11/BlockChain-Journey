const { ethers } = require("hardhat");
const { expect, assert } = require("chai");


describe("SimpleStorage", function() {
  let simpleStorageFactory, simpleStorage;
  beforeEach(async function () {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  })

  it("Should start with a favorite number of 1", async function() {
    // assert
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = '1';
    console.log(currentValue.toString());
    assert.equal(currentValue.toString(), expectedValue);
    // expect
  });

  it("Should update when we call store", async function() {
    const expectedValue = '7';
    const transactionResponse = await simpleStorage.store(7);
    await transactionResponse.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    expect(updatedValue.toString()).to.equal(expectedValue);
  });

  it("A person should have a unique favorite number", async function() {
    const addPerson = await simpleStorage.addPerson("Jason", 2);
    await addPerson.wait(1);
    const jasonNumber = await simpleStorage.nameToFavoriteNumber("Jason");
    assert.equal(jasonNumber.toString(), '2');
  });

})