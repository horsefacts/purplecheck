// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Purplecheck.sol";
import {Base64} from "solady/utils/Base64.sol";
import {LibString} from "solady/utils/LibString.sol";

contract PurplecheckTest is Test {
    Purplecheck public purplecheck;

    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address carol = makeAddr("carol");
    address eve = makeAddr("eve");

    string internal CID = "fakeIpfsCidOne";

    receive() external payable {}

    function setUp() public {
        purplecheck = new Purplecheck(address(this));
        deal(alice, 1 ether);
        deal(bob, 1 ether);
    }

    function test_mints_token_to_caller() public {
        vm.startPrank(alice);
        uint256 tokenId = purplecheck.mint{value: purplecheck.price()}(CID);
        vm.stopPrank();

        assertEq(purplecheck.ownerOf(tokenId), alice);
    }

    function test_increments_id() public {
        vm.startPrank(alice);
        uint256 token1 = purplecheck.mint{value: purplecheck.price()}(CID);
        uint256 token2 = purplecheck.mint{value: purplecheck.price()}(CID);
        uint256 token3 = purplecheck.mint{value: purplecheck.price()}(CID);
        vm.stopPrank();

        assertEq(purplecheck.balanceOf(alice), 3);
        assertEq(purplecheck.ownerOf(token1), alice);
        assertEq(purplecheck.ownerOf(token2), alice);
        assertEq(purplecheck.ownerOf(token3), alice);
        assertEq(token2, token1 + 1);
        assertEq(token3, token2 + 1);
    }

    function test_increments_supply() public {
        vm.startPrank(alice);
        purplecheck.mint{value: purplecheck.price()}(CID);
        purplecheck.mint{value: purplecheck.price()}(CID);
        purplecheck.mint{value: purplecheck.price()}(CID);
        vm.stopPrank();

        assertEq(purplecheck.totalSupply(), 3);
    }

    function test_reverts_on_underpayment() public {
        vm.expectRevert("UNDERPAID");
        vm.prank(alice);
        purplecheck.mint{value: 0}(CID);
    }

    function test_price_increases() public {
        assertEq(purplecheck.price(), 4432048402018610);

        vm.startPrank(alice);
        purplecheck.mint{value: purplecheck.price()}(CID);
        assertEq(purplecheck.price(), 4676917389960886);

        purplecheck.mint{value: purplecheck.price()}(CID);
        assertEq(purplecheck.price(), 4935315296321237);

        purplecheck.mint{value: purplecheck.price()}(CID);
        assertEq(purplecheck.price(), 5207989588694892);

        purplecheck.mint{value: purplecheck.price()}(CID);
        assertEq(purplecheck.price(), 5495729031977323);

        purplecheck.mint{value: purplecheck.price()}(CID);
        assertEq(purplecheck.price(), 5799365970024377);

        purplecheck.mint{value: purplecheck.price()}(CID);
        assertEq(purplecheck.price(), 6119778733373250);

        purplecheck.mint{value: purplecheck.price()}(CID);
        assertEq(purplecheck.price(), 6457894179989141);
    }

    function test_price_reverts_to_target() public {
        vm.startPrank(alice);
        purplecheck.mint{value: purplecheck.price()}(CID);
        purplecheck.mint{value: purplecheck.price()}(CID);
        purplecheck.mint{value: purplecheck.price()}(CID);
        purplecheck.mint{value: purplecheck.price()}(CID);
        purplecheck.mint{value: purplecheck.price()}(CID);
        purplecheck.mint{value: purplecheck.price()}(CID);
        purplecheck.mint{value: purplecheck.price()}(CID);
        assertEq(purplecheck.price(), 6457894179989141);

        vm.warp(block.timestamp + 1 days);
        assertEq(purplecheck.price(), 4455946984192507);
    }

    function test_one_hundred_mints() public {
        deal(alice, 100 ether);
        vm.startPrank(alice);
        for (uint256 i; i<100; ++i) {
          purplecheck.mint{value: purplecheck.price()}(CID);
        }
        vm.stopPrank();
        assertEq(purplecheck.price(), 959676629387490517);
    }

    function test_price_decreases() public {
        vm.warp(block.timestamp + 10 days);
        assertEq(purplecheck.price(), 108416504775523);
    }

    function test_stores_CID() public {
        vm.startPrank(alice);
        uint256 aliceToken = purplecheck.mint{value: purplecheck.price()}("fakeIpfsCidOne");
        vm.stopPrank();

        vm.startPrank(bob);
        uint256 bobToken = purplecheck.mint{value: purplecheck.price()}("fakeIpfsCidTwo");
        vm.stopPrank();

        assertEq(purplecheck.cid(aliceToken), "fakeIpfsCidOne");
        assertEq(purplecheck.cid(bobToken), "fakeIpfsCidTwo");
    }

    function test_returns_image_uri() public {
        vm.startPrank(alice);
        uint256 aliceToken = purplecheck.mint{value: purplecheck.price()}("fakeIpfsCidOne");
        vm.stopPrank();

        vm.startPrank(bob);
        uint256 bobToken = purplecheck.mint{value: purplecheck.price()}("fakeIpfsCidTwo");
        vm.stopPrank();

        assertEq(purplecheck.imageURI(aliceToken), "ipfs://fakeIpfsCidOne");
        assertEq(purplecheck.imageURI(bobToken), "ipfs://fakeIpfsCidTwo");
    }

    function test_transfers_revert() public {
        vm.startPrank(alice);
        uint256 tokenId = purplecheck.mint{value: purplecheck.price()}(CID);

        vm.expectRevert("TRANSFERS_DISABLED");
        purplecheck.transferFrom(alice, bob, tokenId);

        vm.expectRevert("TRANSFERS_DISABLED");
        purplecheck.safeTransferFrom(alice, bob, tokenId);

        vm.expectRevert("TRANSFERS_DISABLED");
        purplecheck.safeTransferFrom(alice, bob, tokenId, "");
    }

    function test_has_owner() public {
        assertEq(purplecheck.owner(), address(this));
    }

    function test_ownership_transfer() public {
        purplecheck.transferOwnership(alice);
        assertEq(purplecheck.owner(), alice);
    }

    function test_withdraw_balance() public {
        vm.startPrank(alice);
        purplecheck.mint{value: purplecheck.price()}(CID);
        purplecheck.mint{value: purplecheck.price()}(CID);
        purplecheck.mint{value: purplecheck.price()}(CID);
        vm.stopPrank();

        assertEq(address(purplecheck).balance, 14044281088300733);

        purplecheck.withdrawBalance(carol);
        assertEq(address(purplecheck).balance, 0);
        assertEq(carol.balance, 14044281088300733);
    }

    function test_withdraw_auth() public {
        vm.expectRevert("UNAUTHORIZED");
        vm.prank(eve);
        purplecheck.withdrawBalance(eve);
    }

    function test_owner_can_burn_token() public {
        vm.startPrank(alice);
        uint256 tokenId = purplecheck.mint{value: purplecheck.price()}(CID);
        assertEq(purplecheck.balanceOf(alice), 1);
        purplecheck.burn(tokenId);
        assertEq(purplecheck.balanceOf(alice), 0);
        vm.stopPrank();
    }

    function test_approved_caller_can_burn_token() public {
        vm.startPrank(alice);
        uint256 tokenId = purplecheck.mint{value: purplecheck.price()}(CID);
        purplecheck.approve(bob, tokenId);
        vm.stopPrank();

        vm.prank(bob);
        purplecheck.burn(tokenId);
        assertEq(purplecheck.balanceOf(alice), 0);
    }

    function test_approved_for_all_can_burn_token() public {
        vm.startPrank(alice);
        uint256 tokenId = purplecheck.mint{value: purplecheck.price()}(CID);
        purplecheck.setApprovalForAll(bob, true);
        vm.stopPrank();

        vm.prank(bob);
        purplecheck.burn(tokenId);
        assertEq(purplecheck.balanceOf(alice), 0);
    }

    function test_non_owner_cannot_burn_token() public {
        vm.startPrank(alice);
        uint256 tokenId = purplecheck.mint{value: purplecheck.price()}(CID);
        vm.stopPrank();

        vm.expectRevert("NOT_AUTHORIZED");
        vm.prank(eve);
        purplecheck.burn(tokenId);
    }

    function test_token_metadata() public {
        vm.startPrank(alice);
        uint256 tokenId = purplecheck.mint{value: purplecheck.price()}(CID);
        vm.stopPrank();

        string memory dataURI = purplecheck.tokenURI(tokenId);
        string[] memory split = LibString.split(dataURI, ",");
        string memory encoded = split[1];
        string memory decoded = string(Base64.decode(encoded));

        assertEq(decoded, '{"image":"ipfs://fakeIpfsCidOne","name":"Purplecheck #1"}');
    }

    function test_contract_metadata() public {
        string memory dataURI = purplecheck.contractURI();
        string[] memory split = LibString.split(dataURI, ",");
        string memory encoded = split[1];
        string memory decoded = string(Base64.decode(encoded));

        assertEq(
            decoded,
            '{"name":"Purplecheck","image":"ipfs://bafkreibhw7wybdzmpg5tfjr6pjynalpeb3zs7c3va26prjyc6gl2bvo7y4","description":"Your JPEGs deserve to feel special."}'
        );
    }
}
