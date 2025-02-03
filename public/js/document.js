let allArticles = []; // Store all articles globally
let currentPage = 1;
const articlesPerPage = 10;

// Function to load all articles and apply pagination
function loadArticles() {
    const container = document.getElementById("articles");
    container.innerHTML = "";

    fetch('/public/json/articles.json')
        .then(response => response.json())
        .then(articles => {
            allArticles = articles;
            displayArticles(currentPage); // Show first page
            createPaginationButtons();
        })
        .catch(error => {
            container.innerHTML = "<p>Error loading articles.</p>";
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
  
    fetch('/public/json/articles.json')
        .then(response => response.json())
        .then(articles => {
            const article = articles.find(a => a.id === hash);

            if (article) {
                document.getElementById("articles").innerHTML = `
                    <div class="article">
                        <h2>${article.title}</h2>
                        ${article.content.split("\n").map(paragraph => `<p>${paragraph}</p>`).join('')}
                        <p><strong>Source:</strong> <a href="${article.sourceLink}" target="_blank">${article.source}</a></p>
                        <button onclick="goBack()">Back</button>
                    </div>
                `;
                document.getElementById("pagination").style.display = "none"; // Hide pagination when viewing an article
            } else {
                loadArticles();
            }
        })
        .catch(error => {
            document.getElementById("articles").innerHTML = "<p>Error loading the article.</p>";
            console.error(error);
        });
}

// Function to go back to the list of articles
function goBack() {
    window.location.hash = ''; 
    document.getElementById("pagination").style.display = "block"; // Show pagination again
    loadArticles();
}

// Listen for hash changes
window.addEventListener("hashchange", loadArticleFromHash);
window.addEventListener("load", () => {
    if (window.location.hash) {
        loadArticleFromHash();
    } else {
        loadArticles();
    }
});
