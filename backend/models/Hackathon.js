const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HackathonSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true }, // For backward compatibility
    description: { type: String, required: true },
    date: { type: String, required: true }, // Consider changing to Date later
    startDate: { type: Date },
    endDate: { type: Date },
    location: { type: String, trim: true, default: "Virtual" },
    prizePool: { type: String, trim: true },
    maxParticipants: { type: Number, min: 1 },
    registrationDeadline: { type: Date },
    status: {
      type: String,
      enum: [
        "upcoming",
        "registration-open",
        "in-progress",
        "completed",
        "cancelled",
      ],
      default: "upcoming",
    },
    themes: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    rules: [{ type: String, trim: true }],
    resources: [
      {
        title: { type: String, trim: true },
        url: { type: String, trim: true },
        type: { type: String, enum: ["document", "video", "link", "image"] },
      },
    ],
    organiser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    judges: [{ type: Schema.Types.ObjectId, ref: "User" }],
    sponsors: [
      {
        name: { type: String, trim: true },
        logo: { type: String, trim: true },
        website: { type: String, trim: true },
      },
    ],
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    teams: [
      {
        name: { type: String, trim: true },
        members: [{ type: Schema.Types.ObjectId, ref: "User" }],
        leader: { type: Schema.Types.ObjectId, ref: "User" },
        projectName: { type: String, trim: true },
        projectDescription: { type: String },
        repositoryUrl: { type: String, trim: true },
        presentationUrl: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hackathon", HackathonSchema);
