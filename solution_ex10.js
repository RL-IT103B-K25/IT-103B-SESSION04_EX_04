// 1. FOR - Quét danh sách món trong hóa đơn
const order = "MLTS";
console.log("=== QUÉT DANH SÁCH MÓN ===");
for (let i = 0; i < order.length; i++) {
    console.log("Món thứ", i + 1, ":", order[i]);
}


// 2. WHILE - Nhận đơn hàng đến khi chốt ca
console.log("=== NHẬN ĐƠN HÀNG ===");
let isClosingShift = false;
let orderCount = 0;
while (isClosingShift === false) {
    orderCount++;
    console.log("Đang nhận đơn hàng số", orderCount);
    if (orderCount === 3) {
        isClosingShift = true;
    }
}
console.log("Thu ngân đã chốt ca.");

// 3. DO-WHILE - Xác nhận thanh toán
console.log("=== XÁC NHẬN THANH TOÁN ===");

let confirmPayment = "";
do {
    console.log("Yêu cầu xác nhận thanh toán...");
    confirmPayment = "Y";
} while (confirmPayment !== "Y");
console.log("Thanh toán thành công.");


//Kết luận
// Nếu biết trước số lần lặp thì dùng  for
// Nếu chưa biết số lần lặp, kiểm tra điều kiện trước dùng while
// Nếu phải thực hiện ít nhất 1 lần dùng do -while