document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  const addButton = document.getElementById("new-toy-btn");

  // Fetch and display toys
  fetchToys();

  // Event listener for adding a new toy
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    addNewToy();
  });

  // Event listener for updating toy likes
  toyCollection.addEventListener("click", event => {
    if (event.target.classList.contains("like-btn")) {
      const toyId = event.target.id;
      updateToyLikes(toyId);
    }
  });

  // Fetch toys from the server and display them
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch toys");
        }
        return response.json();
      })
      .then(toys => {
        toys.forEach(toy => {
          renderToyCard(toy);
        });
      })
      .catch(error => {
        console.error("Error fetching toys:", error);
      });
  }

  // Add a new toy to the server and display it
  function addNewToy() {
    const name = toyForm.elements.name.value;
    const image = toyForm.elements.image.value;

    const newToy = {
      name: name,
      image: image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to add new toy");
        }
        return response.json();
      })
      .then(toy => {
        renderToyCard(toy);
        toyForm.reset();
        toyForm.style.display = "none";
      })
      .catch(error => {
        console.error("Error adding new toy:", error);
      });
  }

  // Update toy likes on the server and in the DOM
  function updateToyLikes(toyId) {
    const toyCard = document.getElementById(`toy-${toyId}`);
    const likeCount = toyCard.querySelector("p");
    const currentLikes = parseInt(likeCount.innerText);

    const updatedLikes = currentLikes + 1;

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: updatedLikes
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to update toy likes");
        }
        return response.json();
      })
      .then(updatedToy => {
        likeCount.innerText = `${updatedLikes} Likes`;
      })
      .catch(error => {
        console.error("Error updating toy likes:", error);
      });
  }

  // Render a toy card in the DOM
  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.id = `toy-${toy.id}`;
    card.classList.add("card");

    const nameElement = document.createElement("h2");
    nameElement.innerText = toy.name;

    const imageElement = document.createElement("img");
    imageElement.src = toy.image;
    imageElement.classList.add("toy-avatar");

    const likesElement = document.createElement("p");
    likesElement.innerText = `${toy.likes} Likes`;

    const likeButton = document.createElement("button");
    likeButton.classList.add("like-btn");
    likeButton.id = toy.id;
    likeButton.innerText = "Like ❤️";

    card.appendChild(nameElement);
    card.appendChild(imageElement);
    card.appendChild(likesElement);
    card.appendChild(likeButton);

    toyCollection.appendChild(card);
  }
});
