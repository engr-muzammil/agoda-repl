import { Logger, NotFoundException } from "@nestjs/common";
import { AbstractDocument } from "./abstract.schema";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    protected abstract readonly logger: Logger;
    constructor(protected readonly model: Model<TDocument>) {}
    
    async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
        const createdDocument = new this.model({
                ...document, 
                _id: new Types.ObjectId(),
        });
        return (await createdDocument.save()).toJSON() as unknown as TDocument;
    }
    async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
        const document = await this.model.findOne(filterQuery).lean<TDocument>(true)
        if (!document) {
            this.logger.error(`Document not found for query: ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException('Document not found');
        }
        return document as TDocument;
    }
    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
    ): Promise<TDocument> {
        const document = await this.model.findOneAndUpdate(filterQuery, update, {
            new: true,
        }).lean<TDocument>(true);
        if (!document) {
            this.logger.error(`Document not found for query: ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException('Document not found');
        }
        return document as TDocument;
    }
    async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
        const document = await this.model.find(filterQuery).lean<TDocument[]>(true)
        if (!document) {
            this.logger.error(`Document not found for query: ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException('Document not found');
        }
        return document as TDocument[];
    }
    async findByIdAndDelete(
        filterQuery: FilterQuery<TDocument>
    ): Promise<TDocument> {
        const document = await this.model.findByIdAndDelete(filterQuery).lean<TDocument>(true);
        if (!document) {
            this.logger.error(`Document not found for query: ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException('Document not found');
        }
        return document as TDocument;
    }
}