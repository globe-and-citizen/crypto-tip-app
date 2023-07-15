# Behaviour-Driven Development

Scenario: User can send tips to team members
Given a user with an Ethereum wallet
And the CryptoTip contract is deployed
And the user has some ETH in their wallet
When the user sends tips to a list of team members
Then the team members receive the correct amount of ETH
And the user's wallet balance is updated

Scenario: User can push tips to team members
Given a user with an Ethereum wallet
And the CryptoTip contract is deployed
And the user has some ETH in their wallet
And the user is the owner of the contract
When the user pushes tips to a list of team members
Then the team members receive the correct amount of ETH
And the user's wallet balance is updated

Scenario: User can check their balance
Given a user with an Ethereum wallet
And the CryptoTip contract is deployed
And the user has some tips in their balance
When the user checks their balance
Then the correct balance is displayed

Scenario: User can withdraw their tips
Given a user with an Ethereum wallet
And the CryptoTip contract is deployed
And the user has some tips in their balance
When the user withdraws their tips
Then the correct amount of ETH is transferred to the user's wallet
And the user's balance is updated



Scenario: User must have at least one team member to send tips
Given a user with an Ethereum wallet
And the CryptoTip contract is deployed
And the user has some ETH in their wallet
When the user tries to send tips with an empty list of team members
Then the transaction fails with an error message



Scenario: User can update the push limit
Given a user with an Ethereum wallet
And the CryptoTip contract is deployed
And the user is the owner of the contract
When the user updates the push limit
Then the push limit is updated


Scenario: User must send some ETH to send tips
Given a user with an Ethereum wallet
And the CryptoTip contract is deployed
When the user tries to send tips without sending any ETH
Then the transaction fails with an error message

Scenario: User must have enough balance to push tips
Given a user with an Ethereum wallet
And the CryptoTip contract is deployed
And the user has some ETH in their wallet
When the user tries to push tips with an amount greater than their balance
Then the transaction fails with an error message

Scenario: User must have permission to update the push limit
Given a user with an Ethereum wallet
And the CryptoTip contract is deployed
And the user is not the owner of the contract
When the user tries to update the push limit
Then the transaction fails with an error message

Scenario: User cannot withdraw tips if they have no balance
Given a user with an Ethereum wallet
And the CryptoTip contract is deployed
And the user has no tips in their balance
When the user tries to withdraw their tips
Then the transaction fails with an error message