(function testCheckOnly() {
    console.log("👉 Đang tick chuẩn 6 nghề...");
    const correctJobs = ['student', 'office worker', 'teacher', 'nurse', 'taxi driver', 'doctor'];
    
    // Tìm tất cả các dòng nghề nghiệp
    const rows = Array.from(document.querySelectorAll('li, label, .choice, .optionItem'))
                      .filter(el => el.offsetParent !== null && el.children.length <= 3);

    for (const row of rows) {
        const text = row.innerText.toLowerCase().trim();
        if (correctJobs.some(j => text === j || text.includes(j))) {
            const input = row.querySelector('input[type="checkbox"], input[type="radio"]');
            if (input) {
                if (!input.checked) {
                    input.click(); // Chỉ click DUY NHẤT 1 lần vào ô input!
                }
            } else {
                row.click(); // Nếu là thẻ custom
            }
        }
    }
})();