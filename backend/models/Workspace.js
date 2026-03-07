import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: {
    type: String,
    enum: ["owner", "admin", "member"],
    default: "member",
  },
  joinedAt: { type: Date, default: Date.now },
});

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Workspace name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    color: {
      type: String,
      default: "#6366f1",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [memberSchema],
    inviteCode: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// Auto-add owner as a member with "owner" role
workspaceSchema.pre("save", function (next) {
  if (this.isNew) {
    const alreadyMember = this.members.some(
      (m) => m.user.toString() === this.owner.toString()
    );
    if (!alreadyMember) {
      this.members.push({ user: this.owner, role: "owner" });
    }
    // generate a simple invite code
    this.inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  next();
});

const Workspace = mongoose.model("Workspace", workspaceSchema);
export default Workspace;
