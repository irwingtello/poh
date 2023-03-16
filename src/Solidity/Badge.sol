// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Badge is ERC721, ERC721URIStorage, Pausable, AccessControl{
    string public s_image;
    string public s_name;
    string public s_organizer;
    string public s_website;
    address public s_manager;
    string public s_creationDate;
    string public s_endDate;
    using Counters for Counters.Counter;
    mapping(address => uint256[]) public tokensOwned;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    constructor(
        string memory image,
        string memory name,
        string memory organizer,
        string memory website,
        address manager,
        string memory creationDate,
        string memory endDate
    ) ERC721("POHBadges", "POHBadges"){
        s_image = image;
        s_name = name;
        s_organizer= organizer;
        s_website = website;
        s_manager = manager;
        s_creationDate = creationDate;
        s_endDate=endDate;
        _grantRole(DEFAULT_ADMIN_ROLE, manager);
        _grantRole(PAUSER_ROLE, manager);
        _grantRole(MINTER_ROLE, manager);
    }

     function safeMint(address to) public onlyRole(MINTER_ROLE) {
        tokensOwned[to].push(_tokenIdCounter.current());
        _safeMint(to, _tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(),s_image);
        _tokenIdCounter.increment();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
