// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {Purplecheck} from "../src/Purplecheck.sol";

contract Deploy is Script {
    function run() public {
        vm.broadcast();
        new Purplecheck(vm.envAddress("OWNER_ADDRESS"));
        vm.stopBroadcast();
    }
}
