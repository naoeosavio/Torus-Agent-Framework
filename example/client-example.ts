async function Ping() {
  const response = await fetch("http://localhost:4000/ping", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  console.log("Ping Status:", data);
}

Ping().catch(console.error);

async function status() {
  const response = await fetch("http://localhost:4000/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  console.log("Status Agent:", data);
}

status().catch(console.error);
