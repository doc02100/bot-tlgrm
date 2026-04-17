export default async function handler(req, res) {
  try {
    console.log("Méthode reçue :", req.method);

    if (req.method !== "POST") {
      return res.status(200).send("OK");
    }

    const update = req.body;
    console.log("Update Telegram :", JSON.stringify(update, null, 2));

    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      console.error("TELEGRAM_BOT_TOKEN manquant");
      return res.status(500).send("Token manquant");
    }

    const API = `https://api.telegram.org/bot${token}`;
    const shopUrl = "https://bot-tlgrm-43mi2728d-sanandreas02100-4814s-projects.vercel.app";

    async function sendMessage(chat_id, text, reply_markup = undefined) {
      const response = await fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id,
          text,
          parse_mode: "HTML",
          reply_markup
        })
      });

      const data = await response.json();
      console.log("Réponse sendMessage :", data);
      return data;
    }

    if (update.message) {
      const chatId = update.message.chat.id;
      const text = (update.message.text || "").trim().toLowerCase();

      if (text.startsWith("/start")) {
        await sendMessage(
          chatId,
          "BIENVENUE CHEZ <b>SAN ANDREAS SOCIAL CLUB 02</b> 🌵🏜️",
          {
            keyboard: [
              [
                {
                  text: "🌵 Ouvrir le menu San Andreas 02",
                  web_app: { url: shopUrl }
                }
              ]
            ],
            resize_keyboard: true,
            is_persistent: true
          }
        );
      } else if (text === "/menu") {
        await sendMessage(
          chatId,
          "Voici le menu de <b>SAN ANDREAS SOCIAL CLUB 02</b> 🌵",
          {
            inline_keyboard: [
              [
                {
                  text: "🌵 Ouvrir le menu",
                  web_app: { url: shopUrl }
                }
              ]
            ]
          }
        );
      } else {
        await sendMessage(
          chatId,
          "Commande non reconnue. Envoie /start"
        );
      }
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Erreur API Telegram :", error);
    return res.status(200).send("OK");
  }
}
