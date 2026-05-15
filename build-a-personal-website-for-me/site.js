function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value ?? "";
  }
}

function setLink(id, href) {
  const element = document.getElementById(id);
  if (element) {
    element.href = href;
  }
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightName(text, name) {
  if (!text || !name) {
    return text;
  }

  const pattern = new RegExp(`\\b${escapeRegExp(name)}\\b`, "g");
  return text.replace(pattern, '<span class="name-highlight">$&</span>');
}

function renderHomePage(data) {
  const { profile, researchInterests, publications, experience } = data;

  setText("name", profile.name);
  setText("about-detail", profile.about);
  setLink("linkedin-link", profile.linkedin);
  setLink("github-link", profile.github);
  setLink("scholar-link", profile.scholar);
  setLink("cv-link", profile.cv);

  const photo = document.getElementById("profile-photo");
  if (photo) {
    photo.src = profile.photo;
  }

  const interests = document.getElementById("research-interests");
  if (interests) {
    researchInterests.forEach((item) => {
      interests.appendChild(createElement("li", "", item));
    });
  }

  const publicationsList = document.getElementById("publications-list");
  if (publicationsList) {
    publications.forEach((item) => {
      const article = createElement("article", "stack-item");
      article.appendChild(createElement("h3", "", item.title));
      article.appendChild(createElement("p", "subtitle", item.venue));
      const authors = createElement("p", "publication-authors");
      authors.innerHTML = highlightName(item.detail, profile.publicationName);
      article.appendChild(authors);
      publicationsList.appendChild(article);
    });
  }

  const experienceList = document.getElementById("experience-list");
  if (experienceList) {
    experience.forEach((item) => {
      const article = createElement("article", "stack-item");
      const head = createElement("div", "item-head");
      const copy = document.createElement("div");
      copy.appendChild(createElement("h3", "", item.role));
      copy.appendChild(createElement("p", "subtitle", item.organization));
      head.appendChild(copy);
      head.appendChild(createElement("p", "item-meta", item.period));
      article.appendChild(head);
      article.appendChild(createElement("p", "", item.detail));
      experienceList.appendChild(article);
    });
  }
}

function renderNewsPage(data) {
  const { news } = data;

  const newsList = document.getElementById("news-list");
  if (newsList) {
    news.forEach((item) => {
      const article = createElement("article", "timeline-item");
      const head = createElement("div", "item-head");
      const copy = document.createElement("div");
      copy.appendChild(createElement("h3", "", item.title));
      copy.appendChild(createElement("p", "", item.detail));

      if (item.link) {
        const link = createElement("a", "news-link", item.link.label);
        link.href = item.link.href;
        link.target = "_blank";
        link.rel = "noreferrer";
        copy.appendChild(link);
      }

      if (item.image) {
        const frame = createElement("figure", "news-image-frame");
        const image = document.createElement("img");
        image.src = item.image.src;
        image.alt = item.image.alt || item.title;
        frame.appendChild(image);
        copy.appendChild(frame);
      }

      head.appendChild(copy);
      head.appendChild(createElement("p", "item-meta", item.date));
      article.appendChild(head);
      newsList.appendChild(article);
    });
  }
}

function renderLifePage(data) {
  const { life } = data;

  setText("life-title", life.title);
  setText("life-intro", life.intro);

  const sections = document.getElementById("life-sections");
  if (sections) {
    life.sections.forEach((item) => {
      const article = createElement("article", "stack-item");
      if (item.page) {
        const heading = createElement("h3", "");
        const link = createElement("a", "section-page-link", item.title);
        link.href = item.page;
        heading.appendChild(link);
        article.appendChild(heading);
      } else {
        article.appendChild(createElement("h3", "", item.title));
      }
      article.appendChild(createElement("p", "", item.detail));

      if (item.photos && item.photos.length > 0) {
        const gallery = createElement("div", "photo-placeholder-grid");
        item.photos.forEach((photo) => {
          const frame = createElement("figure", "life-photo-frame");
          const image = document.createElement("img");
          image.src = photo.src;
          image.alt = photo.alt || item.title;
          frame.appendChild(image);
          gallery.appendChild(frame);
        });
        article.appendChild(gallery);
      }

      sections.appendChild(article);
    });
  }
}

function renderBooksPage(data) {
  const { books } = data;
  if (!books) {
    return;
  }

  setText("books-title", books.title);
  setText("books-intro", books.intro);

  const entries = document.getElementById("books-list");
  if (entries) {
    books.entries.forEach((item) => {
      const article = createElement("article", "stack-item");
      const lineParts = [item.title, item.author, item.year].filter(Boolean);
      article.appendChild(createElement("p", "book-line", lineParts.join(" - ")));
      if (item.note) {
        article.appendChild(createElement("p", "book-note", item.note));
      }
      entries.appendChild(article);
    });
  }
}

if (window.siteData) {
  renderHomePage(window.siteData);
  renderNewsPage(window.siteData);
  renderLifePage(window.siteData);
  renderBooksPage(window.siteData);
}
