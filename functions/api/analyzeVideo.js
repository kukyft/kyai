// File: functions/api/analyzeVideo.js

/**
 * Hàm này hoạt động như một "người trung gian" an toàn.
 * Nó nhận yêu cầu từ trang web của bạn, sau đó bí mật thêm API key vào
 * và gửi yêu cầu đó đến Google Gemini.
 * Cuối cùng, nó trả kết quả về lại cho trang web.
 */
export async function onRequestPost({ request, env }) {
  try {
    // Lấy dữ liệu mà người dùng gửi lên từ trang web
    const clientData = await request.json();

    // Lấy API Key đã được lưu an toàn trên Cloudflare
    const GEMINI_API_KEY = env.GEMINI_API_KEY;

    // Kiểm tra xem API Key đã được thiết lập chưa
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured.' }), { status: 500 });
    }

    // Địa chỉ của Gemini API
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    // Chuẩn bị dữ liệu để gửi cho Gemini
    const geminiPayload = {
      // Chúng ta sẽ xây dựng phần này chi tiết hơn ở giai đoạn sau
      // Bây giờ chỉ cần gửi một yêu cầu văn bản đơn giản để kiểm tra
      contents: clientData.contents 
    };

    // Gửi yêu cầu đến Gemini
    const geminiResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    // Lấy kết quả từ Gemini
    const geminiResult = await geminiResponse.json();

    // Gửi kết quả về lại cho trang web của bạn
    return new Response(JSON.stringify(geminiResult), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // Báo lỗi nếu có gì đó sai
    console.error('Proxy Error:', error);
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), { status: 500 });
  }
}
