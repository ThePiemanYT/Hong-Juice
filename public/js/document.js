// Function to load all articles as clickable boxes
function loadArticles() {
  const container = document.getElementById("articles");
  container.innerHTML = "";

  // Fetch articles from the external JSON file
  fetch('/public/json/articles.json')
    .then(response => response.json())
    .then(articles => {
      articles.forEach(article => {
          const div = document.createElement("div");
          div.className = "article";
          div.innerHTML = `<h2>${article.title}</h2><p>${article.content.substring(0, 50)}...</p>`;
          div.onclick = () => { window.location.hash = article.id; };
          container.appendChild(div);
      });
    })
    .catch(error => {
      container.innerHTML = "<p>Error loading articles.</p>";
      console.error(error);
    });
}

// Function to show full article when clicked
function loadArticleFromHash() {
  const hash = window.location.hash.substring(1);
  
  // Fetch the articles again for the full content
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
          
          // Add the no-hover class to body when on a subpage (hash state)
          document.body.classList.add('no-hover');
      } else {
          loadArticles(); // If no article found, reload all
      }
    })
    .catch(error => {
      document.getElementById("articles").innerHTML = "<p>Error loading the article.</p>";
      console.error(error);
    });
}

// Function to go back to the original page (list of articles)
function goBack() {
  window.location.hash = ''; // Clear the hash to go back to the list
  document.body.classList.remove('no-hover'); // Re-enable hover effect on articles
  loadArticles(); // Reload the list of articles
}

// Listen for hash changes
window.addEventListener("hashchange", loadArticleFromHash);
window.addEventListener("load", () => {
  // Handle initial load: If there's a hash, load the article
  if (window.location.hash) {
    loadArticleFromHash();
  } else {
    loadArticles(); // Otherwise, load the main articles list
    document.body.classList.remove('no-hover'); // Re-enable hover effect
  }
});
