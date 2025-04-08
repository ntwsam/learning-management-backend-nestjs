import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit,OnModuleDestroy{
    private readonly client: Redis
    
    constructor(){
        this.client = new Redis({
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD,
            port: parseInt(process.env.REDIS_PORT!),
            db: 1
        })
    }

    async onModuleInit() {
        await this.client.on('connect',() => console.log('Redis connected'))
        await this.client.on('error',(err) => (console.error('Redis error:',err)
        ))
    }

    async set(key: string, value: string, ttlSecond: number):Promise<void>{
        await this.client.set(key, value, 'EX' , ttlSecond);
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key)
    }

    async del(key: string): Promise<void> {
        await this.client.del(key)
    }

    async exists(key: string): Promise<boolean>{
        const result = await this.client.exists(key)
        return result === 1
    }

    async onModuleDestroy(){
        await this.client.quit()
    }
}

