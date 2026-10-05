/**
  --- 1. BẢNG SO SÁNH TRADE-OFF KỸ THUẬT GIỮA CÁC CẤU TRÚC LẶP ---
  +-------------+-------------------+----------------------+--------------------+-------------------------------------------+
  | Cấu trúc    | Số lần lặp        | Thời điểm kiểm tra   | Số lần lặp tối đa  | Ứng dụng POS tối ưu                       |
  |             | xác định trước?   | điều kiện            | / tối thiểu        |                                           |
  +-------------+-------------------+----------------------+--------------------+-------------------------------------------+
  | FOR         | Có (Biết trước    | Đầu vòng lặp         | Tối đa: N lần      | Duyệt chuỗi mã món ăn, mảng giỏ hàng,     |
  |             | độ dài/khoảng đếm)| (Pre-test)           | Tối thiểu: 0 lần   | in từng dòng chi tiết hóa đơn (receipt).  |
  +-------------+-------------------+----------------------+--------------------+-------------------------------------------+
  | WHILE       | Không (Phụ thuộc  | Đầu vòng lặp         | Tối đa: Không giới | Lắng nghe & nhận đơn hàng theo ca, kết nối|
  |             | sự kiện/trạng thái| (Pre-test)           | hạn (dễ loop vô tận| thiết bị ngoại vi (máy in bill, scanner).  |
  |             | thời gian thực)   |                      | Tối thiểu: 0 lần   |                                           |
  +-------------+-------------------+----------------------+--------------------+-------------------------------------------+
  | DO...WHILE  | Không (Dựa trên   | Cuối vòng lặp        | Tối đa: Không giới | Xác thực thanh toán thẻ/quẹt mã QR, nhập  |
  |             | kết quả sau lần   | (Post-test)          | hạn                | PIN, prompt xác nhận hủy đơn (chạy ít nhất|
  |             | thực hiện đầu)    |                      | Tối thiểu: 1 lần   | 1 lần để thu thập input người dùng).      |
  
  
  
  --- 2. SƠ ĐỒ LUỒNG ĐIỀU KHIỂN (MERMAID FLOWCHARTS) ---
  
  [A] VÒNG LẶP FOR (Pre-test loop)
  ```mermaid
  flowchart TD
      Start([Bắt đầu]) --> Init[Khởi tạo biến: i = 0]
      Init --> Cond{Kiểm tra: i < order.length ?}
      Cond -- Đúng --> Body[Xử lý món thứ i]
      Body --> Update[Cập nhật: i++]
      Update --> Cond
      Cond -- Sai --> End([Tiếp tục luồng ngoài])
  ```
  
  [B] VÒNG LẶP WHILE (Pre-test loop)
 ```mermaid
  flowchart TD
     Start([Bắt đầu]) --> Cond{Kiểm tra: isClosingShift == false ?}
      Cond -- Đúng --> Process[Xử lý nhận đơn hàng]
      Process --> Update[Cập nhật cờ / số đơn]
      Update --> Cond
      Cond -- Sai --> End([Chốt ca & Kết thúc])
  ```
  
  [C] VÒNG LẶP DO...WHILE (Post-test loop)
  ```mermaid
  flowchart TD
      Start([Bắt đầu]) --> Body[Yêu cầu & đọc dữ liệu xác nhận]
      Body --> Cond{Kiểm tra: confirmPayment !== 'Y' ?}
      Cond -- Đúng (Nhập sai) --> Body
     Cond -- Sai (Đã xác nhận) --> End([Thanh toán thành công])
  ```
 */


// 1. FOR - Quét danh sách món trong hóa đơn (Duyệt cấu trúc dữ liệu tuần tự)

const order = "MLTS"; // M: Milk tea, L: Latte, T: Tea, S: Smoothie
console.log("=== 1. QUÉT DANH SÁCH MÓN (FOR) ===");

for (let i = 0; i < order.length; i++) {
    console.log(`Món thứ ${i + 1}: Mã [${order[i]}]`);
}
console.log(`=> Đã duyệt xong toàn bộ ${order.length} món trong hóa đơn.\n`);


// 2. WHILE - Nhận đơn hàng liên tục đến khi có tín hiệu chốt ca (Sự kiện động)
console.log("=== 2. NHẬN ĐƠN HÀNG TRONG CA (WHILE) ===");

let isClosingShift = false;
let orderCount = 0;

while (!isClosingShift) {
    orderCount++;
    console.log(`Đang tiếp nhận và xử lý đơn hàng POS #${orderCount}`);
    
    // Giả lập điều kiện chốt ca sau khi hoàn thành 3 đơn
    if (orderCount === 3) {
        isClosingShift = true;
    }
}
console.log("=> Quầy thu ngân đã gửi lệnh chốt ca. Ngừng tiếp nhận đơn.\n");


// 3. DO...WHILE - Xác nhận thanh toán (Bắt buộc tương tác ít nhất 1 lần)

console.log("=== 3. XÁC NHẬN THANH TOÁN (DO...WHILE) ===");

// Giả lập mảng input tương tác của người dùng: lần 1 nhập sai, lần 2 mới bấm "Y" (Đồng ý)
const simulatedUserInputs = ["CANCEL", "Y"];
let inputIndex = 0;
let confirmPayment = "";
let retryAttempts = 0;

do {
    retryAttempts++;
    confirmPayment = simulatedUserInputs[inputIndex++];
    console.log(`Lần thử ${retryAttempts}: Người dùng nhập '${confirmPayment}'`);

    if (confirmPayment !== "Y") {
        console.log("-> Phản hồi chưa hợp lệ hoặc bị hủy. Yêu cầu quẹt thẻ / xác nhận lại...");
    }
} while (confirmPayment !== "Y");

console.log("=> Thanh toán thành công sau", retryAttempts, "lần xác nhận.\n");



// 4. HƯỚNG DẪN CHỌN VÒNG LẶP & ĐÁNH GIÁ TRADE-OFF (DÀNH CHO LẬP TRÌNH VIÊN)

/*
  1. FOR:
     - Khi nào chọn: Khi biết trước số lần lặp cụ thể hoặc duyệt mảng/chuỗi có thuộc tính .length.
     - Ưu điểm: Gom cả 3 biểu thức (init; condition; update) trên 1 dòng, cú pháp chặt chẽ, 
       hạn chế tối đa quên tăng biến đếm dẫn đến treo trình duyệt (infinite loop).
    - Trade-off: Kém linh hoạt khi xử lý các sự kiện bất đồng bộ hoặc luồng chờ trạng thái bên ngoài.
 
  2. WHILE:
     - Khi nào chọn: Khi số lần lặp phụ thuộc hoàn toàn vào điều kiện nghiệp vụ động (đang chờ
       tín hiệu sensor, cờ chốt ca, streaming dữ liệu socket) và có thể không cần chạy lần nào (0 lần).
     - Đánh đổi (Trade-off): Nguy cơ lặp vô hạn (Infinite Loop) rất cao nếu logic cập nhật cờ/biến thoát
       bị bỏ sót hoặc throw exception trước khi chạm tới dòng thay đổi cờ.
 
  3. DO...WHILE:
     - Khi nào chọn: Khối code bắt buộc phải thực thi ít nhất một lần đầu tiên để tạo ra dữ liệu/trạng thái
       rồi mới kiểm tra điều kiện (prompt input người dùng, kết nối lại API sau khi timeout).
     - Đánh đổi (Trade-off): Dễ phát sinh bug logic nếu lập trình viên không nhận thức được khối code 
       vẫn sẽ chạy ngay cả khi điều kiện dừng đã vi phạm từ trước. Độ phổ biến thấp hơn nên cần comment rõ ràng.
 */