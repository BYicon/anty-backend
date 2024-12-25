import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 8043;
  await app.listen(port);
  console.log(`Server is running on port 🚀🚀🚀 http://localhost:${port}`);
}
bootstrap();
