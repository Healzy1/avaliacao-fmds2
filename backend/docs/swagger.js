import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Filmes',
      version: '1.0.0',
      description: 'API para gerenciar uma coleção de filmes',
    },
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos com anotações Swagger
};

const swaggerSpec = swaggerJSDoc(options);

export default (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}