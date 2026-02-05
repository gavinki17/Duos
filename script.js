const API_KEY = "764c5132-f2f5402a-f132ea50-56685478";

async function getStats(username) {
  const res = await fetch(
    `https://fortniteapi.io/v1/stats?username=${username}`,
    {
      headers: {
        Authorization: API_KEY
      }
    }
  );

  if (!res.ok) throw new Error("Player not found");
  return res.json();
}

function calculateSynergy(p1, p2) {
  const kd1 = p1.global_stats.duo.kd;
  const kd2 = p2.global_stats.duo.kd;

  const win1 = p1.global_stats.duo.winRate;
  const win2 = p2.global_stats.duo.winRate;

  const matches =
    p1.global_stats.duo.matches +
    p2.global_stats.duo.matches;

  let score = 0;

  // KD balance
  const kdDiff = Math.abs(kd1 - kd2);
  score += Math.max(0, 30 - kdDiff * 10);

  // Average KD
  score += ((kd1 + kd2) / 2) * 10;

  // Win rate
  score += ((win1 + win2) / 2) * 0.4;

  // Experience
  score += Math.min(20, matches / 50);

  return Math.min(100, Math.round(score));
}

function getRating(score) {
  if (score < 30) return "❌ Bad Duo";
  if (score < 50) return "⚠️ Weak Duo";
  if (score < 70) return "✅ Solid Duo";
  if (score < 85) return "🔥 Strong Duo";
  return "👑 Elite Duo";
}

async function analyzeDuo() {
  const p1Name = player1.value;
  const p2Name = player2.value;
  const result = document.getElementById("result");

  result.innerHTML = "Analyzing duo synergy... ⏳";

  try {
    const p1 = await getStats(p1Name);
    const p2 = await getStats(p2Name);

    const score = calculateSynergy(p1, p2);
    const rating = getRating(score);

    result.innerHTML = `
      <h2>${rating}</h2>
      <p>Synergy Score: <strong>${score}/100</strong></p>
      <p>${p1Name} KD: ${p1.global_stats.duo.kd}</p>
      <p>${p2Name} KD: ${p2.global_stats.duo.kd}</p>
    `;
  } catch (err) {
    result.innerHTML = "❌ Failed to fetch stats. Check usernames.";
  }
}
