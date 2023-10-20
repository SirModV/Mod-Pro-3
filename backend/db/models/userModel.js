const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [20, "Name cannot exceed 20 characters"],
    minLength: [3, "Name should have atleast 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  description: {
    type: String,
    required: [true, "Please Enter Your Description"],
    maxLength: [2000, "Description cannot exceed 2000 characters"],
    minLength: [20, "Description should have atleast 20 characters"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be atleast 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  offeringSkills: [
    {
      title: {
        type: String,
        required: [true, "Please Enter Skill Title"],
        maxLength: [20, "Skill Title cannot exceed 20 characters"],
        minLength: [3, "Skill Title should have atleast 3 characters"],
      },
      experience: {
        type: String,
        required: [true, "Please Enter Skill Experience"],
      },
      workLevel: {
        type: String,
        required: [true, "Please Enter Skill Work Level"],
      },
    },
  ],
  seekingSkills: [
    {
      title: {
        type: String,
        required: [true, "Please Enter Skill Title"],
        maxLength: [20, "Skill Title cannot exceed 20 characters"],
        minLength: [3, "Skill Title should have atleast 3 characters"],
      },
      experience: {
        type: String,
        required: [true, "Please Enter Skill Experience"],
      },
      workLevel: {
        type: String,
        required: [true, "Please Enter Skill Work Level"],
      },
    },
  ],
  exchangeSkills: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      title: {
        type: String,
        required: [true, "Please Enter Skill Title"],
      },
      description: {
        type: String,
        required: [true, "Please Enter Skill Description"],
      },
      identity: {
        type: String,
        required: [true, "Please Enter Skill Identity"],
        unique: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  exchangeRequests: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      title: {
        type: String,
        required: [true, "Please Enter Skill Title"],
      },
      description: {
        type: String,
        required: [true, "Please Enter Skill Description"],
      },
      status: {
        type: String,
        required: [true, "Please Enter Skill Status"],
      },
      identity: {
        type: String,
        required: [true, "Please Enter Skill Identity"],
        unique: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  exchangeReqNum: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);