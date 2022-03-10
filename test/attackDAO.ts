import { expect } from "chai";
import { ethers } from "hardhat";

describe("attack EthererumDAO contract", () => {
  let deployer: any,
    attacker: any,
    user1: any,
    user2: any,
    etherDAO: any,
    attackDAO: any;

  beforeEach(async function () {
    [deployer, attacker, user1, user2] = await ethers.getSigners();
    const EthereumDAO = await ethers.getContractFactory(
      "EthereumDAO",
      deployer
    );
    etherDAO = await EthereumDAO.deploy();

    const AttackDAO = await ethers.getContractFactory("AttackDAO", attacker);
    attackDAO = await AttackDAO.deploy(etherDAO.address);
  });

  it("attacker can withdraw all balance", async () => {
    etherDAO.connect(user1).deposit({ value: ethers.utils.parseEther("10") });
    etherDAO.connect(user2).deposit({ value: ethers.utils.parseEther("15") });

    expect(await etherDAO.balances(user1.address)).to.be.equal(
      ethers.utils.parseEther("10")
    );
    expect(await etherDAO.balances(user2.address)).to.be.equal(
      ethers.utils.parseEther("15")
    );

    await attackDAO
      .connect(attacker)
      .attack({ value: ethers.utils.parseEther("1") });

    console.log(
      "DA0 balance:",
      await ethers.provider.getBalance(etherDAO.address)
    );
    expect(await ethers.provider.getBalance(etherDAO.address)).to.be.eq(
      ethers.utils.parseEther("0")
    );
    expect(await ethers.provider.getBalance(attackDAO.address)).to.be.eq(
      ethers.utils.parseEther("26")
    );
  });
});
