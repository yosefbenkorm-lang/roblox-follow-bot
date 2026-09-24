const express = require('express');
const app = express();

// פתרון לבעיית חסימת הדפדפן (CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

function getBotTokens() {
  const tokens = [];
  for (let i = 1; i <= 100; i++) {
    const token = process.env[`BOT_COOKIE_${i}`];
    if (token) {
      tokens.push(token);
    }
  }
  return tokens;
}

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
    return '';
  }
}

async function getUserIdByUsername(username) {
  try {
    const res = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: true })
    });
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      return data.data[0].id;
    }
  } catch (err) {
    console.error('❌ שגיאה במציאת ה-ID של המשתמש:', err);
  }
  return null;
}

async function followPlayer(targetUserId) {
  const botTokens = getBotTokens();
  if (botTokens.length === 0) {
    console.log('⚠️ לא נמצאו בוטים מוגדרים במשתני הסביבה!');
    return;
  }

  for (const cookie of botTokens) {
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

      if (res.ok) {
        console.log(`✅ בוט עקב בהצלחה אחרי שחקן ID: ${targetUserId}`);
      } else {
        const text = await res.text();
        console.log(`⚠️ נכשל במעקב, סטטוס: ${res.status}, תגובה: ${text}`);
      }
    } catch (err) {
      console.error('❌ שגיאה בביצוע העקיבה:', err);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

app.post('/follow-user', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send({ error: 'Missing username' });
  }

  console.log(`🔍 מחפש את ה-ID עבור השחקן: ${username}`);
  const userId = await getUserIdByUsername(username);
  
  if (!userId) {
    return res.status(404).send({ error: 'User not found on Roblox' });
  }

  console.log(`🎮 נמצא UserId: ${userId}. מפעיל את הבוטים...`);
  followPlayer(userId);

  res.status(200).send({ success: true, message: `Bot follow sequence started for ${username} (ID: ${userId})` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 השרת רץ ומאזין בפורט ${PORT}`);
});
