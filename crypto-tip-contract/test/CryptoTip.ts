import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber} from "ethers";

describe("Feature: CryptoTip contract allows users to send and push tips to team members", function () {
    let cryptoTip: any;
    let cryptoTipInitialBalance: any;
    let cryptoTipCurrentBalance: any;

    // Team Members address
    let teamMembers: Array<string>;
    let SingedTeamMembers: Array<any>;

    let owner: any;
    let ownerInitialBalance: any;
    let ownerCurrentBalance: any;


    let membersWalletInitialBalances: Array<BigNumber>
    let membersCryptoTipInitialBalances: Array<BigNumber>

    let membersWalletCurrentBalances: Array<BigNumber>
    let membersCryptoTipCurrentBalances: Array<BigNumber>
    const totalAmount = ethers.utils.parseEther("1");

    const reloadBalances = async () => {
        membersWalletCurrentBalances = await Promise.all(
            SingedTeamMembers.map((member: any) => member.getBalance())
        );
        membersCryptoTipCurrentBalances = await Promise.all(
            teamMembers.map((member: any) => cryptoTip.connect(owner).getBalance(member))
        );
        ownerCurrentBalance = await owner.getBalance()
        cryptoTipCurrentBalance = await ethers.provider.getBalance(cryptoTip.address)
    }

    /**
     * Scenario: User can send tips to team members
     *  Given a user with an Ethereum wallet
     *  And the CryptoTip contract is deployed
     *  And the user has some ETH in their wallet
     */
    beforeEach(async function () {
        const CryptoTip = await ethers.getContractFactory("CryptoTip");
        const [signer, teamMember1, teamMember2] = await ethers.getSigners();
        owner = signer;

        // cryptoTip = await CryptoTip.deploy();
        cryptoTip = await CryptoTip.connect(owner).deploy();
        cryptoTip.connect(owner).initialize()
        teamMembers = [teamMember1.address, teamMember2.address];
        SingedTeamMembers = [teamMember1, teamMember2];
        await reloadBalances()

        membersWalletInitialBalances = membersWalletCurrentBalances
        membersCryptoTipInitialBalances = membersCryptoTipCurrentBalances
        cryptoTipInitialBalance = cryptoTipCurrentBalance
        ownerInitialBalance = ownerCurrentBalance
    });

    /**
     *  Scenario: User can send tips to team members
     *      Given See <beforeEach>
     *      When the user sends tips to a list of team members
     *      Then the team members receive the correct amount of ETH
     *      And the user's balance in the smart contract is updated
     */
    it("should allow User can send tips to team members", async function () {
        // User sends tips
        await cryptoTip.connect(owner).sendTips(teamMembers, {value: totalAmount})

        await reloadBalances()

        // Check the team members wallet balance do not change
        expect(membersWalletInitialBalances).to.be.eql(membersWalletCurrentBalances)

        // Check the team members receive the correct amount of ETH
        for (let i = 0; i < teamMembers.length; i++) {
            expect(membersCryptoTipCurrentBalances[i]).to.be.eql(membersCryptoTipInitialBalances[i].add(totalAmount.div(teamMembers.length)))
        }

        // Check Contract Balance is updated
        expect(cryptoTipCurrentBalance).to.be.eql(cryptoTipInitialBalance.add(totalAmount))

        // Check Owner wallet decrease
        expect(ownerCurrentBalance).to.be.below(ownerInitialBalance.sub(totalAmount))
    })


    /**
     * Scenario: User can push tips to team members
     *      Given See <beforeEach>
     *      When the user pushes tips to a list of team members
     *      Then the team members receive the correct amount of ETH
     *      And the user's wallet balance is updated
     */
    it("should allow user to push tips to team members", async function () {
        await cryptoTip.connect(owner).pushTips(teamMembers, {value: totalAmount})
        await reloadBalances()

        // Check Members Wallet balance increase
        expect(membersCryptoTipCurrentBalances).to.eql(membersCryptoTipInitialBalances)
        for (let i = 0; i < teamMembers.length; i++) {
            expect(membersWalletCurrentBalances[i]).to.be.eql(membersWalletInitialBalances[i].add(totalAmount.div(teamMembers.length)))
        }

        // Check contract wallet balance do not increase
        expect(cryptoTipInitialBalance).to.be.eql(cryptoTipCurrentBalance)

        // Check Owner wallet decrease
        expect(ownerCurrentBalance).to.be.below(ownerInitialBalance.sub(totalAmount))
    })

    /**
     * Scenario: User can withdraw their tips
     *      Given a user with an Ethereum wallet
     *      And the CryptoTip contract is deployed
     *      And the user has some tips in their balance
     *      When the user withdraws their tips
     *      Then the correct amount of ETH is transferred to the user's wallet
     *      And the user's balance is updated
     */
    it("Should allow  User to withdraw their tips", async function () {
        await cryptoTip.connect(owner).sendTips(teamMembers, {value: totalAmount})

        // Call withdraw function
        await Promise.all(
            SingedTeamMembers.map(async (signedMember: any) => {
                await cryptoTip.connect(signedMember).withdraw()
            })
        );
        await reloadBalances()

        for (let i = 0; i < teamMembers.length; i++) {
            expect(membersWalletCurrentBalances[i]).to.be.gt(membersWalletInitialBalances[i]);
        }
    });


    /**
     * Scenario: User must have at least one team member to send tips
     *      Given a user with an Ethereum wallet
     *      And the CryptoTip contract is deployed
     *      And the user has some ETH in their wallet
     *      When the user tries to send tips with an empty list of team members
     *      Then the transaction fails with an error message
     */
    it("Should allow User when he have at least one team member to send tips", async function () {

        await expect(cryptoTip.connect(owner).sendTips([], {value: totalAmount})).to.be.revertedWith("Must have at least one team member")
        await expect(cryptoTip.connect(owner).pushTips([], {value: totalAmount})).to.be.revertedWith("Must have at least one team member")
        await expect(cryptoTip.connect(owner).sendTips(teamMembers, {value: totalAmount})).to.not.be.reverted
        await expect(cryptoTip.connect(owner).pushTips(teamMembers, {value: totalAmount})).to.not.be.reverted
    });

    /**
     * Scenario: User can update the push limit
     *      Given a user with an Ethereum wallet
     *      And the CryptoTip contract is deployed
     *      And the user is the owner of the contract
     *      When the user updates the push limit
     *      Then the push limit is updated
     */
    it("Should allow owner to update the push limit", async function () {
        await expect(cryptoTip.connect(SingedTeamMembers[0]).updatePushLimit(5)).to.be.revertedWith('Ownable: caller is not the owner')
        await expect(cryptoTip.connect(owner).updatePushLimit(5)).to.not.be.reverted
    });


    /**
     * Scenario: User must send some ETH to send tips
     *      Given a user with an Ethereum wallet
     *      And the CryptoTip contract is deployed
     *      When the user tries to send tips without sending any ETH
     *      Then the transaction fails with an error message
     */
    it("Should allow User only to send some ETH before to send tips", async function () {
        await expect(cryptoTip.connect(owner).sendTips(teamMembers, {value: 0})).to.be.revertedWith("Must send some ETH")
        await expect(cryptoTip.connect(owner).sendTips(teamMembers, {value: totalAmount})).to.not.be.reverted
    })

    /**
     * Scenario: User cannot withdraw tips if they have no balance
     *      Given a user with an Ethereum wallet
     *      And the CryptoTip contract is deployed
     *      And the user has no tips in their balance
     *      When the user tries to withdraw their tips
     *      Then the transaction fails with an error message
     */
    it("Should not allow User to withdraw tips if they have no balance", async function () {

        await cryptoTip.connect(owner).sendTips(teamMembers, {value: totalAmount})
        await Promise.all(
            SingedTeamMembers.map(async (signedMember: any) => {
                await expect(cryptoTip.connect(signedMember).withdraw()).to.not.be.reverted
            })
        );
        await expect(cryptoTip.connect(owner).withdraw()).to.be.reverted
    })

    /**
     * Scenario: User send & push tips to team members
     *      Given See <beforeEach>
     *      When the user sends tips to a list of team members
     *      Then the team members receive the correct amount of ETH
     *      And the user's wallet balance is updated
     *      Then we events are emitted
     */
    it("emits TipsSent event", async function () {

        const tx = await cryptoTip.connect(owner).sendTips(teamMembers, {value: totalAmount})
        const receipt = await tx.wait();

        const event = receipt.events.pop();
        expect(event.event).to.equal("TipsSent");
        expect(event.args.teamMembers).to.eql(teamMembers);
        expect(event.args.amount).to.equal(totalAmount);
    });
});
