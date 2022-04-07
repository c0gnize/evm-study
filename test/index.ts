/* eslint-disable node/no-missing-import */
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Token } from "../typechain/Token";

describe("Token contract", function () {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let hardhatToken: Token;

  beforeEach(async function () {
    const Token = await ethers.getContractFactory("Token");
    [owner, addr1] = await ethers.getSigners();
    hardhatToken = await Token.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await hardhatToken.owner()).to.equal(owner.address);
  });

  it("Should assign the total supply of tokens to the owner", async function () {
    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens to account", async function () {
    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    hardhatToken.transfer(addr1.address, 10);
    expect(await hardhatToken.balanceOf(addr1.address)).equal(10);
    expect(await hardhatToken.balanceOf(owner.address)).equal(
      ownerBalance.sub(10)
    );
  });

  it("Should fail if sender does not have enough funds", async function () {
    await expect(
      hardhatToken.connect(addr1).transfer(owner.address, 1)
    ).revertedWith("Not enough tokens");
    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(ownerBalance).equal(1000000);
  });
});
