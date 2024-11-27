const process = require("process");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const optimismScannerApi = process.env.OPTIMISM_SCANNER;

const getTransactions = async (req, res) => {
  try {
    const { address } = req.params;
    let { start, end } = req.query;

    if (!address) {
      return res.status(400).json({ message: "Invalid address" });
    }

    if (start) {
      start = parseInt(start);
    }

    if (end) {
      end = parseInt(end);
    }

    const response = await axios.get(
      `https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${address}&sort=asc&apikey=${optimismScannerApi}`
    );

    const isSuccess = response.data.status === "1";

    if (!isSuccess) {
      return res.status(400).json({ message: response.data.message });
    }

    const transactions = response.data.result;

    if (start && end) {
      const filteredTransactions = transactions.filter((txn) => {
        if (start && end) {
          const timestamp = parseInt(txn.timeStamp);
          return timestamp >= start && timestamp <= end;
        }
        return true;
      });

      return res.status(200).json({ transactions: filteredTransactions });
    } else {
      const lastFiveTransactions = transactions.slice(-5);
      return res.status(200).json({ transactions: lastFiveTransactions });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving transactions" });
  }
};

module.exports = { getTransactions };
