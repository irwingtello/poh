// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Badge.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
contract POH is ERC721,ERC721URIStorage, Pausable, AccessControl {

    using Counters for Counters.Counter;
    Counters.Counter public _myCounter;
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    mapping(uint256 => address) public s_deployedCampaigns;
    mapping(address => uint256[]) public tokensOwned;
    mapping(uint256 => address) public s_ownedCampaigns;

    mapping(address => bool) public access;


    function changeState(address wallet) public onlyRole(MINTER_ROLE) {
            access[wallet] = !access[wallet];
    }
    constructor() ERC721("POHBadges", "POHBadges") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
  function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    modifier verifyNFT(address _nftContract, address _owner, uint256 _tokenId) {
        IERC721 nft = IERC721(_nftContract);
        require(access[_owner] == true, "Address does not have access");
        require(nft.ownerOf(_tokenId) == _owner , "Address does not own NFT");
        _;
    }
   function createOrgBadge(
        string memory image,
        string memory name,
        string memory organizer,
        string memory website,
        address manager,
        string memory creationDate,
        string memory endDate,
        address nftContract,
        uint256 _tokenId
    ) public verifyNFT(nftContract,manager,_tokenId){
        Badge newOrgBadge = new Badge(
            image,
            name,
            organizer,
            website,
            manager,
            creationDate,
            endDate
        );
        tokensOwned[manager].push(_myCounter.current());
        s_deployedCampaigns[_myCounter.current()] = address(newOrgBadge);
        s_ownedCampaigns[_myCounter.current()] = manager;
        _safeMint(manager, _myCounter.current());
        _setTokenURI(_myCounter.current(), image);
        _myCounter.increment();
    }

    
    function safeMint(address to, string memory uri) public  {
        tokensOwned[to].push(_myCounter.current());
        _safeMint(to, _myCounter.current());
        _setTokenURI(_myCounter.current(), uri);
        _myCounter.increment();

    }

   function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721)
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
    function getOwnedTokens(address owner) public view returns (uint256[] memory) {
    return tokensOwned[owner];
}
    
}
