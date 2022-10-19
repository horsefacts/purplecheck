import { BigNumber, BigNumberish } from 'ethers';
import { useContractRead, useNetwork } from 'wagmi';

import { formatEther } from '@ethersproject/units';

import purplecheckABI from '../config/abis/purplecheck.json';
import { getContract } from '../config/contracts';

export function usePrice() {
    const { chain } = useNetwork();
    const {
        data,
        isError,
        isLoading,
    } = useContractRead({
        address: getContract(chain),
        abi: purplecheckABI,
        functionName: "price",
    }) as { data: BigNumber | undefined, isError: boolean, isLoading: boolean };
    const price = data ?? BigNumber.from(0);
    const roundedPrice = Math.round(+formatEther(price) * 1e5) / 1e5;

    return { price, roundedPrice, isError, isLoading }
}
