export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return res.status(200).json({ ok: true, message: 'Webhook route active' });
    }

    if (req.method !== 'POST') {
      return res.status(200).send('OK');
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      console.error('TELEGRAM_BOT_TOKEN manquant');
      return res.status(500).send('Token manquant');
    }

    const API = `https://api.telegram.org/bot${token}`;
    const shopUrl = 'https://bot-tlgrm-nvvwj49bc-sanandreas02100-4814s-projects.vercel.app';

    let update = req.body;

    if (typeof update === 'string') {
      try {
        update = JSON.parse(update);
      } catch (e) {
        console.error('Body JSON invalide', e);
        return res.status(200).send('OK');
      }
    }

    console.log('Update reçu:', JSON.stringify(update));

    const sendMessage = async (chat_id, text, reply_markup = undefined) => {
      const r = await fetch(`${API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id,
          text,
          parse_mode: 'HTML',
          reply_markup
        })
      });

      const data = await r.json();
      console.log('sendMessage =>', JSON.stringify(data));
      return data;
    };

    if (update.message) {
      const chatId = update.message.chat.id;
      const text = (update.message.text || '').trim().toLowerCase();

      if (text.startsWith('/start')) {
        await sendMessage(
          chatId,
          'BIENVENUE CHEZ <b>SAN ANDREAS SOCIAL CLUB 02</b> 🌵🏜️',
          {
            keyboard: [[
              { text: '🌵 Ouvrir le menu San Andreas 02', web_app: { url: shopUrl } }
            ]],
            resize_keyboard: true,
            is_persistent: true
          }
        );
      } else if (text === '/menu') {
        await sendMessage(
          chatId,
          'Voici le menu de <b>SAN ANDREAS SOCIAL CLUB 02</b> 🌵',
          {
            inline_keyboard: [[
              { text: '🌵 Ouvrir le menu', web_app: { url: shopUrl } }
            ]]
          }
        );
      } else {
        await sendMessage(chatId, 'Envoie /start');
      }
    }

    return res.status(200).send('OK');
  } catch (e) {
    console.error('Erreur Bot:', e);
    return res.status(200).send('OK');
  }
}
