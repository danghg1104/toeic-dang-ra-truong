# HƯỚNG DẪN KHẮC PHỤC TRIỆT ĐỂ LỖI SSL `NET::ERR_CERT_AUTHORITY_INVALID`

## 1. NGUYÊN NHÂN GỐC RỄ (ROOT CAUSE)
Khi người dùng truy cập website bằng Google Chrome, Microsoft Edge hoặc ứng dụng Android (Capacitor/WebView) và gặp thông báo:
> **NET::ERR_CERT_AUTHORITY_INVALID**  
> *"Kết nối của bạn không phải là kết nối riêng tư"*

**Nguyên nhân 99%:**  
Máy chủ web (Nginx / Apache / Caddy) đang chỉ gửi **Leaf Certificate** (chứng chỉ của riêng tên miền) mà **QUÊN GỬI Intermediate Certificate Chain** (chứng chỉ trung gian của nhà phát hành, ví dụ Let's Encrypt R3 / ISRG Root X1).

* Trình duyệt máy tính cũ có thể tự động cache chứng chỉ trung gian nên vẫn vào được.
* **Nhưng trình duyệt Chromium hiện đại và điện thoại Android sẽ lập tức chặn đứng trang web và báo lỗi đỏ!**

---

## 2. CÁCH KHẮC PHỤC CHÍNH XÁC THEO TỪNG HỆ THỐNG

### TRƯỜNG HỢP A: NẾU DÙNG NGINX + LET'S ENCRYPT (CERTBOT)
Mở file cấu hình Nginx của tên miền (thường tại `/etc/nginx/sites-available/` hoặc `/etc/nginx/conf.d/`):

```nginx
# ❌ SAI (Gây lỗi NET::ERR_CERT_AUTHORITY_INVALID):
ssl_certificate /etc/letsencrypt/live/toididaudo.vn/cert.pem;

# ✅ ĐÚNG (Bắt buộc dùng fullchain.pem chứa cả chứng chỉ gốc + trung gian):
ssl_certificate /etc/letsencrypt/live/toididaudo.vn/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/toididaudo.vn/privkey.pem;
```

Sau khi sửa, chạy 2 lệnh trên server:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### TRƯỜNG HỢP B: NẾU DÙNG CLOUDFLARE (PROXY)
1. Đăng nhập vào Cloudflare Dashboard $\rightarrow$ Chọn tên miền.
2. Vào mục **SSL/TLS** $\rightarrow$ Chọn chế độ: **Full (Strict)**.
   * *Lưu ý:* Tuyệt đối không chọn *Flexible* nếu backend đã có HTTPS vì sẽ gây lỗi vòng lặp `ERR_TOO_MANY_REDIRECTS`.
3. Vào mục **Edge Certificates** $\rightarrow$ Bật:
   * **Always Use HTTPS** $\rightarrow$ `ON`
   * **Minimum TLS Version** $\rightarrow$ `TLS 1.2`
   * **Automatic HTTPS Rewrites** $\rightarrow$ `ON`

---

### TRƯỜNG HỢP C: KIỂM TRA LẠI CHỨNG CHỈ TRÊN TOÀN CẦU
Sau khi cấu hình xong, truy cập công cụ kiểm định SSL chính thức của Qualys:  
👉 **https://www.ssllabs.com/ssltest/**  
Nhập tên miền của bạn và kiểm tra: Điểm số phải đạt **A** hoặc **A+**, mục *"Certificate Paths"* phải hiện đủ 2 hoặc 3 chứng chỉ nối tiếp nhau.
