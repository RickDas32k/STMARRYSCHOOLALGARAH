(function(){
  var ALBUMS = [
    { key: "campus", label: "Campus & classrooms", folder: "gallery/campus" },
    { key: "sports", label: "Sports & annual day", folder: "gallery/sports" },
    { key: "events", label: "Celebrations & events", folder: "gallery/events" }
  ];

  var categoriesView = document.getElementById("galleryCategories");
  var albumView = document.getElementById("galleryAlbum");
  var albumTitle = document.getElementById("galleryAlbumTitle");
  var masonryGrid = document.getElementById("masonryGrid");
  var emptyNote = document.getElementById("galleryEmpty");
  var backBtn = document.getElementById("galleryBack");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");

  if (!categoriesView) return; // not on the gallery page

  var photoCache = {};

  function loadList(album) {
    if (photoCache[album.key]) {
      return Promise.resolve(photoCache[album.key]);
    }
    return fetch(album.folder + "/photos.txt", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("no list");
        return res.text();
      })
      .then(function (text) {
        var list = text
          .split(/\r?\n/)
          .map(function (line) { return line.trim(); })
          .filter(function (line) { return line.length > 0 && line.indexOf("#") !== 0; });
        photoCache[album.key] = list;
        return list;
      })
      .catch(function () {
        photoCache[album.key] = [];
        return [];
      });
  }

  // Fill in photo counts on the category cards
  ALBUMS.forEach(function (album) {
    loadList(album).then(function (list) {
      var el = document.querySelector('[data-count="' + album.key + '"]');
      if (el) {
        el.textContent = list.length === 1 ? "1 photo" : list.length + " photos";
      }
    });
  });

  function openAlbum(key) {
    var album = ALBUMS.filter(function (a) { return a.key === key; })[0];
    if (!album) return;

    albumTitle.textContent = album.label;
    masonryGrid.innerHTML = "";
    emptyNote.hidden = true;

    loadList(album).then(function (list) {
      if (list.length === 0) {
        emptyNote.hidden = false;
        return;
      }
      list.forEach(function (filename) {
        var fig = document.createElement("figure");
        fig.className = "masonry-item";
        var img = document.createElement("img");
        img.src = album.folder + "/" + filename;
        img.alt = album.label + " \u2014 St. Mary's School, Algarah, Kalimpong";
        img.loading = "lazy";
        img.addEventListener("click", function () {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.hidden = false;
        });
        img.addEventListener("error", function () {
          fig.remove();
        });
        fig.appendChild(img);
        masonryGrid.appendChild(fig);
      });
    });

    categoriesView.hidden = true;
    albumView.hidden = false;
    window.scrollTo({ top: albumView.offsetTop - 90, behavior: "smooth" });
    history.replaceState(null, "", "#" + key);
  }

  function closeAlbum() {
    albumView.hidden = true;
    categoriesView.hidden = false;
    history.replaceState(null, "", "#");
  }

  document.querySelectorAll(".gallery-cat").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openAlbum(btn.getAttribute("data-cat"));
    });
  });

  backBtn.addEventListener("click", closeAlbum);

  lightboxClose.addEventListener("click", function () {
    lightbox.hidden = true;
    lightboxImg.src = "";
  });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      lightbox.hidden = true;
      lightboxImg.src = "";
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.hidden) {
      lightbox.hidden = true;
      lightboxImg.src = "";
    }
  });

  // Deep-link support: gallery.html#sports opens that album directly
  var initialKey = window.location.hash.replace("#", "");
  if (initialKey && ALBUMS.some(function (a) { return a.key === initialKey; })) {
    openAlbum(initialKey);
  }
})();
