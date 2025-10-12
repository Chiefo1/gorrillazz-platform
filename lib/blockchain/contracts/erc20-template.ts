export const ERC20_TEMPLATE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract {{TOKEN_NAME}} is ERC20, ERC20Burnable, Pausable, Ownable {
    constructor(address initialOwner)
        ERC20("{{TOKEN_NAME}}", "{{TOKEN_SYMBOL}}")
        Ownable(initialOwner)
    {
        _mint(initialOwner, {{TOTAL_SUPPLY}} * 10 ** decimals());
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
`

export function generateERC20Contract(
  name: string,
  symbol: string,
  totalSupply: string,
  features: {
    mintable?: boolean
    burnable?: boolean
    pausable?: boolean
  },
): string {
  let contract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";`

  if (features.burnable) {
    contract += `\nimport "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";`
  }
  if (features.pausable) {
    contract += `\nimport "@openzeppelin/contracts/security/Pausable.sol";`
  }
  contract += `\nimport "@openzeppelin/contracts/access/Ownable.sol";

contract ${name.replace(/\s+/g, "")} is ERC20`

  if (features.burnable) contract += ", ERC20Burnable"
  if (features.pausable) contract += ", Pausable"
  contract += `, Ownable {
    constructor(address initialOwner)
        ERC20("${name}", "${symbol}")
        Ownable(initialOwner)
    {
        _mint(initialOwner, ${totalSupply} * 10 ** decimals());
    }`

  if (features.pausable) {
    contract += `

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }`
  }

  if (features.mintable) {
    contract += `

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }`
  }

  if (features.pausable) {
    contract += `

    function _update(address from, address to, uint256 value)
        internal
        override
        whenNotPaused
    {
        super._update(from, to, value);
    }`
  }

  contract += `
}`

  return contract
}
