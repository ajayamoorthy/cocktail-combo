const express = require( 'express' ),
      port = 3000;

const app = express();
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(
  "mongodb+srv://azzhang3:eGPDbrMNzogUpygL@cluster0.iuxm8.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

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
});

const User = mongoose.model("User", userSchema);

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
  res.sendFile(path.join(__dirname, "public/index.html"));
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

// Cocktail schema and model
const cocktailSchema = new mongoose.Schema({
  idDrink: Number,
  strDrink: String,
  strDrinkAlternate: String,
  strTags: String,
  strVideo: String,
  strCategory: String,
  strIBA: String,
  strAlcoholic: String,
  strGlass: String,
  strInstructions: String,
  strInstructionsES: String,
  strInstructionsDE: String,
  strInstructionsFR: String,
  strInstructionsIT: String,
  strInstructionsZH_HANS: String,
  strInstructionsZH_HANT: String,
  strDrinkThumb: String,
  strIngredient1: String,
  strIngredient2: String,
  strIngredient3: String,
  strIngredient4: String,
  strIngredient5: String,
  strIngredient6: String,
  strIngredient7: String,
  strIngredient8: String,
  strIngredient9: String,
  strIngredient10: String,
  strIngredient11: String,
  strIngredient12: String,
  strIngredient13: String,
  strIngredient14: String,
  strIngredient15: String,
  strMeasure1: String,
  strMeasure2: String,
  strMeasure3: String,
  strMeasure4: String,
  strMeasure5: String,
  strMeasure6: String,
  strMeasure7: String,
  strMeasure8: String,
  strMeasure9: String,
  strMeasure10: String,
  strMeasure11: String,
  strMeasure12: String,
  strMeasure13: String,
  strMeasure14: String,
  strMeasure15: String,
  strImageSource: String,
  strImageAttribution: String,
  strCreativeCommonsConfirmed: String,
  dateModified: String,
});

const Cocktail = mongoose.model("Cocktails", cocktailSchema);

module.exports = Cocktail;

// API to get all cocktails
app.get("/api/cocktails", async (req, res) => {
  try {
    const cocktails = await Cocktail.find();

    const formattedCocktails = cocktails.map((cocktail) => {
      const ingredients = [];
      for (let i = 1; i <= 5; i++) {
        // Adjust based on how many ingredients you expect
        if (cocktail[`strIngredient${i}`]) {
          ingredients.push(
            `${cocktail[`strMeasure${i}`] || ""} ${
              cocktail[`strIngredient${i}`]
            }`.trim()
          );
        }
      }

      return {
        idDrink: cocktail.idDrink,
        name: cocktail.strDrink,
        instructions: cocktail.strInstructions,
        ingredients: ingredients,
        image: cocktail.strDrinkThumb,
      };
    });

    res.json(formattedCocktails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to get cocktail by name
app.get("/api/cocktails/:name", async (req, res) => {
  try {
    const cocktail = await Cocktail.findOne({ name: req.params.name });
    if (cocktail) {
      res.json(cocktail);
    } else {
      res.status(404).json({ error: "Cocktail not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to get unique ingredients
app.get("/api/ingredients", async (req, res) => {
  try {
    const ingredients = await Cocktail.distinct("ingredients");
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to search cocktails by ingredients
app.get("/api/cocktails", async (req, res) => {
  const ingredients = req.query.ingredients.split(",");
  try {
    const cocktails = await Cocktail.find({
      ingredients: { $in: ingredients },
    });
    res.json(cocktails);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    console.log(`Cocktail Combo listening on port ${port}`);
})