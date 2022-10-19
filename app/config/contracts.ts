import { chain } from 'wagmi';

import { Chain } from '@rainbow-me/rainbowkit';

const contracts = {
    [chain.goerli.id]: "0xbF7520551af5d9CD58EBA3D152e00A506E1f81C3",
    [chain.mainnet.id]: "0xf74723Db57722B7B1e1a8841a93c3f17876b0b12"
}

export function getContract(currentChain?: Chain) {
    return currentChain ? contracts[currentChain.id] : contracts[chain.goerli.id];
}
