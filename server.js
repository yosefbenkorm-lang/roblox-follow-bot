const express = require('express');
const app = express();
app.use(express.json());

// רשימת ה-Cookies של חשבונות הבוטים שלך (שמור על סודיות!)
const botTokens = [
  process.env._|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEQAhoGCAIQBBgBIhwKBGR1aWQSFDEyMDE4ODkwNDk5Mjc5MzY2MTQzIhIKBXVuYW1lEglXYXRjaDUwODQiEgoDdWlkEgsxMDc5MzYwNzg3MCgD.SGchpuh-GYNhwdWdUD-jR6QO2j-jlRzTIfr4rM8LtdKv4uxmTD00xWvXs0NHzEMFz_LT8liHFMF9X-nLXgMrkqXzWdTZgnMsnXDEMhl-LzIrpM0imYa7JAKRM6wJAbPn413r13HWY-E-oqtHQNQxySBFPMLZooR5no9N-lcjDDJ1Btf2whxgz8UYN50zFJKsmXzg7mdjP8daz_EPdRWhjRjCXGZCVvdQDSMHKM6wMCjr9hS69sjDZIiSX8NqWY7znM2uEWSdtBF1glWE8g_x-gX7w741h2zXsgHJumIKdDkJsboT2GoSPglgtQu0GEEVDB9Sx9-NHZOpHTANChVg6-fIhx1o7m3Inv_EnJxn4_x1kzn0j1oWlETliPco-Hvl5f5ZuLYxM_uHBy2U8cPvFE9c68xj6k6VbCl5No1I2dVgHi5VF-Op0sfAoEmJnogPWlt5hsVtwjy1eRFRoMWQKwMaQVHeZPUN1EVj0tTmZSF6KLAb-yQYzNGHWMwNl913IPbFQ5vlrFYl3P-6Y3p05dyr3z2VY4IrmFm7vd8pQ_q4mdxs45l7S4_UvPuMFbtBgKjRK2pkUlVdkMxYraqCK_bg4-QmlZNtDvvcuyXwZSWpR6okT2QoJ2S6-KRBifQqgGhzTs2FVKhRX8RiEBuC-pVgMmzMO2yks81sB1pr-9Tfz_VE94mfl5zaBGaEzoiW3MiAzwtFrvQOn_i427VjJEVKj02cKnAJs2uiXY8kZXQ_PMNeqr4zmTCKG6AeIaDQMgd_SFo6ZAZYtv0vRE7HwTg35sKCEalpmpS9ldnwZe91o1B4Hq8tfIW8WuTUEjPTP9F-v8DIKTSMCcQRKM_GTOX2Gg_uosJcjLOpK8Sia0kUKRUqBRQG2tXFbDfMuGSlPa0xalC3Q13LCgGiYOfUbA.EnB8wKWPnd0bA4Z5hp3FejzU2co,
  process.env._|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEQAhoGCAIQBBgBIhwKBGR1aWQSFDE1MTY1NjkxMjY5MTUxMTgyNjk4Ih0KBXVuYW1lEhRIZXlZb3VDaGVja015UHJvZmlsZSISCgN1aWQSCzExNjc4MDU5MTU0KAM.qxU1N-jAZPeDXHmrFExQhQZJle9dDWuV9v2AAMFC3BP7UZ6O_0G13wXLIXKUwUOXwKR_N_aLDG00vv9QAqQG70NtQYmxr300TIfK96R4bNufQf3o4ZK8RvReaBODfHuu2woP2j3U3vpRRU02ya6YGPJzAgb-uJxGAS5JsR3JRTbiO5pO_cyw27HUoN8N4YgyHdrIjiEfF8qvPTbjSz8ashU3tL17Azsnfqm5A2IDkVSMcqtgAGtWhSfdBljNm2MQ2x94BI9MTCUuLGfqt8OlGNj1w2hp05hD6z3ESAIUxNBZXNd7A1etFYsWZh18nyoXMKT9wjv8rCCCNJ0Iw1oiw9ue1si3RWxCY9as94ctSPRIkxjKLekVICVBtSuga5M6vyPjnAvcpJ_2resXsq6zsiO8F1BLULqDutMTWs8b1eyDm9PAES4cVswrMY1MMT63Tcf5pKrft8ytJm__SBz2TGhR9weTlp1ytB3DJbVBO8m7hSH0xiqpEfqnrMnBjYvjar0LJeVkTRIfGVgGk2hcoK24jmV4xondz36Fdq2c2bxOI_nK3m91GWyAPn_DPqdIQyZZE4tchHzYEKQ8wOIwOFaD7wFAT8WzckKOj5yPGGNU4oezduavRtwsqDtRdJh9ezR6Za98-xB9e3tRdfmtPI13RPIPouwmki--IgRK7zMCvObLetNrROVxCcvOeH-i0snOoO6h376KNGSYNty5Gej52ZkqHXVFb28gdkK3P_dlUc_Ls7u-rVnwztBsZmfye6jQsSG7Cgw-Vax4c8yNFEH3dxbDyhuLhjw5p6JHkYMbLWOzZh926bSaVw2NKsDFcgayEF04AvQG-KqEexlhb5icp_2ZvnYf4EufDBJVvjjeRyL3tQmC0f3fJHqMOwICs41T-VkMk2L98TO17Us_rPPJyWH_WgY9cTNfpw2WfhDPFVPmRUQGhRf3O_fnNEld._yo8rXxJYPk50awt1Ib4vXCPmNw
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
          'x-csrf-token': csrfToken
        }
      });

      if (res.ok) {
        console.log(`✅ בוט עקב בהצלחה אחרי שחקן ID: ${targetUserId}`);
      } else {
        console.log(`⚠️ נכשל במעקב אחרי ${targetUserId}, סטטוס: ${res.status}`);
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