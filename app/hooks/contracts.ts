import { BigNumber, BigNumberish } from 'ethers';
import { useContractRead } from 'wagmi';

import { formatEther } from '@ethersproject/units';

import purplecheckABI from '../config/abis/purplecheck.json';

export function usePrice() {
    const {
        data,
        isError,
        isLoading,
    } = useContractRead({
        address: "0xbF7520551af5d9CD58EBA3D152e00A506E1f81C3",
        abi: purplecheckABI,
        functionName: "price",
    }) as { data: BigNumber | undefined, isError: boolean, isLoading: boolean };
    const price = data ?? BigNumber.from(0);
    const roundedPrice = Math.round(+formatEther(price) * 1e5) / 1e5;

    return { price, roundedPrice, isError, isLoading }
}
