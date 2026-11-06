# Assignment 7 - Bank DApp (Sepolia + Infura)

เว็บนี้อ่านข้อมูลและส่งธุรกรรมไปยัง Sepolia ผ่าน Infura RPC ส่วนการเซ็นธุรกรรมใช้ Private Key ที่ export จาก MetaMask โดยตรง (ไม่ได้ใช้ MetaMask เป็น provider หรือให้ MetaMask อนุมัติธุรกรรม)

## ก่อนเริ่ม

- ใช้บัญชีทดสอบ Sepolia ที่มี Sepolia ETH เท่านั้น ห้ามใช้ Private Key ของบัญชีจริง
- สร้าง Infura API key สำหรับ Ethereum Sepolia แล้วเตรียม Project ID
- ที่อยู่ Contract ใน `app.js` เป็นค่าที่ติดมากับไฟล์เดิม: `0xD2B4767102B4F0cD75bD0276e5fAAeB7E25e81f1` ตรวจสอบบน Sepolia Etherscan ว่าเป็น Bank Contract ที่ deploy แล้วและมีฟังก์ชัน `deposit`, `withdraw(uint256)`, `checkBlance()` ก่อนทดสอบ
- Infura Project ID ในเว็บ static เป็นข้อมูลที่ผู้เข้าชมดึงดูได้ ควรจำกัดการใช้งาน/โดเมนใน Infura และอย่าใส่ secret ของ backend

## ตั้งค่า MetaMask และ Infura

1. สร้างหรือเลือกกระเป๋าทดสอบใน MetaMask แล้วเลือกเครือข่าย Sepolia
2. รับ Sepolia ETH จาก faucet ที่เชื่อถือได้เข้ากระเป๋าทดสอบ เพื่อให้จ่ายค่า gas ได้
3. ใน Infura สร้าง API key สำหรับ Ethereum และคัดลอก Project ID (ไม่ต้องนำ Private Key ไปใส่ใน Infura)
4. ใน MetaMask เปิดเมนูบัญชีทดสอบ > Account details > Show private key แล้วกรอกรหัสผ่านเพื่อดู/export key
5. เปิดเว็บ กรอก Infura Project ID และ Private Key แล้วกด **Connect Infura** ตรวจ Address และสถานะเครือข่าย Sepolia
6. กด **Check Balance** เพื่อเรียก `checkBlance()` จาก Contract

Private Key จะอยู่ในหน่วยความจำของแท็บเพื่อเซ็นธุรกรรมและไม่ถูกเก็บใน localStorage/cookie หรือไฟล์ แต่หน้า GitHub Pages เป็นหน้าเว็บสาธารณะและใช้ key ที่กรอกได้ จึงควรเปิดจากไฟล์/เว็บที่เชื่อถือได้และใช้บัญชีทดสอบยอดน้อยเท่านั้น ปุ่ม “ล้าง Private Key” จะล้างช่องและ session ของ Contract ในหน้านั้น

## ขั้นตอนทดสอบ

1. ทดสอบ `Check Balance` หลังเชื่อมต่อ แล้วตรวจว่ายอด ETH แสดง
2. ใส่จำนวนเล็กน้อย เช่น `0.0001` แล้วกด **Deposit** รอจนสถานะสำเร็จ
3. ตรวจยอดใหม่ และเปิด transaction hash ที่แสดงในสถานะบน [Sepolia Etherscan](https://sepolia.etherscan.io/) เพื่อดู receipt/event และสถานะ Success
4. ใส่จำนวนที่ฝากไว้ เช่น `0.00005` แล้วกด **Withdraw** รอ transaction ยืนยัน ตรวจยอดคงเหลือและ transaction บน Etherscan
5. ลองกรอก 0 หรือค่าติดลบเพื่อดู validation; ลองใช้ Project ID ผิดเพื่อยืนยันว่าเว็บแสดงข้อผิดพลาด

การฝาก/ถอนใช้ Sepolia ETH จริงบน testnet และต้องมี ETH คงเหลือจ่าย gas ส่วน `checkBlance()` เป็นชื่อสะกดตาม ABI ของ Contract เดิม

## เปิดทดสอบในเครื่อง

จากโฟลเดอร์ `Assignment7` เปิดเว็บผ่าน local web server (เช่น VS Code Live Server) หรือใช้ Python:

```powershell
python -m http.server 8000
```

จากนั้นเปิด `http://localhost:8000` ในเบราว์เซอร์

## เผยแพร่ด้วย GitHub Pages

1. สร้าง GitHub repository สำหรับงานนี้ แล้วอัปโหลด **ไฟล์ภายในโฟลเดอร์ Assignment7** (`index.html`, `app.js`, `style.css`, `README.md`) ไว้ที่ root ของ repository เพื่อให้ URL หลักเปิดหน้าเว็บได้
2. เปิด repository > **Settings > Pages** เลือก **Deploy from a branch**, branch `main`, folder `/(root)` แล้วกด Save
3. รอ GitHub Pages แจ้ง URL รูปแบบ `https://<username>.github.io/<repository>/` แล้วเปิด URL นั้น
4. ทดสอบ Connect, Check Balance, Deposit และ Withdraw ซ้ำบน URL จริง
5. ส่ง URL GitHub Pages, URL repository และ Address Contract ในระบบ dLearning ตามที่ผู้สอนกำหนด

## ข้อมูลสำหรับส่ง

- Contract Address: `0xD2B4767102B4F0cD75bD0276e5fAAeB7E25e81f1` (ตรวจสอบว่าเป็น address ที่ deploy บน Sepolia ก่อนส่ง)
- GitHub Pages URL: เติมหลังเปิดใช้งาน Pages
- GitHub repository URL: เติม URL repository ของผู้ส่ง
