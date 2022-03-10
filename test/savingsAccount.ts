import { expect } from "chai";
import { ethers } from "hardhat";

describe.skip("SavingsAccount", () => {
  let deployer: any, user: any, savingsAccount: any, investor: any;

  beforeEach(async () => {
    [deployer, user] = await ethers.getSigners();

    const SavingsAccount = await ethers.getContractFactory(
      "SavingsAccount",
      deployer
    );
    savingsAccount = await SavingsAccount.deploy();

    const Investor = await ethers.getContractFactory("Investor", deployer);
    investor = await Investor.deploy(savingsAccount.address);
  });

  describe("From SavingAccount", () => {
    it("should be possible to deposit", async () => {
      expect(await savingsAccount.balanceOf(user.address)).to.eq(0);
      await savingsAccount.connect(user).deposit({ value: 100 });
      expect(await savingsAccount.balanceOf(user.address)).to.eq(100);
    });

    it("should be possible to withdraw", async () => {
      expect(await savingsAccount.balanceOf(user.address)).to.eq(0);
      await savingsAccount.connect(user).deposit({ value: 100 });
      expect(await savingsAccount.balanceOf(user.address)).to.eq(100);

      // withdraw
      await savingsAccount.connect(user).withdraw();
      expect(await savingsAccount.balanceOf(user.address)).to.eq(0);
    });
  });

  describe("From a Contract", () => {
    it("should be possible to deposit", async () => {
      expect(await savingsAccount.balanceOf(investor.address)).to.eq(0);
      await investor.depositIntoSavingsAccount({ value: 100 });
      expect(await savingsAccount.balanceOf(investor.address)).to.eq(100);
    });

    it("should be possible to withdraw", async () => {
      expect(await savingsAccount.balanceOf(investor.address)).to.eq(0);
      await investor.depositIntoSavingsAccount({ value: 100 });
      expect(await savingsAccount.balanceOf(investor.address)).to.eq(100);

      // withdraw
      await investor.withdrawFromSavingsAccount();
      expect(await savingsAccount.balanceOf(investor.address)).to.eq(0);
    });
  });
});
