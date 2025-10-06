import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/exceptions';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true,
  });

  // Apply validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Apply global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('UNIDOC REQUEST SYSTEM API')
    .setDescription('API documentation for the UNIDOC REQUEST SYSTEM')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // app.use(
  //   bodyParser.raw({
  //     type: 'application/json',
  //   }),
  // );

  await app.listen(process.env.PORT ?? 7000);
  console.log('🚀 Server running on http://localhost:7000');
  console.log('📚 Swagger UI: http://localhost:7000/api/docs');
}
bootstrap();
