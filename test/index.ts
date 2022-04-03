import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token contract", function () {
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const Token = await ethers.getContractFactory("Token");
      const hardhatToken = await Token.deploy();
      const [owner] = await ethers.getSigners();
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const Token = await ethers.getContractFactory("Token");
      const hardhatToken = await Token.deploy();
      const [owner] = await ethers.getSigners();
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });
});
