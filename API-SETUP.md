
# Configuração da API de Relatórios

Este documento contém instruções para configurar e executar a API de geração de relatórios.

## Passo a Passo

1. Instale as dependências necessárias:
   ```
   npm install express cors
   ```

2. Execute o servidor API em um terminal separado:
   ```
   node api-server.js
   ```

3. O servidor API estará disponível em:
   ```
   http://localhost:3001/api/generate-report
   ```

4. Para o ambiente de produção, você precisará configurar um serviço dedicado para essa API ou usar um serviço de hospedagem como:
   - Heroku
   - Vercel (com configuração serverless)
   - DigitalOcean
   - AWS, Azure ou GCP

## Testes

### Usando o navegador (GET - apenas para teste):
Acesse: http://localhost:3001/api/generate-report

### Usando cURL (POST):
```
curl -X POST http://localhost:3001/api/generate-report \
  -H "Content-Type: application/json" \
  -H "x-api-key: 784ce4af-6987-4711-b5bd-920f1d67a8d4" \
  -d '{
    "clientId": "5cc683bb", 
    "reportType": "categorias",
    "dateRange": {
      "from": "2023-10-01T00:00:00.000Z",
      "to": "2023-10-07T23:59:59.999Z"
    },
    "includeCharts": true
  }'
```

## Notas Importantes

1. A chave de API autenticação é:
   ```
   784ce4af-6987-4711-b5bd-920f1d67a8d4
   ```

2. Todas as requisições POST devem incluir esta chave no header `x-api-key`.

3. Os endpoints disponíveis são:
   - GET /api/generate-report - Para testes (não requer autenticação)
   - POST /api/generate-report - Para uso em produção (requer autenticação)

4. Formato da resposta:
   ```json
   {
     "meta": { ... metadados ... },
     "dados": { ... dados do relatório ... },
     "images": [ ... imagens em base64 ... ]
   }
   ```
