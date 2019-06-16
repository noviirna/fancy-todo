const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    title: String,
    description : String,
    status: String,
    targetdate: Date,
    project : {
      type: Schema.Types.ObjectId,
      ref: "Project"
    }
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", TodoSchema);
module.exports = Todo;
