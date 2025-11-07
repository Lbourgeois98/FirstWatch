export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const FORM_ID = "1FAIpQLSfXZVxP_s_oin2LEWz0rACz5J4QYxcocY9t4F6DMXJ0JYnkbg";
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      const data = JSON.parse(body || "{}");
      const params = new URLSearchParams();
      for (const [k,v] of Object.entries(data)) if(k.startsWith("entry.")) params.append(k, v);
      params.append("submit","Submit");
      const g = await fetch(`https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`, {
        method:"POST",headers:{ "Content-Type":"application/x-www-form-urlencoded" },body:params.toString()
      });
      return res.status(200).json({ ok:true });
    });
  } catch (e) { res.status(500).json({ error: "Server error" }); }
}