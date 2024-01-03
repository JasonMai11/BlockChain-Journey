// in nodeJS: we use require
// in regular JS: we use import
import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

withdrawButton.onclick = withdraw;
balanceButton.onclick = getBalance;
connectButton.onclick = connect;
fundButton.onclick = fund;

console.log(ethers)

async function connect() {
    if (typeof window.ethereum !== "undefined"){
        console.log("MetaMask is installed!");
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("connected metamask wallet")
        connectButton.innerHTML = "Connected";
    } else {
        console.log("MetaMask is not installed!");
        fundButton.innerHTML = "Please Install Metamask";
    }
}



// fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value;
    console.log(`Funding with ${ethAmount} ETH`);
    if (typeof window.ethereum !== "undefined"){
        // provider / connection to the blockchain
        // signer / wallet / someone with some gas
        // contract that we are interacting with (ABI and Address)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)});
            // hey wait for this code to finish before you move on
            await listenForTransactionMine(transactionResponse, provider);
            console.log("Transaction complete");

        } catch (err) {
            console.log(err)
        }
        

    }
}

async function getBalance() {
    if(typeof window.ethereum != 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance));
    }
}

async function withdraw() {
    if(typeof window.ethereum != 'undefined') {
        console.log("Withdrawing....")
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.cheaperWithdraw();
            await listenForTransactionMine(transactionResponse, provider);
            console.log("Transaction complete");   
        } catch (err) {
            console.log(err)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    // listen for this transaction to be mined
    // once the trnasaction receipt is available, then we know it is mined
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            resolve()
        })
    })

}


// withdraw function