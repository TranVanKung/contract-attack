import { expect } from "chai";
import { ethers } from "hardhat";

describe.skip("Weak randomless", () => {
  let deployer: any,
    attacker: any,
    user: any,
    lottery: any,
    lotteryAttacker: any;

  beforeEach(async () => {
    [deployer, attacker, user] = await ethers.getSigners();
    const Lottery = await ethers.getContractFactory("Lottery", deployer);
    lottery = await Lottery.deploy();

    const LotteryAttacker = await ethers.getContractFactory(
      "LotteryAttacker",
      attacker
    );
    lotteryAttacker = await LotteryAttacker.deploy(lottery.address);
  });

  describe("Lottery", () => {
    describe.skip("With bets open", () => {
      it("should allow a user to place a bet", async () => {
        await lottery.placeBet(5, { value: ethers.utils.parseEther("10") });
        expect(await lottery.bets(deployer.address)).equal(5);
      });

      it("should revert if a user place more than 1 bet", async () => {
        await lottery.placeBet(5, { value: ethers.utils.parseEther("10") });
        await expect(
          lottery.placeBet(150, { value: ethers.utils.parseEther("10") })
        ).to.be.revertedWith("Only 1 bet per player");
      });

      it("should revert if bet is not 10 eth", async () => {
        await expect(
          lottery.placeBet(150, { value: ethers.utils.parseEther("5") })
        ).to.be.revertedWith("Bet cost: 10 ether");
        await expect(
          lottery.placeBet(150, { value: ethers.utils.parseEther("15") })
        ).to.be.revertedWith("Bet cost: 10 ether");
      });

      it("should revert if bet is <= 0", async () => {
        await expect(
          lottery.placeBet(0, { value: ethers.utils.parseEther("10") })
        ).to.be.revertedWith("Must be a number from 1 to 255");
      });
    });

    describe.skip("With bets closed", () => {
      it("should revert if a user place a bet", async function () {
        await lottery.endLottery();
        await expect(
          lottery.placeBet(150, { value: ethers.utils.parseEther("10") })
        ).to.be.revertedWith("Bets are closed");
      });

      it("should allow only the winner to withdraw the price", async () => {
        await lottery
          .connect(user)
          .placeBet(5, { value: ethers.utils.parseEther("10") });
        await lottery
          .connect(attacker)
          .placeBet(100, { value: ethers.utils.parseEther("10") });
        await lottery.placeBet(82, { value: ethers.utils.parseEther("10") });

        let winningNumber = 0;

        while (winningNumber !== 5) {
          await lottery.endLottery();
          winningNumber = await lottery.winningNumber();
        }

        await expect(
          lottery.connect(attacker).withdrawPrize()
        ).to.be.revertedWith("You are not the winner");
        const userInitialBalance = await ethers.provider.getBalance(
          user.address
        );
        await lottery.connect(user).withdrawPrize();
        const userFinalBalance = await ethers.provider.getBalance(user.address);
        expect(userFinalBalance).to.be.gt(userInitialBalance);
      });
    });

    describe("Attack", async () => {
      it.skip("A minner could guess the number", async () => {
        await lottery
          .connect(user)
          .placeBet(25, { value: ethers.utils.parseEther("10") });
        await lottery
          .connect(attacker)
          .placeBet(5, { value: ethers.utils.parseEther("10") });
        await lottery.placeBet(82, { value: ethers.utils.parseEther("10") });

        let winningNumber = 0;
        await ethers.provider.send("evm_setNextBlockTimestamp", [1646745863]);

        while (winningNumber !== 5) {
          await lottery.endLottery();
          winningNumber = await lottery.winningNumber();
        }

        console.log("block", await ethers.provider.getBlock("latest"));

        const attackerInitialBalance = await ethers.provider.getBalance(
          attacker.address
        );
        await lottery.connect(attacker).withdrawPrize();
        const attackerFinalBalance = await ethers.provider.getBalance(
          attacker.address
        );

        expect(attackerFinalBalance).to.be.gt(attackerInitialBalance);
      });

      it("Attack from an attacker contract", async () => {
        await lotteryAttacker.attack({ value: ethers.utils.parseEther("10") });
        await lottery.endLottery();
        await (ethers.provider as any).send("evm_mine");
        console.log(
          "attacker number: " + (await lottery.bets(lotteryAttacker.address))
        );
        console.log("winning number: " + (await lottery.winningNumber()));
      });
    });
  });
});
