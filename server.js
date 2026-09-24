const express = require('express');
const app = express();
app.use(express.json());

const botTokens = [
  process.env.BOT_COOKIE_1,
  process.env.BOT_COOKIE_2
];

async function getCsrfToken(cookie) {
  try {
    const res = await fetch('https://auth.roblox.com/v1/logout', {
      method: 'POST',
      headers: {
        'Cookie': `.ROBLOSECURITY=${cookie}`
      }
    });
    return res.headers.get('x-csrf-token') || '';
  } catch (e) {
    console.error('שגיאה בשליפת CSRF:', e);
    return '';
  }
}

async function followPlayer(targetUserId) {
  for (const cookie of botTokens) {
    if (!cookie) continue;
    try {
      const csrfToken = await getCsrfToken(cookie);
      
      const res = await fetch(`https://friends.roblox.com/v1/users/${targetUserId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `.ROBLOSECURITY=${cookie}`,
          'x-csrf-token': csrfToken,
          'Referer': 'https://www.roblox.com/'
        }
      });

      const responseText = await res.text();

      if (res.ok) {
        console.log(`✅ בוט עקב בהצלחה אחרי שחקן ID: ${targetUserId}`);
      } else {
        console.log(`⚠️ נכשל במעקב אחרי ${targetUserId}, סטטוס: ${res.status}, תגובה: ${responseText}`);
      }
    } catch (err) {
      console.error('❌ שגיאה בביצוע העקיבה:', err);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
}

app.post('/player-joined', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send({ error: 'Missing userId' });
  }

  console.log(`🎮 שחקן חדש נכנס למשחק! UserId: ${userId}`);
  followPlayer(userId);

  res.status(200).send({ success: true, message: 'Follow request queued' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 השרת רץ ומאזין בפורט ${PORT}`);
});
