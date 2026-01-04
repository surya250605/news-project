// ================== CONFIG ==================
const apiKey = "YOUR_GNEWS_API_KEY"; // <-- put your real key here
const newsContainer = document.getElementById("news-container");
const lastUpdated = document.getElementById("lastUpdated");

let currentCategory = "general";

// ================== DEMO DATA ==================
const demoArticles = [
  {
    title: "India wins thrilling cricket match",
    description: "India secured a dramatic victory in the final over.",
    url: "https://example.com",
    image: "https://via.placeholder.com/300x180"
  },
  {
    title: "AI is transforming the future",
    description: "Artificial Intelligence is changing every industry.",
    url: "https://example.com",
    image: "https://via.placeholder.com/300x180"
  },
  {
    title: "Stock markets close on a high",
    description: "Strong investor confidence pushes markets up.",
    url: "https://example.com",
    image: "https://via.placeholder.com/300x180"
  }
];

// ================== DISPLAY NEWS ==================
function displayNews(articles) {
  newsContainer.innerHTML = "";

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "news-card";

    card.innerHTML = `
      <img src="${article.image || article.urlToImage || 'https://via.placeholder.com/300x180'}">
      <h3>${article.title}</h3>
      <p>${article.description || "No description available."}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;

    newsContainer.appendChild(card);
  });

  lastUpdated.innerText = "Last updated: " + new Date().toLocaleTimeString();
}

// ================== FETCH NEWS ==================
async function fetchNews(url, fallbackUrl = null) {
  newsContainer.innerHTML = "Loading latest news...";

  try {
    const response = await fetch(url);
    const data = await response.json();

    // API error or quota reached
    if (!data.articles || data.articles.length === 0) {
      if (fallbackUrl) {
        fetchNews(fallbackUrl);
        return;
      }
      throw new Error("No articles");
    }

    displayNews(data.articles.slice(0, 10));

  } catch (error) {
    console.warn("API failed, loading demo data");
    displayNews(demoArticles);
  }
}

// ================== CATEGORY ==================
function loadCategory(category) {
  currentCategory = category;

  const primaryUrl = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=10&token=${apiKey}`;
  const fallbackUrl = `https://gnews.io/api/v4/top-headlines?category=world&lang=en&max=10&token=${apiKey}`;

  fetchNews(primaryUrl, fallbackUrl);
}

// ================== SEARCH ==================
function searchNews() {
  const query = document.getElementById("searchInput").value.trim();

  if (!query) {
    newsContainer.innerHTML = "Please enter a keyword!";
    return;
  }

  const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&token=${apiKey}`;
  fetchNews(url);
}

// ================== REFRESH ==================
function refreshNews() {
  loadCategory(currentCategory);
}

// ================== DARK MODE ==================
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// ================== AUTO LOAD ==================
window.onload = () => {
  loadCategory("general");
};
