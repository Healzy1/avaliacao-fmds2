import express from 'express'
import cors from 'cors'
import filmesRoutes from './routes/filmes.js' // Importa o arquivo de rotas
import swagger from './docs/swagger.js';

const app = express()
const port = process.env.PORT || 3000

// --- Middlewares ---
app.use(express.json())
app.use(cors())

// --- Rotas ---
// Tudo que chegar em /filmes será tratado pelo arquivo de rotas
app.use('/filmes', filmesRoutes)

// Rota raiz para teste
app.get('/', (req, res) => {
  res.send('API de Filmes rodando! Use /filmes')
})

// --- Iniciar Servidor ---
app.listen(port, () => {
  console.log(`🚀 Servidor rodando com Bun em http://localhost:${port}`)
})

// --- Documentação Swagger ---
swagger(app);