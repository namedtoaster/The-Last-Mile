// Built with Lovable. Shows a random quote, with a button for the next one.
const quotes = await fetch('https://quoteboard.example.com/api/quotes').then((r) => r.json());
const app = document.getElementById('app');
function show() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  app.innerHTML = `<blockquote>${q.text}</blockquote><button id="next">Next quote</button>`;
  document.getElementById('next').onclick = show;
}
show();
