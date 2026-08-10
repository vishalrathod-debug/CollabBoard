const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ==============================
// 🔥 USER SCHEMA
// ==============================
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // 🔥 never return password
    },

    avatar: {
      type: String,
      default: "https://via.placeholder.com/150",
    },

    bio: {
      type: String,
      default: "",
      maxlength: [200, "Bio cannot exceed 200 characters"],
    },

    // ==============================
    // 🎨 USER PREFERENCES
    // ==============================
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },

      defaultBackground: {
        type: String,
        default: "#ffffff",
      },

      defaultPenColor: {
        type: String,
        default: "#000000",
      },
    },

    // ==============================
    // 🔐 ACCOUNT FLAGS
    // ==============================
    isVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ==============================
// 🔐 HASH PASSWORD BEFORE SAVE
// ==============================
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err; // let mongoose handle error
  }
});

// ==============================
// 🔐 COMPARE PASSWORD
// ==============================
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ==============================
// 🔥 REMOVE SENSITIVE DATA
// ==============================
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);