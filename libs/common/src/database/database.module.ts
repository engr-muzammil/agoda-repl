import { Module } from '@nestjs/common';
import { 
    ConfigService, 
    ConfigModule as NestConfigModule 
} from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose'

@Module({
    imports: [
        MongooseModule.forRootAsync({
        imports: [NestConfigModule.forRoot()],
        useFactory: (configService: ConfigService) => ({
            uri: configService.get('MONGODB_URI'),
        }),
        inject: [ConfigService],
    })],
})
export class DatabaseModule {
    static forFeature(models: ModelDefinition[]) {
        return MongooseModule.forFeature(models);
    }
}
