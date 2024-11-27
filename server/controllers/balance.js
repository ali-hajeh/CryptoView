const { Web3 } = require("web3");
const erc20Abi = require("../abis/erc20-min.json");
const process = require("process");
const dotenv = require("dotenv");

dotenv.config();

const web3Provider = new Web3(
  `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_ID}`
);

const getBalance = async (req, res) => {
  try {
    const { address, token } = req.params;

    if (!address || !token) {
      return res.status(400).json({ message: "Invalid address or token" });
    }

    const contract = new web3Provider.eth.Contract(erc20Abi, token);

    const bigIntBalance = await contract.methods.balanceOf(address).call();
    const balance = Number(bigIntBalance);

    const bigIntDecimals = await contract.methods.decimals().call();
    const decimals = Number(bigIntDecimals);
    const formattedBalance = balance / 10 ** decimals;

    return res.status(200).json({ balance: formattedBalance });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving balance" });
  }
};

module.exports = { getBalance };
