export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(200).send('OK');

    const update = req.body;
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      console.error('TELEGRAM_BOT_TOKEN manquant');
      return res.status(500).send('Token manquant');
    }

    const API = `https://api.telegram.org/bot${token}`;
    const shopUrl = 'https://TON-PROJET.vercel.app';

    const sendMessage = async (chat_id, text, reply_markup) => {
      await fetch(`${API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id,
          text,
          parse_mode: 'HTML',
          reply_markup
        })
      });
    };

    const keyboardMarkup = {
      keyboard: [[
        { text: '🌵 Ouvrir le menu San Andreas 02', web_app: { url: shopUrl } }
      ]],
      resize_keyboard: true,
      is_persistent: true
    };

    if (update.message) {
      const { chat, text } = update.message;
      if (!chat?.id) return res.status(200).send('OK');

      const cleanText = (text || '').trim().toLowerCase();

      if (cleanText.startsWith('/start')) {
        await sendMessage(
          chat.id,
          'BIENVENUE CHEZ <b>SAN ANDREAS SOCIAL CLUB 02 🌵🏜️</b>',
          keyboardMarkup
        );
      }
    }

    return res.status(200).send('OK');
  } catch (e) {
    console.error('Erreur bot:', e);
    return res.status(200).send('OK');
  }
}
