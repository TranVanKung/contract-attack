import { expect } from "chai";
import { ethers } from "hardhat";

describe.skip("Access control", function () {
  let deployer: any, attacker: any, user: any, myPet: any;

  beforeEach(async function () {
    [deployer, attacker, user] = await ethers.getSigners();
    const MyPet = await ethers.getContractFactory("MyPet", deployer);
    myPet = await MyPet.deploy("Lu");
  });

  describe("MyPet", () => {
    it("should set dog name at deployment", async function () {
      expect(await myPet.myDog()).to.eq("Lu");
    });

    it("should set the deployer account as owner", async function () {
      expect(await myPet.owner()).to.eq(deployer.address);
    });

    it("should be possible for owner to change the pet name", async function () {
      await myPet.updateDog("kiki");
      expect(await myPet.myDog()).to.eq("kiki");
    });

    it("should NOT be able to change pet name if not the owner", async function () {
      await expect(
        myPet.connect(attacker).updateDog("kiki")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should be possible for the new owner to update the pet name", async function () {
      await myPet.transferOwnership(user.address);
      await myPet.connect(user).updateDog("kiki");
      expect(await myPet.myDog()).to.eq("kiki");
    });

    it("should NOT be possible for others too transfer ownership", async function () {
      await expect(
        myPet.connect(attacker).transferOwnership(attacker.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
