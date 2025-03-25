
// Exemplo de como utilizar a API de relatórios

/**
 * Função para gerar um relatório usando a API configurada
 * @param clientId ID do cliente
 * @param reportType Tipo de relatório
 * @param dateRange Período do relatório
 * @param includeCharts Incluir gráficos no relatório
 * @returns Promise com os dados do relatório
 */
export async function generateReport(
  clientId: string,
  reportType: 'categorias' | 'metas' | 'completo',
  dateRange: { from: string; to: string },
  includeCharts: boolean = true
): Promise<any> {
  try {
    const response = await fetch('/api/generate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '784ce4af-6987-4711-b5bd-920f1d67a8d4'
      },
      body: JSON.stringify({
        clientId,
        reportType,
        dateRange,
        includeCharts
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    throw error;
  }
}

// Exemplo de uso da função
export const reportExample = async () => {
  try {
    // Define o período do relatório (últimos 7 dias)
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const dateRange = {
      from: sevenDaysAgo.toISOString(),
      to: today.toISOString()
    };
    
    // Chama a função para gerar o relatório
    const report = await generateReport(
      '5cc683bb',
      'categorias',
      dateRange,
      true
    );
    
    console.log('Relatório gerado com sucesso:', report);
    
    // Exemplo de processamento dos dados do relatório
    if (report.images && report.images.length > 0) {
      console.log(`Relatório contém ${report.images.length} imagens`);
      
      // Aqui você poderia usar as imagens para exibir ou baixar
      const categoriesChart = report.images.find(img => img.name === 'grafico_categorias.png');
      if (categoriesChart) {
        // Exemplo: criar um elemento de imagem
        const imgElement = document.createElement('img');
        imgElement.src = categoriesChart.data;
        imgElement.alt = 'Gráfico de Categorias';
        // document.getElementById('chart-container').appendChild(imgElement);
      }
    }
    
    return report;
  } catch (error) {
    console.error('Falha ao processar relatório:', error);
    throw error;
  }
};
