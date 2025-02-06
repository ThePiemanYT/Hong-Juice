let allArticles = []; // Store all articles globally
let currentPage = 1;
const articlesPerPage = 10;

// Function to load all articles and apply pagination
function loadArticles() {
    fetch('/public/json/articles.json')
        .then(response => response.json())
        .then(articles => {
            allArticles = articles;
            if (window.location.hash) {
                loadArticleFromHash(); // If hash exists, load the article
            } else {
                displayArticles(currentPage);
                createPaginationButtons();
            }
        })
        .catch(error => {
            document.getElementById("articles").innerHTML = "<p>Error loading articles.</p>";
            console.error(error);
        });
}

// Function to display articles for the current page
function displayArticles(page) {
    const container = document.getElementById("articles");
    container.innerHTML = "";

    let start = (page - 1) * articlesPerPage;
    let end = start + articlesPerPage;
    let paginatedArticles = allArticles.slice(start, end);

    paginatedArticles.forEach(article => {
        const div = document.createElement("div");
        div.className = "article";
        div.innerHTML = `<h2>${article.title}</h2><p>${article.content.substring(0, 50)}...</p>`;
        div.onclick = () => { window.location.hash = article.id; };
        container.appendChild(div);
    });

    document.getElementById("pagination").style.display = "block"; // Ensure pagination is visible
}

// Function to create pagination buttons
function createPaginationButtons() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    let totalPages = Math.ceil(allArticles.length / articlesPerPage);

    if (totalPages > 1) {
        if (currentPage > 1) {
            const prevButton = document.createElement("button");
            prevButton.innerText = "Previous";
            prevButton.onclick = () => changePage(currentPage - 1);
            paginationContainer.appendChild(prevButton);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.innerText = i;
            pageButton.className = i === currentPage ? "active" : "";
            pageButton.onclick = () => changePage(i);
            paginationContainer.appendChild(pageButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement("button");
            nextButton.innerText = "Next";
            nextButton.onclick = () => changePage(currentPage + 1);
            paginationContainer.appendChild(nextButton);
        }
    }
}

// Function to change page
function changePage(page) {
    currentPage = page;
    displayArticles(page);
    createPaginationButtons();
}

// Function to show full article when clicked
function loadArticleFromHash() {
    const hash = window.location.hash.substring(1);
    const article = allArticles.find(a => a.id === hash);

    if (article) {
        document.getElementById("articles").innerHTML = `
            <div class="article no-hover">
                <h2>${article.title}</h2>
                ${article.content.split("\n").map(paragraph => `<p>${paragraph}</p>`).join('')}
                <p><strong>Source:</strong> <a href="${article.sourceLink}" target="_blank">${article.source}</a></p>
                <button onclick="goBack()">Back</button>
            </div>
        `;

        document.body.classList.add("no-hover"); // Disable hover globally
        document.getElementById("pagination").style.display = "none"; // Hide pagination
    } else {
        loadArticles();
    }
}

// Function to go back to the list of articles
function goBack() {
    window.location.hash = ''; 
    document.body.classList.remove("no-hover"); // Re-enable hover globally
    document.getElementById("pagination").style.display = "block"; // Show pagination
    displayArticles(currentPage);
    createPaginationButtons();
}

// Function to search articles using fuzzy matching
function searchArticles(query) {
    const options = {
        keys: ['title', 'content'],
        threshold: 0.3
    };

    const fuse = new Fuse(allArticles, options);
    const results = fuse.search(query);

    const container = document.getElementById("articles");
    container.innerHTML = "";

    if (results.length === 0) {
        container.innerHTML = "<p>No articles found.</p>";
        return;
    }

    results.forEach(result => {
        const div = document.createElement("div");
        div.className = "article";
        div.innerHTML = `<h2>${result.item.title}</h2><p>${result.item.content.substring(0, 50)}...</p>`;
        div.onclick = () => { window.location.hash = result.item.id; };
        container.appendChild(div);
    });

    document.getElementById("pagination").style.display = "none"; // Hide pagination on search results
}

// Event listener for search bar
document.getElementById("searchBar").addEventListener("input", (e) => {
    const query = e.target.value.trim();
    if (query) {
        searchArticles(query);
    } else {
        displayArticles(currentPage);
        createPaginationButtons();
    }
});

// Listen for hash changes
window.addEventListener("hashchange", loadArticleFromHash);

// Load articles on page load
window.addEventListener("load", loadArticles);
