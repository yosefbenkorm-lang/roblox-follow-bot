const express = require('express');
const app = express();
app.use(express.json());

// פונקציה שאוספת את כל ה-Cookies של הבוטים מתוך משתני הסביבה (תומך בעד 100 בוטים ויותר)
function getBotTokens() {
  const tokens = [];
  // השרת יחפש אוטומטית משתנים מהצורה BOT_COOKIE_1, BOT_COOKIE_2, וכו' עד 100
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

// פונקציה הממירה שמות משתמש (Username) ל-UserId של רובלוקס
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
    
    // השהיה קטנה בין בוט לבוט כדי לא לקבל חסימת ספאם
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// כתובת חדשה שדרכה אפשר לשלוח Username
app.post('/follow-user', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send({ error: 'Missing username' });
  }

  console.ق(`🔍 מחפש את ה-ID עבור השחקן: ${username}`);
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
