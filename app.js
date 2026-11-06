// Assignment 7: Sepolia reads and writes go through Infura.
// The private key is entered at runtime and is never stored by this page.
const CONTRACT_ADDRESS = "0xD2B4767102B4F0cD75bD0276e5fAAeB7E25e81f1";
const CONTRACT_ABI = [
  "function deposit() payable",
  "function withdraw(uint256 amount)",
  "function checkBlance() view returns (uint256)",
];
const SEPOLIA_CHAIN_ID = 11155111n;
const INFURA_RPC_BASE = "https://sepolia.infura.io/v3/";

let provider;
let signer;
let contract;

function setStatus(message) {
  document.getElementById("status").textContent = message;
}

async function connectInfura() {
  try {
    const projectId = document.getElementById("infuraProjectId").value.trim();
    let privateKey = document.getElementById("privateKey").value.trim();
    if (!projectId) throw new Error("กรุณากรอก Infura Project ID");
    // Accept either 64 hex characters or a key already prefixed with 0x.
    if (!privateKey.startsWith("0x")) privateKey = `0x${privateKey}`;
    if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
      throw new Error("Private Key ต้องเป็นเลขฐานสิบหก 64 ตัว (กรอกแบบมีหรือไม่มี 0x ก็ได้)");
    }

    provider = new ethers.JsonRpcProvider(`${INFURA_RPC_BASE}${encodeURIComponent(projectId)}`);
    const network = await provider.getNetwork();
    if (network.chainId !== SEPOLIA_CHAIN_ID) {
      throw new Error("RPC นี้ไม่ได้เชื่อมต่อ Sepolia");
    }

    // MetaMask is only the source of the exported key. It is not used as a provider.
    signer = new ethers.Wallet(privateKey, provider);
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    document.getElementById("walletAddress").textContent = `Address: ${signer.address}`;
    document.getElementById("networkStatus").textContent = "เครือข่าย: Sepolia ผ่าน Infura";
    setStatus("เชื่อมต่อ Infura สำเร็จ");
    await checkBalance();
  } catch (error) {
    showError(error);
  }
}

async function checkBalance() {
  try {
    if (!contract) throw new Error("กรุณากรอกข้อมูลและเชื่อมต่อ Infura ก่อน");
    const balance = await contract.checkBlance();
    document.getElementById("balance").textContent = `${ethers.formatEther(balance)} ETH`;
    setStatus("ตรวจสอบยอดเงินสำเร็จ");
  } catch (error) {
    showError(error);
  }
}

async function sendTransaction(kind) {
  try {
    if (!contract) throw new Error("กรุณากรอกข้อมูลและเชื่อมต่อ Infura ก่อน");
    const inputId = kind === "deposit" ? "depositAmount" : "withdrawAmount";
    const input = document.getElementById(inputId);
    const amount = input.value.trim();
    if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      throw new Error("กรุณากรอกจำนวน ETH ที่มากกว่า 0");
    }
    const value = ethers.parseEther(amount);
    setStatus("กำลังส่งธุรกรรมผ่าน Infura...");
    const tx = kind === "deposit"
      ? await contract.deposit({ value })
      : await contract.withdraw(value);
    setStatus(`ส่งธุรกรรมแล้ว ${tx.hash} กำลังรอยืนยัน...`);
    await tx.wait();
    input.value = "";
    await checkBalance();
    setStatus(kind === "deposit" ? "ฝากเงินสำเร็จ" : "ถอนเงินสำเร็จ");
  } catch (error) {
    showError(error);
  }
}

function showError(error) {
  console.error(error);
  const message = error.shortMessage || error.reason || error.message || "เกิดข้อผิดพลาด";
  setStatus(`ผิดพลาด: ${message}`);
}

function disconnect() {
  signer = undefined;
  contract = undefined;
  provider?.destroy();
  provider = undefined;
  document.getElementById("privateKey").value = "";
  document.getElementById("walletAddress").textContent = "ยังไม่ได้เชื่อมต่อ";
  document.getElementById("networkStatus").textContent = "ยังไม่ได้ตรวจสอบเครือข่าย";
  document.getElementById("balance").textContent = "- ETH";
  setStatus("ล้าง Private Key ออกจากหน้าเว็บแล้ว");
}

document.getElementById("connectButton").addEventListener("click", connectInfura);
document.getElementById("disconnectButton").addEventListener("click", disconnect);
document.getElementById("refreshButton").addEventListener("click", checkBalance);
document.getElementById("depositButton").addEventListener("click", () => sendTransaction("deposit"));
document.getElementById("withdrawButton").addEventListener("click", () => sendTransaction("withdraw"));
