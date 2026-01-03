const apiKey = "YOUR_GNEWS_API_KEY";
const newsDiv = document.getElementById("news");
const lastUpdated = document.getElementById("lastUpdated");

let currentCategory = "general";

// 🚀 Auto load news on page open
window.onload = () => {
    loadCategory("general");
};

// 🔄 Refresh button
function refreshNews() {
    loadCategory(currentCategory);
}

// 🌍 Fetch news
async function fetchNews(url, fallbackUrl) {
    newsDiv.innerHTML = "Loading latest news...";

    try {
        const response = await fetch(url);
        const data = await response.json();

        // ❌ API error or quota issue
        if (data.errors || data.message) {
            console.error("API Error:", data);
            if (fallbackUrl) {
                fetchNews(fallbackUrl);
                return;
            }
            newsDiv.innerHTML = "API limit reached. Try again later.";
            return;
        }

        // ❌ No articles
        if (!data.articles || data.articles.length === 0) {
            if (fallbackUrl) {
                fetchNews(fallbackUrl);
                return;
            }
            newsDiv.innerHTML = "No news available right now.";
            return;
        }

        // ✅ SHOW NEWS
        newsDiv.innerHTML = "";

        data.articles.slice(0, 10).forEach(article => {
            newsDiv.innerHTML += `
                <div class="news-card">
                    <img src="${article.image || ''}">
                    <h3>${article.title}</h3>
                    <p>${article.description || ''}</p>
                    <a href="${article.url}" target="_blank">Read More</a>
                </div>
            `;
        });

        lastUpdated.innerText = "Last updated: " + new Date().toLocaleTimeString();

    } catch (error) {
        console.error(error);
        newsDiv.innerHTML = "Error loading news.";
    }
}

// 📂 Category loader (FIXED)
function loadCategory(category) {
    currentCategory = category;

    const primaryUrl = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=10&token=${apiKey}`;

    // 🔁 Guaranteed fallback
    const fallbackUrl = `https://gnews.io/api/v4/top-headlines?category=world&lang=en&max=10&token=${apiKey}`;

    fetchNews(primaryUrl, fallbackUrl);
}

// 🔍 Search
function searchNews() {
    const query = document.getElementById("searchInput").value.trim();

    if (!query) {
        newsDiv.innerHTML = "Please enter a keyword!";
        return;
    }

    const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&token=${apiKey}`;
    fetchNews(url);
}

// 🌙 Dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
function loadCategory(category) {
    currentCategory = category;

    const primaryUrl = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=10&token=${apiKey}`;

    const fallbackUrl = `https://gnews.io/api/v4/top-headlines?category=world&lang=en&max=10&token=${apiKey}`;

    fetchNews(primaryUrl, fallbackUrl);
}
