import mongoose from "mongoose";

const saveSearchSchema  = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        address:{
            type: String,
            required: true,
        },
        furnished:{
            type: Boolean,
            required: true,
        },
        parking:{
            type: Boolean,
            required: true,
        },
        type:{
            type: String,
            required: true,
        },
        offer:{
            type:Boolean,
            required: true,
        },
        userRef:{
            type:String,
            required: true,
        },

    }, {timestamps: true}
)

const SaveSearch = mongoose.model('SaveSearch', saveSearchSchema);

export default SaveSearch;