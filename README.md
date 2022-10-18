# purplecheck
![Build Status](https://github.com/horsefacts/purplecheck/actions/workflows/.github/workflows/test.yml/badge.svg?branch=main)

## Purplecheck — Your JPEGs deserve to feel special

[Farcaster](https://www.farcaster.xyz/) and other social networks allow users to set an NFT as their profile picture. But doesn't the JPEG you already have deserve to feel special too?

Purplecheck is a gas-optimized ERC721 contract for minting an NFT from an existing IPFS CID.

A linear [VRGDA](https://www.paradigm.xyz/2022/08/vrgda) targets issuance of 6.9 purplechecks per day at a price of 0.00420 ETH.

Purplecheck NFTs are nontransferable, but may be burned by their owner or an approved operator.

### View functions:
- `price`: Mint price of a purplecheck token at the current block.
- `cid(uint256)`: Image CID by token ID.
- `imageURI(uint256)`: Image URI by token ID.
- `ERC721` and `LinearVRGDA` functions.

### External functions:
- `mint(string)`: Mint a purplecheck token to caller. Must provide an IPFS CID
- `burn(uint256)`: Burn a purplecheck token by ID. Must be owner or approved.
- `ERC721` functions.

### Permissioned functions:
- `withdrawBalance(address)`: Withdraw contract balance to given recipient address. Contract owner only.
- `Owned` functions.

## Deployments

| Network | Address |
| ------- | ------- |
| [Goerli](https://goerli.etherscan.io/address/0xbF7520551af5d9CD58EBA3D152e00A506E1f81C3) | `0xbF7520551af5d9CD58EBA3D152e00A506E1f81C3` |
