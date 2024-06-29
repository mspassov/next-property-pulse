import {Schema, model, models} from 'mongoose';

const UserSchema = new Schema({
    email:{
        type: String,
        unique: [true, 'Email already exists'],
        required: true
    },
    username:{
        type: String,
        required: true
    },
    image: {
        type: String
    },
    bookmarks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Property" //this is the model from which this ID is coming from
        }
    ]
}, {
    timestamps: true
});

const User = models.User || model('User', UserSchema);

export default User;