type ProcessOptions = {
    delayMs?: number; // thời gian delay giữa mỗi lần xử lý (ms)
    onProgress?: (progress: number) => void; // callback theo dõi tiến trình
    signal?: AbortSignal; // hỗ trợ hủy tiến trình
};

async function processWithDelay(
    numbers: number[],
    options: ProcessOptions = {}
): Promise<void> {
    // Mặc định delay là 1000ms nếu không truyền vào
    const delayMs = options.delayMs ?? 1000;
    const { onProgress, signal } = options;

    // Kiểm tra dữ liệu đầu vào
    if (!Array.isArray(numbers)) {
        throw new Error("Input must be an array.");
    }
    if (!numbers.every((n) => typeof n === "number")) {
        throw new Error("All items in the array must be numbers.");
    }

    // Nếu mảng rỗng thì return ngay
    if (numbers.length === 0) return;

    for (let i = 0; i < numbers.length; i++) {
        // Nếu người dùng đã hủy tiến trình
        if (signal?.aborted) {
            console.log("Processing was cancelled.");
            return;
        }

        console.log(`Processing: ${numbers[i]}`);

        // Gọi hàm theo dõi tiến trình nếu có
        if (onProgress) {
            const progress = Math.round(((i + 1) / numbers.length) * 100);
            onProgress(progress);
        }

        // Delay trước khi xử lý phần tử tiếp theo
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, delayMs);
            // Nếu tiến trình bị hủy trong khi chờ
            signal?.addEventListener("abort", () => {
                clearTimeout(timeout);
                reject(new Error("Cancelled during delay."));
            });
        });
    }

    console.log("All numbers processed.");
}

const controller = new AbortController(); // để hủy nếu cần

processWithDelay([10, 20, 30, 40], {
    delayMs: 1000,
    onProgress: (percent) => console.log(`Progress: ${percent}%`),
    signal: controller.signal,
}).catch((err) => {
    console.error("Error:", err.message);
});

// Hủy sau 2.5 giây (ví dụ)
setTimeout(() => {
    controller.abort();
}, 3500);
