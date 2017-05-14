import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { BaseModel } from 'meteor/socialize:base-model';
import { LinkableModel } from 'meteor/socialize:linkable-model';
import SimpleSchema from 'simpl-schema';

export const LikesCollection = new Mongo.Collection("likes");

const LikeSchema = new SimpleSchema({
    "userId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        autoValue:function () {
            if(this.isInsert){
                return this.userId;
            }
        },
        denyUpdate:true
    },
    "date":{
        type:Date,
        autoValue:function() {
            if(this.isInsert){
                return new Date();
            }
        },
        denyUpdate:true
    }
});

/**
 * A model of a like which is connected to another database object
 * @class Like
 */
export class Like extends LinkableModel {
    constructor(document) {
        super(document)
    }
    /**
     * Get the User instance of the account which created the like
     * @returns {User} The user who created the like
     */
    user() {
        return Meteor.users.findOne(this.userId);
    }
    /**
     * Check if the user has already liked the linked object
     * @returns {[[Type]]} [[Description]]
     */
    isDuplicate() {
        return !!LikesCollection.findOne({userId:this.userId, linkedObjectId:this.linkedObjectId});
    }
}

//attach the schema for a like
LikesCollection.attachSchema(LikeSchema);

//attach the LikesCollection to the Like model via BaseModel's attchCollection method
Like.attachCollection(LikesCollection)

//append the linkable schema so we are able to add linking information
Like.appendSchema(LinkableModel.LinkableSchema);