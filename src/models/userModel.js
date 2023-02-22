import mongoose from "mongoose";
import bcrypt from 'bcrypt';


const SALT_WORK_FACTOR = 5;

const Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    cart_id: {
      type: String,
      ref: "cart"
    }
});

// Schema.pre("save", function (next) {
//     const user = this
  
//     if (this.isModified("password") || this.isNew) {
//       bcrypt.genSalt(SALT_WORK_FACTOR, function (saltError, salt) {
//         if (saltError) {
//           return next(saltError)
//         } else {
//           bcrypt.hash(user.password, salt, function(hashError, hash) {
//             if (hashError) {
//               return next(hashError)
//             }
  
//             user.password = hash
//             next()
//           })
//         }
//       })
//     } else {
//       return next()
//     }
//   })
  
// Schema.methods.comparePassword = async function(password) {
//     const valid = await bcrypt.compare(password, this.password)
//     return valid;
// }

const conn = mongoose.createConnection("mongodb+srv://sasha:coder.sasha@cluster0.ezluz.mongodb.net/userList?retryWrites=true&w=majority");

export const UsersModel = conn.model("user", Schema);
