// File: functions/api/analyzeVideo.js (Phiên bản nâng cấp)

export async function onRequestPost({ request, env }) {
  try {
    // Lấy địa chỉ Ngrok đã được lưu an toàn trên Cloudflare
    const NGROK_URL = env.NGROK_URL;
    if (!NGROK_URL) {
      return new Response(JSON.stringify({ error: 'NGROK_URL is not configured.' }), { status: 500 });
    }

    // Lấy dữ liệu mà trang web gửi lên (ví dụ: nội dung chat)
    const clientData = await request.json();

    // Địa chỉ đầy đủ của "cổng nhận lệnh" trên máy tính của bạn
    const localServerUrl = `${NGROK_URL}/execute`;

    // Gửi yêu cầu qua "cây cầu" Ngrok đến máy tính của bạn
    const localServerResponse = await fetch(localServerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Dòng này rất quan trọng để tránh lỗi từ Ngrok
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(clientData),
    });

    // Lấy phản hồi từ máy tính của bạn và gửi về lại cho trang web
    const responseData = await localServerResponse.json();

    return new Response(JSON.stringify(responseData), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to connect to local server via Ngrok.' }), { status: 500 });
  }
}
