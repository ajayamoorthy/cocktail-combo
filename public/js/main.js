const drinksButton = document.getElementById("myDrinksButton");
const loginButton = document.getElementById("login-register");
const logoutButton = document.getElementById("logout");
drinksButton.style.display = "none";

const ingredients = [
  "151 proof rum",
  "7-Up",
  "Absinthe",
  "Absolut Citron",
  "Absolut Kurant",
  "Advocaat",
  "Ale",
  "Amaretto",
  "Angelica root",
  "Angostura bitters",
  "Anis",
  "Anisette",
  "Apple brandy",
  "Apple cider",
  "Apple juice",
  "Apple schnapps",
  "Apricot brandy",
  "Asparagus",
  "Bacardi",
  "Bailey’s irish cream",
  "Banana",
  "Banana liqueur",
  "Beer",
  "Benedictine",
  "Bitters",
  "Black Sambuca",
  "Blackberry brandy",
  "Blackberry schnapps",
  "Blackcurrant cordial",
  "Blue Curacao",
  "Blueberries",
  "Bourbon",
  "Brandy",
  "Brown sugar",
  "Butter",
  "Butterscotch schnapps",
  "Campari",
  "Carbonated water",
  "Champagne",
  "Chambord raspberry liqueur",
  "Chartreuse",
  "Cherries",
  "Cherry brandy",
  "Cherry Heering",
  "Cherry liqueur",
  "Cherry syrup",
  "Chocolate",
  "Chocolate liqueur",
  "Chocolate syrup",
  "Cider",
  "Cinnamon",
  "Clamato juice",
  "Cloves",
  "Club soda",
  "Cocoa powder",
  "Coconut liqueur",
  "Coconut milk",
  "Coconut rum",
  "Coffee",
  "Coffee brandy",
  "Coffee liqueur",
  "Cognac",
  "Cointreau",
  "Cola",
  "Cold water",
  "Condensed milk",
  "Cranberries",
  "Cranberry juice",
  "Cranberry liqueur",
  "Creme de Banane",
  "Creme de Cacao",
  "Creme de Cassis",
  "Creme fraiche",
  "Crown Royal",
  "Curacao",
  "Dark rum",
  "Demerara Sugar",
  "Drambuie",
  "Dry Vermouth",
  "Dubonnet Rouge",
  "Egg",
  "Egg white",
  "Egg yolk",
  "Espresso",
  "Everclear",
  "Firewater",
  "Frangelico",
  "Galliano",
  "Gin",
  "Ginger",
  "Ginger ale",
  "Ginger beer",
  "Glycerine",
  "Godiva liqueur",
  "Gold rum",
  "Gold tequila",
  "Grand Marnier",
  "Grapefruit juice",
  "Grapefruit",
  "Green Chartreuse",
  "Green Creme de Menthe",
  "Green ginger wine",
  "Grenadine",
  "Guava juice",
  "Guinness stout",
  "Hot Chocolate",
  "Hot Damn",
  "Hot water",
  "Ice",
  "Irish cream",
  "Irish whiskey",
  "Jack Daniels",
  "Jagermeister",
  "Jamaican rum",
  "Jameson Irish whiskey",
  "Jim Beam",
  "Johnnie Walker",
  "Kahlua",
  "Kirschwasser",
  "Kiwi",
  "Kiwi liqueur",
  "Lemon",
  "Lemon juice",
  "Lemon peel",
  "Lemon vodka",
  "Lemon-lime soda",
  "Lemonade",
  "Licorice root",
  "Light cream",
  "Light rum",
  "Lime",
  "Lime juice",
  "Lime vodka",
  "Limeade",
  "Malibu rum",
  "Mango",
  "Mango juice",
  "Maple syrup",
  "Maraschino cherry",
  "Maraschino liqueur",
  "Melon liqueur",
  "Mezcal",
  "Midori melon liqueur",
  "Milk",
  "Mini-snickers bars",
  "Mint",
  "Mint syrup",
  "Mountain Dew",
  "Nutmeg",
  "Orange",
  "Orange bitters",
  "Orange juice",
  "Orange peel",
  "Orange soda",
  "Orange vodka",
  "Ouzo",
  "Papaya",
  "Passion fruit juice",
  "Passion fruit syrup",
  "Peach brandy",
  "Peach nectar",
  "Peach schnapps",
  "Peach Vodka",
  "Peachtree schnapps",
  "Peppermint extract",
  "Peppermint schnapps",
  "Pernod",
  "Pina colada mix",
  "Pineapple",
  "Pineapple juice",
  "Pineapple rum",
  "Pisang Ambon",
  "Port",
  "Powdered sugar",
  "Prosecco",
  "Raisins",
  "Raspberries",
  "Raspberry cordial",
  "Raspberry juice",
  "Raspberry liqueur",
  "Red wine",
  "Ricard",
  "Root beer",
  "Rose",
  "Roses sweetened lime juice",
  "Rum",
  "Rye whiskey",
  "Sake",
  "Salt",
  "Sambuca",
  "Sarsaparilla",
  "Schnapps",
  "Scotch",
  "Sherbet",
  "Sherry",
  "Silver tequila",
  "Sloe gin",
  "Soda water",
  "Sour mix",
  "Southern Comfort",
  "Soy milk",
  "Sprite",
  "Squirt",
  "Strawberries",
  "Strawberry liqueur",
  "Strawberry schnapps",
  "Sugar",
  "Sugar syrup",
  "Sweet and sour",
  "Sweet Vermouth",
  "Tabasco sauce",
  "Tahini",
  "Tia Maria",
  "Tomato juice",
  "Triple sec",
  "Tuaca",
  "Vanilla extract",
  "Vanilla ice-cream",
  "Vanilla schnapps",
  "Vanilla vodka",
  "Vermouth",
  "vodka",
  "Water",
  "Whipped cream",
  "Whiskey",
  "White chocolate liqueur",
  "White creme de menthe",
  "White grape juice",
  "White port",
  "White rum",
  "White wine",
  "Wild Turkey",
  "Wine",
  "Worcestershire sauce",
  "Yeast",
  "Yukon Jack",
  "Zima",
];

let currentUser = null;


// Fetch the logged-in user's information
fetch("/getCurrentUser")
  .then((response) => response.json())
  .then((data) => {
    currentUser = data.username;
    console.log("Logged-in user:", currentUser);
    drinksButton.style.display = "block";
    logoutButton.style.display = "block";
    loginButton.style.display = "none";
  })
  .catch((error) => console.error("Error fetching current user:", error));


drinksButton.addEventListener("click", () => {
  window.location.href = "myPage.html";
});

loginButton.addEventListener("click", () => {
  window.location.href = "login.html";
});


$(document).ready(function () {
  $(".ingredient-select").each(function () {
    $(this).empty();
    $(this).append('<option value=""></option>');
    ingredients.forEach((ingredient) => {
      $(this).append(`<option value="${ingredient}">${ingredient}</option>`);
    });
  });

  // Initialize Select2 for all ingredient dropdowns
  if (!$.fn.select2.isInitialized) {
    $(".ingredient-select").select2({
      placeholder: "Select an ingredient",
      allowClear: true,
      language: {
        searchPlaceholder: "Type to search ingredients...",
      },
    });
    $.fn.select2.isInitialized = true;
  }

  $(".ingredient-select").on("change", function () {
    setTimeout(triggerSearch, 200);
  });
});

// Function to handle the form submission and search
function triggerSearch() {
  const ingredient1 = document.getElementById("ingredient1").value;
  const ingredient2 = document.getElementById("ingredient2").value;
  const ingredient3 = document.getElementById("ingredient3").value;

  if (ingredient1 || ingredient2 || ingredient3) {
    const ingredients = { ingredient1, ingredient2, ingredient3 };

    fetch("/searchCocktails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ingredients),
    })
      .then((response) => response.json())
      .then((data) => {
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

        data.forEach((cocktail) => {
          let ingredientsHtml = "";

          for (let i = 1; i <= 15; i++) {
            const ingredient = cocktail[`strIngredient${i}`];
            const measure = cocktail[`strMeasure${i}`];
            if (ingredient) {
              ingredientsHtml += `<p>${
                measure ? measure : ""
              } ${ingredient}</p>`;
            }
          }

          // Collapsible trigger and content for reviews
          resultsDiv.innerHTML += `
            <div id="drink-${cocktail.idDrink}" class="cocktail-item">
              <h3>${cocktail.strDrink}</h3>
              <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" />
              <p><strong>Category:</strong> ${cocktail.strCategory}</p>
              <p><strong>Glass:</strong> ${cocktail.strGlass}</p>
              <p><strong>Alcoholic:</strong> ${cocktail.strAlcoholic}</p>
              <p><strong>Ingredients:</strong></p>
              ${ingredientsHtml}
              <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>

              <!-- Add/Remove Drink Buttons -->
              <button onclick="addToMyList(${cocktail.idDrink}, '${cocktail.strDrink}')">Add to My List</button>
              <button onclick="removeFromMyList(${cocktail.idDrink})">Remove from My List</button>

              <!-- Review Form -->
              <form class="review-form" onsubmit="submitReview(event, ${cocktail.idDrink}, '${cocktail.strDrink}')">
                <label for="rating-${cocktail.idDrink}">Rating (1-5):</label>
                <input type="number" min="1" max="5" id="rating-${cocktail.idDrink}" required />

                <textarea id="reviewText-${cocktail.idDrink}" placeholder="Write your review..." required></textarea>
                
                <button type="submit" class="btn">Submit Review</button>
              </form>

              <!-- Collapsible Trigger for Reviews -->
              <ul class="collapsible">
                <li>
                  <div class="collapsible-header">
                    <!-- Replaced <a> with <button> to prevent scrolling -->
                    <button class="btn blue" onclick="fetchReviews(${cocktail.idDrink})">View Reviews</button>
                  </div>
                  <div class="collapsible-body">
                    <div id="reviews-${cocktail.idDrink}">
                      <p>Click "View Reviews" to see the reviews.</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          `;
        });

        const collapsibleElems = document.querySelectorAll(".collapsible");
        M.Collapsible.init(collapsibleElems);
      })
      .catch((error) => console.error("Error fetching cocktails:", error));
  } else {
    console.log("No ingredients selected, skipping search.");
  }
}

// Function to fetch reviews for a drink
function fetchReviews(idDrink) {
  fetch(`/getReviews/${idDrink}`)
    .then((response) => response.json())
    .then((reviews) => {
      const reviewsDiv = document.getElementById(`reviews-${idDrink}`);
      if (reviews.length > 0) {
        reviewsDiv.innerHTML = reviews
          .map(
            (review) => `
              <div>
                <strong>${review.username}</strong> rated ${review.rating}/5
                <p>${review.reviewText}</p>
              </div>
            `
          )
          .join("");
      } else {
        reviewsDiv.innerHTML =
          "<p>No reviews yet. Be the first to add one!</p>";
      }
    })
    .catch((error) => console.error("Error fetching reviews:", error));
}

// Helper function to render the ingredients list
function renderIngredients(cocktail) {
  let ingredientsHtml = "";
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`];
    const measure = cocktail[`strMeasure${i}`];
    if (ingredient) {
      ingredientsHtml += `<p>${measure ? measure : ""} ${ingredient}</p>`;
    }
  }
  return ingredientsHtml;
}

// Submit a review for a drink
function submitReview(event, idDrink, strDrink) {
  event.preventDefault();

  // Check if the user has already written a review for this drink
  fetch(`/getReviews/${idDrink}`)
    .then((response) => response.json())
    .then((reviews) => {
      const userHasReviewed = reviews.some(
        (review) => review.username === currentUser
      );

      if (userHasReviewed) {
        alert("You have already written a review for this drink.");
        return;
      } else {
        const rating = document.getElementById(`rating-${idDrink}`).value;
        const reviewText = document.getElementById(
          `reviewText-${idDrink}`
        ).value;

        // Validate rating input
        if (rating < 1 || rating > 5) {
          alert("Please enter a rating between 1 and 5.");
          return;
        }

        // Post the review to the backend
        fetch("/addReview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idDrink, strDrink, rating, reviewText }),
        })
          .then((response) => response.json())
          .then((data) => {
            alert(data.message);
            fetchReviews(idDrink);
          })
          .catch((error) => console.error("Error submitting review:", error));
      }
    })
    .catch((error) => console.error("Error fetching reviews:", error));
}

// Edit a review
function editReview(reviewId) {
  const newRating = prompt("Enter new rating (1-5):");
  const newReviewText = prompt("Enter new review:");

  fetch("/editReview", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reviewId,
      rating: newRating,
      reviewText: newReviewText,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      // Refresh reviews after editing
      fetchReviews(idDrink);
    })
    .catch((error) => console.error("Error editing review:", error));
}

// Delete a review
function deleteReview(reviewId) {
  if (confirm("Are you sure you want to delete this review?")) {
    fetch("/deleteReview", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        // Refresh reviews after deleting
        fetchReviews(idDrink);
      })
      .catch((error) => console.error("Error deleting review:", error));
  }
}

// Add drink to user's list
function addToMyList(idDrink, strDrink) {
  // Fetch the user's drinks to check if the drink already exists in their list
  fetch("/getMyDrinks")
    .then((response) => response.json())
    .then((drinks) => {
      const isAlreadyAdded = drinks.some((drink) => drink.idDrink === idDrink);

      if (isAlreadyAdded) {
        alert("This drink is already in your list.");
      } else {
        // If not already added, proceed to add the drink
        fetch("/addDrink", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idDrink, strDrink }),
        })
          .then((response) => response.json())
          .then((data) => alert(data.message))
          .catch((error) => console.error("Error adding drink:", error));
      }
    })
    .catch((error) => console.error("Error fetching user's drinks:", error));
}

// Remove drink from user's list
function removeFromMyList(idDrink) {
  fetch("/removeDrink", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idDrink }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      // Optionally remove the drink element from the page
      const drinkElement = document.getElementById(`drink-${idDrink}`);
      if (drinkElement) drinkElement.remove();
    })
    .catch((error) => console.error("Error removing drink:", error));
}

document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll(".dropdown-trigger");
  M.Dropdown.init(elems, { hover: true });
});
