
# Configuração da API de Relatórios

Este documento contém instruções para configurar e utilizar a API de geração de relatórios.

## Configuração Atual

A aplicação está configurada para redirecionar todas as requisições feitas para `/api/generate-report` para o servidor externo em:
```
https://lovable.renata-ia.com.br/api/generate-report
```

## Como Utilizar a API

### Parâmetros da Requisição

- **Método**: POST
- **Header Obrigatório**: `x-api-key: 784ce4af-6987-4711-b5bd-920f1d67a8d4`
- **Content-Type**: `application/json`

### Corpo da Requisição (JSON)

```json
{
  "clientId": "5cc683bb", 
  "reportType": "categorias",
  "dateRange": {
    "from": "2023-10-01T00:00:00.000Z",
    "to": "2023-10-07T23:59:59.999Z"
  },
  "includeCharts": true
}
```

### Formato da Resposta

A API retorna um objeto JSON com a seguinte estrutura:

```json
{
  "meta": { 
    "clientId": "5cc683bb",
    "geradoEm": "2023-10-08T15:45:23.456Z",
    "reportType": "categorias",
    "periodo": {
      "from": "2023-10-01T00:00:00.000Z",
      "to": "2023-10-07T23:59:59.999Z"
    }
  },
  "dados": {
    "categorias": [
      { "nome": "Alimentação", "valor": 450.75 },
      { "nome": "Transporte", "valor": 300.25 },
      { "nome": "Lazer", "valor": 250.00 }
    ]
  },
  "images": [
    {
      "name": "grafico_categorias.png",
      "data": "data:image/png;base64,..."
    },
    {
      "name": "grafico_ranking.png",
      "data": "data:image/png;base64,..."
    }
  ]
}
```

## Exemplos de Uso

### Usando cURL

```bash
curl -X POST https://renata-ia.lovable.app/api/generate-report \
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

### Usando JavaScript (Fetch API)

```javascript
fetch('https://renata-ia.lovable.app/api/generate-report', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '784ce4af-6987-4711-b5bd-920f1d67a8d4'
  },
  body: JSON.stringify({
    clientId: '5cc683bb',
    reportType: 'categorias',
    dateRange: {
      from: '2023-10-01T00:00:00.000Z',
      to: '2023-10-07T23:59:59.999Z'
    },
    includeCharts: true
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

## Notas Importantes

1. A chave de API é obrigatória para todas as requisições POST.
2. O proxy foi configurado para adicionar automaticamente o header `x-api-key` com o valor correto se ele não for fornecido na requisição.
3. Certifique-se de enviar os dados no formato JSON correto para evitar erros.
