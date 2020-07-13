import passportLocalMongoose from 'passport-local-mongoose';

export class BaseRepository {
    constructor(requestSchema, db, collection) {
        delete db.connection.models[collection];
        const mongoSchema = new db.Schema(requestSchema, { timestamps: true });
        mongoSchema.plugin(passportLocalMongoose);
        this.model = db.model(collection, mongoSchema);
    }
}
