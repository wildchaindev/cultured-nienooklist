## DappState.cdc
DappState.cdc is a .cdc file, which means it is a Cadence file. Cadence is the smart contract language on Flow. DappStarter intelligently stitches together the smart contract code for all of the feature blocks you've chosen and handles dependencies and other nuances of contracts with more complex functionality.
‍

When you generate a project with NFT features on Flow, you'll see pretty extensive NFT functionality in DappState.cdc. This includes metadata for an NFT and all of the functionality you might need for developing a dapp using NFTs, like withdrawing, depositing, etc. It also has capabilities for an administrative user or restricted user to mint a token and assign it.
‍

### Syntax Differences
One thing that takes some getting used to in Cadence is syntax using a backward pointing arrow. Flow is a resource-based language. To prevent errors and minimize security risk, all resources in Flow can only exist in one place at any given time. The architecture of the Flow blockchain and Cadence work harmoniously to make that happen. While the difference in syntax takes time to learn, the resource model used by Flow is quite sophisticated and has the potential to improve experience for end-users.

See the [Decentology Guides](https://www.decentology.com/guides-and-tutorials/hands-on-workshop-build-a-full-stack-blockchain-app-on-flow) for more.