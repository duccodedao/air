async function getExchangeRate() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=vnd');
    const data = await response.json();
    return data.tether.vnd;
}

async function confirmTransaction() {
    const email = document.getElementById('email').value;
    const network = document.getElementById('network').value;
    const walletAddress = document.getElementById('walletAddress').value;
    const amount = parseFloat(document.getElementById('amount').value);

    const transactionFee = 5000; // Phí giao dịch
    const totalAmount = amount + transactionFee;

    const exchangeRate = await getExchangeRate();
    const receivedAmount = amount / exchangeRate;
    const totalPaymentAmount = totalAmount / exchangeRate;

    Swal.fire({
        title: 'Xác nhận giao dịch',
        html: `
            <p><strong>Gmail:</strong> ${email}</p>
            <p><strong>Mạng:</strong> ${network}</p>
            <p><strong>Địa chỉ ví:</strong> ${walletAddress}</p>
            <p><strong>Số lượng (VNĐ):</strong> ${amount}</p>
            <p><strong>Phí giao dịch:</strong> 5000 VNĐ</p>
            <p><strong>Tổng số tiền:</strong> ${totalAmount} VNĐ</p>
            <p><strong>Số lượng USDT nhận được:</strong> ${receivedAmount.toFixed(6)}</p>
            <p><strong>Tổng số USDT thanh toán:</strong> ${totalPaymentAmount.toFixed(6)}</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        customClass: {
            confirmButton: 'swal-button-confirm',
            cancelButton: 'swal-button-cancel'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            showQRCode(email, network, walletAddress, totalAmount);
        }
    });
}

function showQRCode(email, network, walletAddress, totalAmount) {
    const accountName = encodeURIComponent("SON LY HONG DUC");
    const qrLink = `https://api.vietqr.io/image/970407-234586868686-yUZfpA4.jpg?accountName=${accountName}&amount=${totalAmount}`;

    Swal.fire({
        title: 'Mã QR',
        html: `<img src="${qrLink}" alt="QR Code" style="width: 250px; height: 250px; margin-top: 20px;">`,
        confirmButtonText: 'Tôi đã chuyển khoản'
    }).then(() => {
        promptTransactionCode(email, network, walletAddress, totalAmount);
    });
}

function promptTransactionCode(email, network, walletAddress, totalAmount) {
    Swal.fire({
        title: 'Nhập mã giao dịch',
        input: 'text',
        inputLabel: 'Mã giao dịch',
        inputPlaceholder: 'Nhập mã giao dịch',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        customClass: {
            confirmButton: 'swal-button-confirm',
            cancelButton: 'swal-button-cancel'
        },
        preConfirm: (transactionCode) => {
            if (!transactionCode) {
                Swal.showValidationMessage('Vui lòng nhập mã giao dịch');
            } else {
                sendTransactionInfo(email, network, walletAddress, totalAmount, transactionCode);
            }
        }
    });
}

function sendTransactionInfo(email, network, walletAddress, totalAmount, transactionCode) {
    // Giả sử bạn có một API để gửi thông tin giao dịch
    console.log('Thông tin giao dịch:', {
        email,
        network,
        walletAddress,
        totalAmount,
        transactionCode
    });

    // Tạo nội dung cho Messenger
    const messageContent = `Nạp USDT - ${walletAddress} - ${network} - ${transactionCode}`;

    // Tạo link chuyển hướng tới Messenger với nội dung đã tạo
    const messengerLink = `https://m.me/100082985042125?text=${encodeURIComponent(messageContent)}`;
    
    // Chuyển hướng
    window.location.href = messengerLink;

    Swal.fire({
        title: 'Thông tin đã được gửi đi',
        text: 'Đang chuyển hướng đến Messenger...',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000  // Hiển thị thông báo thành công trong 2 giây
    });
}
