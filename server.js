const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
const port = 3000;

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://azzhang3:eGPDbrMNzogUpygL@cluster0.iuxm8.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  googleId: { type: String, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  email: { type: String },
  profilePhoto: { type: String },
  drinksList: [{ idDrink: Number, strDrink: String }],
});

const User = mongoose.model("User", userSchema);

// Define the Cocktail schema directly here
const cocktailSchema = new mongoose.Schema(
  {
    idDrink: { type: Number, required: true },
    strDrink: { type: String, required: true },
    strDrinkAlternate: { type: String },
    strTags: { type: String },
    strVideo: { type: String },
    strCategory: { type: String },
    strIBA: { type: String },
    strAlcoholic: { type: String },
    strGlass: { type: String },
    strInstructions: { type: String },
    strIngredient1: { type: String },
    strIngredient2: { type: String },
    strIngredient3: { type: String },
    strIngredient4: { type: String },
    strIngredient5: { type: String },
    strIngredient6: { type: String },
    strIngredient7: { type: String },
    strIngredient8: { type: String },
    strIngredient9: { type: String },
    strIngredient10: { type: String },
    strIngredient11: { type: String },
    strIngredient12: { type: String },
    strIngredient13: { type: String },
    strIngredient14: { type: String },
    strIngredient15: { type: String },
    strMeasure1: { type: String },
    strMeasure2: { type: String },
    strMeasure3: { type: String },
    strMeasure4: { type: String },
    strMeasure5: { type: String },
    strMeasure6: { type: String },
    strMeasure7: { type: String },
    strMeasure8: { type: String },
    strMeasure9: { type: String },
    strMeasure10: { type: String },
    strMeasure11: { type: String },
    strMeasure12: { type: String },
    strMeasure13: { type: String },
    strMeasure14: { type: String },
    strMeasure15: { type: String },
    strImageSource: { type: String },
    strImageAttribution: { type: String },
    strCreativeCommonsConfirmed: { type: String },
    dateModified: { type: String },
  },
  { collection: "Cocktails" }
);

// Create the Cocktail model
const Cocktail = mongoose.model("Cocktail", cocktailSchema);

// Define Review schema
const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  idDrink: { type: Number, required: true },
  strDrink: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Session middleware setup
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Passport Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: "your-client-id",
      clientSecret: "your-client-secret",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const email =
        profile.emails && profile.emails.length > 0
          ? profile.emails[0].value
          : null;

      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
          return done(null, existingUser);
        } else {
          new User({
            username: profile.displayName,
            googleId: profile.id,
            profilePhoto: profile.photos[0].value,
            email: email,
          })
            .save()
            .then((newUser) => {
              return done(null, newUser);
            });
        }
      });
    }
  )
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }
  res.sendFile(path.join(__dirname, "public/home.html"));
});

app.get("/home", isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "public/home.html"));
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    req.session.username = req.user.username;
    res.redirect("/home");
  }
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

app.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/home");
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

// Send the logged-in user's info
app.get("/getCurrentUser", isLoggedIn, (req, res) => {
  res.json({ username: req.user.username });
});

app.get("/allCocktails", (req, res) => {
  Cocktail.find({})
    .then((cocktails) => {
      console.log("Cocktails retrieved:", cocktails);
      res.json(cocktails);
    })
    .catch((err) => {
      console.error("Error retrieving cocktails:", err);
      res.status(500).json({ error: "Error retrieving cocktails" });
    });
});

app.post("/searchCocktails", async (req, res) => {
  const { ingredient1, ingredient2, ingredient3 } = req.body;

  console.log("Received ingredients:", ingredient1, ingredient2, ingredient3);

  // Create an array of ingredients (filter out any empty ones)
  const ingredients = [ingredient1, ingredient2, ingredient3].filter(Boolean);

  // Build the query for each ingredient
  const ingredientQuery = ingredients.map((ingredient) => {
    return {
      $or: [
        { strIngredient1: { $regex: ingredient, $options: "i" } },
        { strIngredient2: { $regex: ingredient, $options: "i" } },
        { strIngredient3: { $regex: ingredient, $options: "i" } },
        { strIngredient4: { $regex: ingredient, $options: "i" } },
        { strIngredient5: { $regex: ingredient, $options: "i" } },
        { strIngredient6: { $regex: ingredient, $options: "i" } },
        { strIngredient7: { $regex: ingredient, $options: "i" } },
        { strIngredient8: { $regex: ingredient, $options: "i" } },
        { strIngredient9: { $regex: ingredient, $options: "i" } },
        { strIngredient10: { $regex: ingredient, $options: "i" } },
        { strIngredient11: { $regex: ingredient, $options: "i" } },
        { strIngredient12: { $regex: ingredient, $options: "i" } },
        { strIngredient13: { $regex: ingredient, $options: "i" } },
        { strIngredient14: { $regex: ingredient, $options: "i" } },
        { strIngredient15: { $regex: ingredient, $options: "i" } },
      ],
    };
  });

  try {
    // Find cocktails that match all the provided ingredients
    const cocktails = await Cocktail.find({
      $and: ingredientQuery,
    });
    console.log(`Found ${cocktails.length} cocktails`);

    res.json(cocktails);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cocktails", error: err });
  }

  console.log("Ingredient Query:", JSON.stringify(ingredientQuery, null, 2));
});

// Add a drink to the user's list
app.post("/addDrink", isLoggedIn, async (req, res) => {
  const { idDrink, strDrink } = req.body;
  try {
    const user = await User.ffById(req.user._id);
    user.drinksList.push({ idDrink, strDrink });
    await user.save();
    res.json({ message: "Drink added to your list!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding drink", error });
  }
});

// Remove a drink from the user's list
app.post("/removeDrink", isLoggedIn, async (req, res) => {
  const { idDrink } = req.body;
  try {
    const user = await User.findById(req.user._id);
    user.drinksList = user.drinksList.filter(
      (drink) => drink.idDrink !== idDrink
    );
    await user.save();
    res.json({ message: "Drink removed from your list!" });
  } catch (error) {
    res.status(500).json({ message: "Error removing drink", error });
  }
});

// Get all drinks in the user's list
app.get("/getMyDrinks", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.drinksList);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving drinks list", error });
  }
});

// Add a review for a drink
app.post("/addReview", isLoggedIn, async (req, res) => {
  const { idDrink, strDrink, rating, reviewText } = req.body;
  try {
    const newReview = new Review({
      username: req.user.username,
      idDrink,
      strDrink,
      rating,
      reviewText,
    });
    await newReview.save();
    res.json({ message: "Review added!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error });
  }
});

// Edit a review
app.put("/editReview", isLoggedIn, async (req, res) => {
  const { reviewId, rating, reviewText } = req.body;

  if (rating < 1 || rating > 5 || isNaN(rating)) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Ensure the user editing the review is the one who wrote it
    if (review.username !== req.user.username) {
      return res
        .status(403)
        .json({ message: "You can only edit your own reviews" });
    }

    review.rating = rating;
    review.reviewText = reviewText;
    await review.save();

    res.json({ message: "Review updated successfully" });
  } catch (error) {
    console.error("Error editing review:", error);
    res.status(500).json({ message: "Error editing review", error });
  }
});

// Delete a review
app.delete("/deleteReview", isLoggedIn, async (req, res) => {
  const { reviewId } = req.body;

  try {
    // Log the entire request body and the reviewId to check if it's being passed correctly
    console.log("Received request to delete review:", req.body);

    if (!reviewId) {
      console.error("Review ID is missing in the request");
      return res.status(400).json({ message: "Review ID is required" });
    }

    // Log before attempting to find the review
    console.log("Finding review with ID:", reviewId);
    const review = await Review.findById(reviewId);

    if (!review) {
      console.error("Review not found with ID:", reviewId);
      return res.status(404).json({ message: "Review not found" });
    }

    // Log the user and the review author to ensure we're comparing correctly
    console.log(
      "Review found. Review author:",
      review.username,
      "Current user:",
      req.user.username
    );

    // Ensure the user deleting the review is the one who wrote it
    if (review.username !== req.user.username) {
      console.error(
        "Unauthorized attempt to delete review by:",
        req.user.username
      );
      return res
        .status(403)
        .json({ message: "You can only delete your own reviews" });
    }

    // Log before deletion
    console.log("Deleting review with ID:", reviewId);
    await Review.findByIdAndDelete(reviewId);

    // Log success
    console.log("Review deleted successfully with ID:", reviewId);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    // Log the specific error and return it in the response for debugging
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review", error });
  }
});

// Get all reviews for a drink
app.get("/getReviews/:idDrink", async (req, res) => {
  try {
    const reviews = await Review.find({ idDrink: req.params.idDrink });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reviews", error });
  }
});

// Get all reviews by the logged-in user
app.get("/getMyReviews", isLoggedIn, async (req, res) => {
  try {
    const reviews = await Review.find({ username: req.user.username });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reviews", error });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
const port = 3000;

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://azzhang3:eGPDbrMNzogUpygL@cluster0.iuxm8.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  googleId: { type: String, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  email: { type: String },
  profilePhoto: { type: String },
  drinksList: [{ idDrink: Number, strDrink: String }],
});

const User = mongoose.model("User", userSchema);

// Define the Cocktail schema directly here
const cocktailSchema = new mongoose.Schema(
  {
    idDrink: { type: Number, required: true },
    strDrink: { type: String, required: true },
    strDrinkAlternate: { type: String },
    strTags: { type: String },
    strVideo: { type: String },
    strCategory: { type: String },
    strIBA: { type: String },
    strAlcoholic: { type: String },
    strGlass: { type: String },
    strInstructions: { type: String },
    strIngredient1: { type: String },
    strIngredient2: { type: String },
    strIngredient3: { type: String },
    strIngredient4: { type: String },
    strIngredient5: { type: String },
    strIngredient6: { type: String },
    strIngredient7: { type: String },
    strIngredient8: { type: String },
    strIngredient9: { type: String },
    strIngredient10: { type: String },
    strIngredient11: { type: String },
    strIngredient12: { type: String },
    strIngredient13: { type: String },
    strIngredient14: { type: String },
    strIngredient15: { type: String },
    strMeasure1: { type: String },
    strMeasure2: { type: String },
    strMeasure3: { type: String },
    strMeasure4: { type: String },
    strMeasure5: { type: String },
    strMeasure6: { type: String },
    strMeasure7: { type: String },
    strMeasure8: { type: String },
    strMeasure9: { type: String },
    strMeasure10: { type: String },
    strMeasure11: { type: String },
    strMeasure12: { type: String },
    strMeasure13: { type: String },
    strMeasure14: { type: String },
    strMeasure15: { type: String },
    strImageSource: { type: String },
    strImageAttribution: { type: String },
    strCreativeCommonsConfirmed: { type: String },
    dateModified: { type: String },
  },
  { collection: "Cocktails" }
);

// Create the Cocktail model
const Cocktail = mongoose.model("Cocktail", cocktailSchema);

// Define Review schema
const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  idDrink: { type: Number, required: true },
  strDrink: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Session middleware setup
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Passport Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: "your-client-id",
      clientSecret: "your-client-secret",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const email =
        profile.emails && profile.emails.length > 0
          ? profile.emails[0].value
          : null;

      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
          return done(null, existingUser);
        } else {
          new User({
            username: profile.displayName,
            googleId: profile.id,
            profilePhoto: profile.photos[0].value,
            email: email,
          })
            .save()
            .then((newUser) => {
              return done(null, newUser);
            });
        }
      });
    }
  )
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }
  res.sendFile(path.join(__dirname, "public/home.html"));
});

app.get("/home", isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "public/home.html"));
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    req.session.username = req.user.username;
    res.redirect("/home");
  }
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

app.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/home");
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

// Send the logged-in user's info
app.get("/getCurrentUser", isLoggedIn, (req, res) => {
  res.json({ username: req.user.username });
});

app.get("/allCocktails", (req, res) => {
  Cocktail.find({})
    .then((cocktails) => {
      console.log("Cocktails retrieved:", cocktails);
      res.json(cocktails);
    })
    .catch((err) => {
      console.error("Error retrieving cocktails:", err);
      res.status(500).json({ error: "Error retrieving cocktails" });
    });
});

app.post("/searchCocktails", async (req, res) => {
  const { ingredient1, ingredient2, ingredient3 } = req.body;

  console.log("Received ingredients:", ingredient1, ingredient2, ingredient3);

  // Create an array of ingredients (filter out any empty ones)
  const ingredients = [ingredient1, ingredient2, ingredient3].filter(Boolean);

  // Build the query for each ingredient
  const ingredientQuery = ingredients.map((ingredient) => {
    return {
      $or: [
        { strIngredient1: { $regex: ingredient, $options: "i" } },
        { strIngredient2: { $regex: ingredient, $options: "i" } },
        { strIngredient3: { $regex: ingredient, $options: "i" } },
        { strIngredient4: { $regex: ingredient, $options: "i" } },
        { strIngredient5: { $regex: ingredient, $options: "i" } },
        { strIngredient6: { $regex: ingredient, $options: "i" } },
        { strIngredient7: { $regex: ingredient, $options: "i" } },
        { strIngredient8: { $regex: ingredient, $options: "i" } },
        { strIngredient9: { $regex: ingredient, $options: "i" } },
        { strIngredient10: { $regex: ingredient, $options: "i" } },
        { strIngredient11: { $regex: ingredient, $options: "i" } },
        { strIngredient12: { $regex: ingredient, $options: "i" } },
        { strIngredient13: { $regex: ingredient, $options: "i" } },
        { strIngredient14: { $regex: ingredient, $options: "i" } },
        { strIngredient15: { $regex: ingredient, $options: "i" } },
      ],
    };
  });

  try {
    // Find cocktails that match all the provided ingredients
    const cocktails = await Cocktail.find({
      $and: ingredientQuery,
    });
    console.log(`Found ${cocktails.length} cocktails`);

    res.json(cocktails);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cocktails", error: err });
  }

  console.log("Ingredient Query:", JSON.stringify(ingredientQuery, null, 2));
});

// Add a drink to the user's list
app.post("/addDrink", isLoggedIn, async (req, res) => {
  const { idDrink, strDrink } = req.body;
  try {
    const user = await User.ffById(req.user._id);
    user.drinksList.push({ idDrink, strDrink });
    await user.save();
    res.json({ message: "Drink added to your list!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding drink", error });
  }
});

// Remove a drink from the user's list
app.post("/removeDrink", isLoggedIn, async (req, res) => {
  const { idDrink } = req.body;
  try {
    const user = await User.findById(req.user._id);
    user.drinksList = user.drinksList.filter(
      (drink) => drink.idDrink !== idDrink
    );
    await user.save();
    res.json({ message: "Drink removed from your list!" });
  } catch (error) {
    res.status(500).json({ message: "Error removing drink", error });
  }
});

// Get all drinks in the user's list
app.get("/getMyDrinks", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.drinksList);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving drinks list", error });
  }
});

// Add a review for a drink
app.post("/addReview", isLoggedIn, async (req, res) => {
  const { idDrink, strDrink, rating, reviewText } = req.body;
  try {
    const newReview = new Review({
      username: req.user.username,
      idDrink,
      strDrink,
      rating,
      reviewText,
    });
    await newReview.save();
    res.json({ message: "Review added!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error });
  }
});

// Edit a review
app.put("/editReview", isLoggedIn, async (req, res) => {
  const { reviewId, rating, reviewText } = req.body;

  if (rating < 1 || rating > 5 || isNaN(rating)) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Ensure the user editing the review is the one who wrote it
    if (review.username !== req.user.username) {
      return res
        .status(403)
        .json({ message: "You can only edit your own reviews" });
    }

    review.rating = rating;
    review.reviewText = reviewText;
    await review.save();

    res.json({ message: "Review updated successfully" });
  } catch (error) {
    console.error("Error editing review:", error);
    res.status(500).json({ message: "Error editing review", error });
  }
});

// Delete a review
app.delete("/deleteReview", isLoggedIn, async (req, res) => {
  const { reviewId } = req.body;

  try {
    // Log the entire request body and the reviewId to check if it's being passed correctly
    console.log("Received request to delete review:", req.body);

    if (!reviewId) {
      console.error("Review ID is missing in the request");
      return res.status(400).json({ message: "Review ID is required" });
    }

    // Log before attempting to find the review
    console.log("Finding review with ID:", reviewId);
    const review = await Review.findById(reviewId);

    if (!review) {
      console.error("Review not found with ID:", reviewId);
      return res.status(404).json({ message: "Review not found" });
    }

    // Log the user and the review author to ensure we're comparing correctly
    console.log(
      "Review found. Review author:",
      review.username,
      "Current user:",
      req.user.username
    );

    // Ensure the user deleting the review is the one who wrote it
    if (review.username !== req.user.username) {
      console.error(
        "Unauthorized attempt to delete review by:",
        req.user.username
      );
      return res
        .status(403)
        .json({ message: "You can only delete your own reviews" });
    }

    // Log before deletion
    console.log("Deleting review with ID:", reviewId);
    await Review.findByIdAndDelete(reviewId);

    // Log success
    console.log("Review deleted successfully with ID:", reviewId);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    // Log the specific error and return it in the response for debugging
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review", error });
  }
});

// Get all reviews for a drink
app.get("/getReviews/:idDrink", async (req, res) => {
  try {
    const reviews = await Review.find({ idDrink: req.params.idDrink });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reviews", error });
  }
});

// Get all reviews by the logged-in user
app.get("/getMyReviews", isLoggedIn, async (req, res) => {
  try {
    const reviews = await Review.find({ username: req.user.username });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reviews", error });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
