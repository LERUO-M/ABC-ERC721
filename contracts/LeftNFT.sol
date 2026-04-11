// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LeftNFT is ERC721, Ownable {

    uint256 public nextTokenId;
    string public baseURI; 

    constructor() ERC721("Left NFT","LNFT") Ownable(msg.sender)
     {
        
    }
    function mint (address to) public onlyOwner {
        _safeMint(to , nextTokenId);
        nextTokenId++;

    }


}