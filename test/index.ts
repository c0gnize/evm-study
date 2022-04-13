/* eslint-disable node/no-missing-import */
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Token } from "../typechain/Token";

describe("Token contract", function () {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let token: Token;

  beforeEach(async function () {
    const Token = await ethers.getContractFactory("Token");
    [owner, addr1] = await ethers.getSigners();
    token = await Token.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await token.owner()).to.equal(owner.address);
  });

  it("Should assign the total supply of tokens to the owner", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens to account", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    const amount = 10;
    token.transfer(addr1.address, amount);
    expect(await token.balanceOf(addr1.address)).equal(amount);
    expect(await token.balanceOf(owner.address)).equal(
      ownerBalance.sub(amount)
    );
  });

  it("Should fail if sender does not have enough funds", async function () {
    const initialBalance = await token.balanceOf(owner.address);
    await expect(token.connect(addr1).transfer(owner.address, 1)).revertedWith(
      "Not enough tokens"
    );
    expect(await token.balanceOf(owner.address)).equal(initialBalance);
  });
});
