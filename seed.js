function generateULID() {
    const ULID_LEN = 26;
    function padBase32(num, len) {
        return num.toString(32).toUpperCase().padStart(len, '0');
    }
    function randomBase32(len) {
        let str = '';
        while (str.length < len) {
            str += Math.random().toString(36).substring(2).toUpperCase().replace(/[^A-Z0-9]/g, '');
        }
        return str.substring(0, len);
    }    
    const time = Date.now();
    const timestamp = padBase32(time, 10);    
    const randomness = randomBase32(16);
    return timestamp + randomness;
}

function dropDatabaseIfExists(dbName) {    
    console.log("Eliminando banco de dados, se existir...");
    if (db._databases().includes(dbName)) {
        db._dropDatabase(dbName);
    }
}

function createDatabase(dbName) {    
    console.log("Criando banco de dados...");
    db._createDatabase(dbName);
    db._useDatabase(dbName);
}

function createCollections() {
    console.log("Criando coleções...");
    db._createDocumentCollection('files');
    db._createDocumentCollection('folders');
    db._createDocumentCollection('persons');
    db._createDocumentCollection('groups');    
    db._createEdgeCollection('contains');
    db._createEdgeCollection('memberOf');    
    db._createEdgeCollection('permissions');
}

function createGraphs() {
    console.log("Criando gráficos...");
    var graphModule = require('@arangodb/general-graph');

    graphModule._create(
        'grafico_diretorios_e_arquivos',
        [graphModule._relation('contains', ['folders', 'files'], ['folders', 'files'])]
    );

    graphModule._create(
        'grafico_membros_de_grupos',
        [graphModule._relation('memberOf', ['groups'], ['persons'])]
    );
    
    graphModule._create(
        'grafico_visao_geral',
        [
            graphModule._relation('contains', ['folders', 'files'], ['folders', 'files']),
            graphModule._relation('permissions', ['groups'], ['folders', 'files']),
            graphModule._relation('memberOf', ['groups'], ['persons'])
        ]
    );
}

function createFolders() {
    console.log("Criando diretórios...");

    db.folders.save({ _key: '01J7ZWDZFFA3N8859WPJ411482', name: 'Pasta Raiz' });
    db.folders.save({ _key: '01J7ZWHHM3ZDTR1G049J28DBJ7', name: 'Pasta Contabilidade' });
    db.folders.save({ _key: '01J7ZWHPDBN8ZCYK9XZPQY8XE7', name: 'Pasta Jurídico' });
    db.folders.save({ _key: '01J7ZWHW5AFC2SDB6VPPA9PKJC', name: 'Pasta Marketing' });
    db.folders.save({ _key: '01J7ZWH0YGY6G3V5MQ56ZDAVRP', name: 'Pasta Contratos' });
    db.folders.save({ _key: '01J7ZWHCDB3YX8WHZKT732VX97', name: 'Pasta Arquivos Mortos' });    
    db.folders.save({ _key: '01J7ZWJRWDY6ZNQ0RSWHTSZM3D', name: 'Pasta Auditoria' });
    db.folders.save({ _key: '01J7ZWG3376RG9TNKBW18EFPWR', name: 'Pasta Projetos' });    
    db.folders.save({ _key: '01J7ZWH6NQXXHKS55JMASW083S', name: 'Pasta Documentos' });
    db.folders.save({ _key: '01J7ZWJ18N4J7CNP8JR9VRYFV9', name: 'Pasta Vendas' });
    db.folders.save({ _key: '01J7ZWJ5J3SN7EN0SVC6R276D8', name: 'Pasta Compras' });
    db.folders.save({ _key: '01J7ZWJ9RZJB3GF5JFNDQVMGZN', name: 'Pasta Treinamento' });
    db.folders.save({ _key: '01J7ZWJDP3PAHYED1BAJZAXC0C', name: 'Pasta Desenvolvimento' });
    db.folders.save({ _key: '01J7ZWJJ3N0GKSV651D83P4S6J', name: 'Pasta Pesquisa' });
    db.folders.save({ _key: '01J7ZWJWXH7BM621QH7DSM2WBE', name: 'Pasta Segurança' });
    db.folders.save({ _key: '01J7ZWK0RKETKSVE39SK7HPKGB', name: 'Pasta Qualidade' });
    db.folders.save({ _key: '01J7ZWK5Y6X3XP289SYSWRK30F', name: 'Pasta Atendimento' });
    db.folders.save({ _key: '01J7ZWKADBREDNZT78WE4W6GK4', name: 'Pasta Comunicação' });
    db.folders.save({ _key: '01J7ZWKEDBK9X6G4053YBQ5RJH', name: 'Pasta Estratégia' });
    db.folders.save({ _key: '01J7ZWKJN66WTK9YR6N09H4HYK', name: 'Pasta Planejamento' });
    db.folders.save({ _key: '01J7ZXD5C39HZ2M66SYXXXGEDA', name: 'Pasta Administração' });
    db.folders.save({ _key: '01J7ZXDBFWTPW88XNR4E583Y9A', name: 'Pasta Governança' });
    db.folders.save({ _key: '01J7ZXDFCWN284EYJBPVTRBGBJ', name: 'Pasta Diretoria' });
    db.folders.save({ _key: '01J7ZXDKNW7BKRKVP2KADRXSEG', name: 'Pasta Eventos' });
}

function assignFolderParentFolders() {
    console.log("Associando diretórios a seus diretórios pai...");
    
    db.contains.save({ _from: 'folders/01J7ZWDZFFA3N8859WPJ411482', _to: 'folders/01J7ZWHHM3ZDTR1G049J28DBJ7' });
    db.contains.save({ _from: 'folders/01J7ZWDZFFA3N8859WPJ411482', _to: 'folders/01J7ZWHPDBN8ZCYK9XZPQY8XE7' });
    db.contains.save({ _from: 'folders/01J7ZWDZFFA3N8859WPJ411482', _to: 'folders/01J7ZWHW5AFC2SDB6VPPA9PKJC' });
    db.contains.save({ _from: 'folders/01J7ZWHHM3ZDTR1G049J28DBJ7', _to: 'folders/01J7ZWH0YGY6G3V5MQ56ZDAVRP' });
    db.contains.save({ _from: 'folders/01J7ZWHHM3ZDTR1G049J28DBJ7', _to: 'folders/01J7ZWHCDB3YX8WHZKT732VX97' });
    db.contains.save({ _from: 'folders/01J7ZWHPDBN8ZCYK9XZPQY8XE7', _to: 'folders/01J7ZWJRWDY6ZNQ0RSWHTSZM3D' });
    db.contains.save({ _from: 'folders/01J7ZWHW5AFC2SDB6VPPA9PKJC', _to: 'folders/01J7ZWG3376RG9TNKBW18EFPWR' });
    db.contains.save({ _from: 'folders/01J7ZWHW5AFC2SDB6VPPA9PKJC', _to: 'folders/01J7ZWH6NQXXHKS55JMASW083S' });
    db.contains.save({ _from: 'folders/01J7ZWH0YGY6G3V5MQ56ZDAVRP', _to: 'folders/01J7ZWJ18N4J7CNP8JR9VRYFV9' });
    db.contains.save({ _from: 'folders/01J7ZWH0YGY6G3V5MQ56ZDAVRP', _to: 'folders/01J7ZWJ5J3SN7EN0SVC6R276D8' });
    db.contains.save({ _from: 'folders/01J7ZWH0YGY6G3V5MQ56ZDAVRP', _to: 'folders/01J7ZWJ9RZJB3GF5JFNDQVMGZN' });
    db.contains.save({ _from: 'folders/01J7ZWHCDB3YX8WHZKT732VX97', _to: 'folders/01J7ZWJDP3PAHYED1BAJZAXC0C' });
    db.contains.save({ _from: 'folders/01J7ZWHCDB3YX8WHZKT732VX97', _to: 'folders/01J7ZWJJ3N0GKSV651D83P4S6J' });
    db.contains.save({ _from: 'folders/01J7ZWHCDB3YX8WHZKT732VX97', _to: 'folders/01J7ZWJWXH7BM621QH7DSM2WBE' });
    db.contains.save({ _from: 'folders/01J7ZWJRWDY6ZNQ0RSWHTSZM3D', _to: 'folders/01J7ZWK0RKETKSVE39SK7HPKGB' });
    db.contains.save({ _from: 'folders/01J7ZWJRWDY6ZNQ0RSWHTSZM3D', _to: 'folders/01J7ZWK5Y6X3XP289SYSWRK30F' });
    db.contains.save({ _from: 'folders/01J7ZWG3376RG9TNKBW18EFPWR', _to: 'folders/01J7ZWKADBREDNZT78WE4W6GK4' });
    db.contains.save({ _from: 'folders/01J7ZWG3376RG9TNKBW18EFPWR', _to: 'folders/01J7ZWKEDBK9X6G4053YBQ5RJH' });
    db.contains.save({ _from: 'folders/01J7ZWG3376RG9TNKBW18EFPWR', _to: 'folders/01J7ZWKJN66WTK9YR6N09H4HYK' });
    db.contains.save({ _from: 'folders/01J7ZWH6NQXXHKS55JMASW083S', _to: 'folders/01J7ZXD5C39HZ2M66SYXXXGEDA' });
    db.contains.save({ _from: 'folders/01J7ZWH6NQXXHKS55JMASW083S', _to: 'folders/01J7ZXDBFWTPW88XNR4E583Y9A' });
    db.contains.save({ _from: 'folders/01J7ZWH6NQXXHKS55JMASW083S', _to: 'folders/01J7ZXDFCWN284EYJBPVTRBGBJ' });
    db.contains.save({ _from: 'folders/01J7ZWH6NQXXHKS55JMASW083S', _to: 'folders/01J7ZXDKNW7BKRKVP2KADRXSEG' });
}

function createFiles() {
    console.log("Criando arquivos...");
    
    db.files.save({ _key: '01J7ZZ1VDM4ED91DTBS3E3BF1Y', name: 'Proposta Comercial.docx' });
    db.files.save({ _key: '01J7ZZ1ZVAB3QNFFXWF1TWYJB5', name: 'Termo de Confidencialidade.docx' });
    db.files.save({ _key: '01J7ZZ28NMM2DPSDWDNF7ES6VV', name: 'Planejamento financeiro.xlsx' });
    db.files.save({ _key: '01J7ZZ2CYGG3HN9F8W4QDE3CE7', name: 'Nova logomarca.cdr' });
    db.files.save({ _key: '01J7ZZ2HJME0QG771NM9J53FCS', name: 'Relatório Financeiro Anual.xlsx' });
    db.files.save({ _key: '01J7ZZ2NXW4V1RZKGTVT6RBS74', name: 'Apresentação Projeto Final.pptx' });
    db.files.save({ _key: '01J7ZZ2T105MJPV68KEK0CR0W5', name: 'Lista de Contatos.csv' });
    db.files.save({ _key: '01J7ZZ2YJ8RQAT41F2PPHHRA2Q', name: 'Planejamento Estratégico 2025.pdf' });
    db.files.save({ _key: '01J7ZZ33K1KD1ZBS2P99AA68ZG', name: 'Notas de Reunião.docx' });
    db.files.save({ _key: '01J7ZZ37P9GRC5WFKFQYS6A3RE', name: 'Fatura Setembro 2024.pdf' });

    db.files.save({ _key: '01J7ZZ3D3VD4Q80NCDBYNTPED8', name: 'Inventário de Equipamentos.xlsx' });
    db.files.save({ _key: '01J7ZZ3GX7EBNB5HX5VBVM4XTF', name: 'Manual do Funcionário.pdf' });
    db.files.save({ _key: '01J7ZZ3N5AE661WGA4T51BFJ77', name: 'Descrição de Cargo.docx' });
    db.files.save({ _key: '01J7ZZ3SRB0MKPNXYQQHVR252Y', name: 'Relatório de Vendas Q1.xlsx' });
    db.files.save({ _key: '01J7ZZ3XGJ12DE6B6PZF3RAY9T', name: 'Política de Privacidade.pdf' });
    db.files.save({ _key: '01J7ZZ41VDG813SJQV5B6SBP3X', name: 'Cronograma de Atividades.xlsx' });
    db.files.save({ _key: '01J7ZZ46NXCH814243BFDHFJZ6', name: 'Carta de Apresentação.docx' });
    db.files.save({ _key: '01J7ZZ4DEZ92AHHH8AJV1JFT9A', name: 'Relatório de Auditoria.pdf' });
    db.files.save({ _key: '01J7ZZ4JV92BYARMC7F78S9WVA', name: 'Plano de Marketing 2023.pptx' });
    db.files.save({ _key: '01J7ZZ4SB4DF028X5RR61QH7RA', name: 'Relatório de Desempenho.pdf' });

    db.files.save({ _key: '01J7ZZ4Z37NEQJED9PN2EFQFFD', name: 'Contrato de Prestação de Serviços.docx' });
    db.files.save({ _key: '01J7ZZ53AS0CM69H28BMK5AYQK', name: 'Lista de Tarefas.xlsx' });
    db.files.save({ _key: '01J7ZZ57WCBST6FRCE4SRHPM9J', name: 'Protocolo de Entrega.pdf' });
    db.files.save({ _key: '01J7ZZ5C9G8PVC70JKWAFN7J8E', name: 'Relatório de Pesquisa.docx' });
    db.files.save({ _key: '01J7ZZ5H1QQ1ZCH2QH2KJSZC1D', name: 'Plano de Negócios 2024.pdf' });
    db.files.save({ _key: '01J7ZZ6A2PCY9C101PQQ5RDR7F', name: 'Resumo Executivo.docx' });
    db.files.save({ _key: '01J7ZZ6G2W81JYM3G80NC46K82', name: 'Proposta de Projeto.pptx' });
    db.files.save({ _key: '01J7ZZ6NNCQ0QCK57QDTZZDPQK', name: 'Relatório de Status.docx' });
    db.files.save({ _key: '01J7ZZ6T7FKE30PRTVYEMY8FXR', name: 'Plano de Treinamento.xlsx' });
    db.files.save({ _key: '01J7ZZ6Y3BW2KN31R08GMW2X67', name: 'Relatório de Incidentes.pdf' });

    db.files.save({ _key: '01J7ZZ7442W76BHVWCWATYS5MS', name: 'Relatório de Despesas.xlsx' });
    db.files.save({ _key: '01J7ZZ78ZCNEVA3HKFC5JVJQES', name: 'Relatório de Produção.docx' });
    db.files.save({ _key: '01J7ZZ7CDHQGVCQFP5DYGGBNTR', name: 'Relatório de Qualidade.pdf' });
    db.files.save({ _key: '01J7ZZ7GGRETK540BQHKWZ3JAQ', name: 'Relatório de Manutenção.xlsx' });
    db.files.save({ _key: '01J7ZZ7KK4KDCMDSS4V99ANZ18', name: 'Relatório de Atendimento.docx' });
    db.files.save({ _key: '01J7ZZ7R5BG2VDYPSPNJMK10Z3', name: 'Relatório de Auditoria Interna.pdf' });
    db.files.save({ _key: '01J7ZZ7VD49FJMKNTQNA0HYKFM', name: 'Relatório de Conformidade.docx' });
    db.files.save({ _key: '01J7ZZ7Z86YN97BZKJ6K82A2X1', name: 'Relatório de Segurança.pdf' });
    db.files.save({ _key: '01J7ZZ836QB8H5CTR5MKNS6T47', name: 'Relatório de Sustentabilidade.docx' });
    db.files.save({ _key: '01J7ZZ87WYJZSFKRPNY0R5F2S8', name: 'Relatório de Responsabilidade Social.pdf' });

    db.files.save({ _key: '01J7ZZ8J1X5Y835E2B9ZNJPJEK', name: 'Relatório de Governança Corporativa.docx' });
    db.files.save({ _key: '01J7ZZ8P4JCFS7MRMJNDSF0YFM', name: 'Relatório de Riscos.pdf' });
    db.files.save({ _key: '01J7ZZ8SCPEV7RN45R4KQ1M5S7', name: 'Relatório de Oportunidades.docx' });
    db.files.save({ _key: '01J7ZZ8WS1AC1WXEZBYZMYKY3T', name: 'Relatório de Desempenho Ambiental.pdf' });
    db.files.save({ _key: '01J7ZZ8ZQTC72K18Q6AV1XVQBB', name: 'Relatório de Desempenho Social.docx' });
    db.files.save({ _key: '01J7ZZ93BMZYPN4MB5QNYNH75A', name: 'Relatório de Desempenho Econômico.pdf' });
    db.files.save({ _key: '01J7ZZ999J1SV069TRWRXY3JR3', name: 'Relatório de Desempenho Operacional.docx' });
    db.files.save({ _key: '01J7ZZ9D6ESC0Q42YG940TC1ZZ', name: 'Relatório de Desempenho Financeiro.pdf' });
    db.files.save({ _key: '01J7ZZ9H66RYF373ZX4N4KVWV8', name: 'Relatório de Desempenho de Mercado.docx' });
    db.files.save({ _key: '01J7ZZ9M9B02N3XJDNSQV17SVG', name: 'Relatório de Desempenho de Vendas.pdf' });

    db.files.save({ _key: '01J7ZZ9Q7YC1HMEGRAMX60QVRP', name: 'Imagem1.jpg' });
    db.files.save({ _key: '01J7ZZ9T530HSBVBS6R39B27SD', name: 'Imagem2.png' });
    db.files.save({ _key: '01J7ZZ9ZRX966YB2ASS4ZMT3Q5', name: 'Imagem3.gif' });
    db.files.save({ _key: '01J7ZZA328VAWA0QVT9MGP4JE2', name: 'Imagem4.bmp' });
    db.files.save({ _key: '01J7ZZA6DQYZ1SYZ1ZPHVF36R3', name: 'Imagem5.tiff' });
    db.files.save({ _key: '01J7ZZAAQR4KBHASWJ2D71FT73', name: 'Imagem6.jpeg' });
    db.files.save({ _key: '01J7ZZAEH9ZV7EY17572SCYD4Y', name: 'Imagem7.svg' });
    db.files.save({ _key: '01J7ZZAJ5E7B3NKDK1WMT37J4D', name: 'Imagem8.webp' });
    db.files.save({ _key: '01J7ZZAPFHT99FTHFVQHV0BC7F', name: 'Imagem9.heic' });
    db.files.save({ _key: '01J7ZZASV7JZD1FT3FNF6PZSET', name: 'Imagem10.raw' });
}

function assignFilesParentFolders() {
    console.log("Associando arquivos à diretórios...");
    
    db.contains.save({ _from: 'folders/01J7ZWHHM3ZDTR1G049J28DBJ7', _to: 'files/01J7ZZ1VDM4ED91DTBS3E3BF1Y' });
    db.contains.save({ _from: 'folders/01J7ZWHHM3ZDTR1G049J28DBJ7', _to: 'files/01J7ZZ1ZVAB3QNFFXWF1TWYJB5' });
    db.contains.save({ _from: 'folders/01J7ZWHHM3ZDTR1G049J28DBJ7', _to: 'files/01J7ZZ28NMM2DPSDWDNF7ES6VV' });
    db.contains.save({ _from: 'folders/01J7ZWHPDBN8ZCYK9XZPQY8XE7', _to: 'files/01J7ZZ2HJME0QG771NM9J53FCS' });
    db.contains.save({ _from: 'folders/01J7ZWHPDBN8ZCYK9XZPQY8XE7', _to: 'files/01J7ZZ2NXW4V1RZKGTVT6RBS74' });
    db.contains.save({ _from: 'folders/01J7ZWHPDBN8ZCYK9XZPQY8XE7', _to: 'files/01J7ZZ2T105MJPV68KEK0CR0W5' });
    db.contains.save({ _from: 'folders/01J7ZWHW5AFC2SDB6VPPA9PKJC', _to: 'files/01J7ZZ2YJ8RQAT41F2PPHHRA2Q' });
    db.contains.save({ _from: 'folders/01J7ZWHW5AFC2SDB6VPPA9PKJC', _to: 'files/01J7ZZ33K1KD1ZBS2P99AA68ZG' });
    db.contains.save({ _from: 'folders/01J7ZWHW5AFC2SDB6VPPA9PKJC', _to: 'files/01J7ZZ37P9GRC5WFKFQYS6A3RE' });
    db.contains.save({ _from: 'folders/01J7ZWH0YGY6G3V5MQ56ZDAVRP', _to: 'files/01J7ZZ3D3VD4Q80NCDBYNTPED8' });

    db.contains.save({ _from: 'folders/01J7ZWH0YGY6G3V5MQ56ZDAVRP', _to: 'files/01J7ZZ3GX7EBNB5HX5VBVM4XTF' });
    db.contains.save({ _from: 'folders/01J7ZWH0YGY6G3V5MQ56ZDAVRP', _to: 'files/01J7ZZ3N5AE661WGA4T51BFJ77' });
    db.contains.save({ _from: 'folders/01J7ZWHCDB3YX8WHZKT732VX97', _to: 'files/01J7ZZ3SRB0MKPNXYQQHVR252Y' });
    db.contains.save({ _from: 'folders/01J7ZWHCDB3YX8WHZKT732VX97', _to: 'files/01J7ZZ3XGJ12DE6B6PZF3RAY9T' });
    db.contains.save({ _from: 'folders/01J7ZWHCDB3YX8WHZKT732VX97', _to: 'files/01J7ZZ41VDG813SJQV5B6SBP3X' });
    db.contains.save({ _from: 'folders/01J7ZWJRWDY6ZNQ0RSWHTSZM3D', _to: 'files/01J7ZZ46NXCH814243BFDHFJZ6' });
    db.contains.save({ _from: 'folders/01J7ZWJRWDY6ZNQ0RSWHTSZM3D', _to: 'files/01J7ZZ4DEZ92AHHH8AJV1JFT9A' });
    db.contains.save({ _from: 'folders/01J7ZWJRWDY6ZNQ0RSWHTSZM3D', _to: 'files/01J7ZZ4JV92BYARMC7F78S9WVA' });
    db.contains.save({ _from: 'folders/01J7ZWG3376RG9TNKBW18EFPWR', _to: 'files/01J7ZZ4SB4DF028X5RR61QH7RA' });
    db.contains.save({ _from: 'folders/01J7ZWG3376RG9TNKBW18EFPWR', _to: 'files/01J7ZZ4Z37NEQJED9PN2EFQFFD' });

    db.contains.save({ _from: 'folders/01J7ZWG3376RG9TNKBW18EFPWR', _to: 'files/01J7ZZ53AS0CM69H28BMK5AYQK' });
    db.contains.save({ _from: 'folders/01J7ZWH6NQXXHKS55JMASW083S', _to: 'files/01J7ZZ57WCBST6FRCE4SRHPM9J' });
    db.contains.save({ _from: 'folders/01J7ZWH6NQXXHKS55JMASW083S', _to: 'files/01J7ZZ5C9G8PVC70JKWAFN7J8E' });
    db.contains.save({ _from: 'folders/01J7ZWH6NQXXHKS55JMASW083S', _to: 'files/01J7ZZ5H1QQ1ZCH2QH2KJSZC1D' });
    db.contains.save({ _from: 'folders/01J7ZWJ18N4J7CNP8JR9VRYFV9', _to: 'files/01J7ZZ6A2PCY9C101PQQ5RDR7F' });
    db.contains.save({ _from: 'folders/01J7ZWJ18N4J7CNP8JR9VRYFV9', _to: 'files/01J7ZZ6G2W81JYM3G80NC46K82' });
    db.contains.save({ _from: 'folders/01J7ZWJ18N4J7CNP8JR9VRYFV9', _to: 'files/01J7ZZ6NNCQ0QCK57QDTZZDPQK' });
    db.contains.save({ _from: 'folders/01J7ZWJ5J3SN7EN0SVC6R276D8', _to: 'files/01J7ZZ6T7FKE30PRTVYEMY8FXR' });
    db.contains.save({ _from: 'folders/01J7ZWJ5J3SN7EN0SVC6R276D8', _to: 'files/01J7ZZ6Y3BW2KN31R08GMW2X67' });
    db.contains.save({ _from: 'folders/01J7ZWJ5J3SN7EN0SVC6R276D8', _to: 'files/01J7ZZ7442W76BHVWCWATYS5MS' });

    db.contains.save({ _from: 'folders/01J7ZWJ9RZJB3GF5JFNDQVMGZN', _to: 'files/01J7ZZ78ZCNEVA3HKFC5JVJQES' });
    db.contains.save({ _from: 'folders/01J7ZWJ9RZJB3GF5JFNDQVMGZN', _to: 'files/01J7ZZ7CDHQGVCQFP5DYGGBNTR' });
    db.contains.save({ _from: 'folders/01J7ZWJ9RZJB3GF5JFNDQVMGZN', _to: 'files/01J7ZZ7GGRETK540BQHKWZ3JAQ' });
    db.contains.save({ _from: 'folders/01J7ZWJDP3PAHYED1BAJZAXC0C', _to: 'files/01J7ZZ7KK4KDCMDSS4V99ANZ18' });
    db.contains.save({ _from: 'folders/01J7ZWJDP3PAHYED1BAJZAXC0C', _to: 'files/01J7ZZ7R5BG2VDYPSPNJMK10Z3' });
    db.contains.save({ _from: 'folders/01J7ZWJDP3PAHYED1BAJZAXC0C', _to: 'files/01J7ZZ7VD49FJMKNTQNA0HYKFM' });
    db.contains.save({ _from: 'folders/01J7ZWJJ3N0GKSV651D83P4S6J', _to: 'files/01J7ZZ7Z86YN97BZKJ6K82A2X1' });
    db.contains.save({ _from: 'folders/01J7ZWJJ3N0GKSV651D83P4S6J', _to: 'files/01J7ZZ836QB8H5CTR5MKNS6T47' });
    db.contains.save({ _from: 'folders/01J7ZWJJ3N0GKSV651D83P4S6J', _to: 'files/01J7ZZ87WYJZSFKRPNY0R5F2S8' });
    db.contains.save({ _from: 'folders/01J7ZWJWXH7BM621QH7DSM2WBE', _to: 'files/01J7ZZ8J1X5Y835E2B9ZNJPJEK' });

    db.contains.save({ _from: 'folders/01J7ZWJWXH7BM621QH7DSM2WBE', _to: 'files/01J7ZZ8P4JCFS7MRMJNDSF0YFM' });
    db.contains.save({ _from: 'folders/01J7ZWJWXH7BM621QH7DSM2WBE', _to: 'files/01J7ZZ8SCPEV7RN45R4KQ1M5S7' });
    db.contains.save({ _from: 'folders/01J7ZWK0RKETKSVE39SK7HPKGB', _to: 'files/01J7ZZ8WS1AC1WXEZBYZMYKY3T' });
    db.contains.save({ _from: 'folders/01J7ZWK0RKETKSVE39SK7HPKGB', _to: 'files/01J7ZZ8ZQTC72K18Q6AV1XVQBB' });
    db.contains.save({ _from: 'folders/01J7ZWK0RKETKSVE39SK7HPKGB', _to: 'files/01J7ZZ93BMZYPN4MB5QNYNH75A' });
    db.contains.save({ _from: 'folders/01J7ZWK5Y6X3XP289SYSWRK30F', _to: 'files/01J7ZZ999J1SV069TRWRXY3JR3' });
    db.contains.save({ _from: 'folders/01J7ZWK5Y6X3XP289SYSWRK30F', _to: 'files/01J7ZZ9D6ESC0Q42YG940TC1ZZ' });
    db.contains.save({ _from: 'folders/01J7ZWK5Y6X3XP289SYSWRK30F', _to: 'files/01J7ZZ9H66RYF373ZX4N4KVWV8' });
    db.contains.save({ _from: 'folders/01J7ZWKADBREDNZT78WE4W6GK4', _to: 'files/01J7ZZ9M9B02N3XJDNSQV17SVG' });
    db.contains.save({ _from: 'folders/01J7ZWKADBREDNZT78WE4W6GK4', _to: 'files/01J7ZZ9Q7YC1HMEGRAMX60QVRP' });

    db.contains.save({ _from: 'folders/01J7ZWKADBREDNZT78WE4W6GK4', _to: 'files/01J7ZZ9T530HSBVBS6R39B27SD' });
    db.contains.save({ _from: 'folders/01J7ZWKEDBK9X6G4053YBQ5RJH', _to: 'files/01J7ZZ9ZRX966YB2ASS4ZMT3Q5' });    
    db.contains.save({ _from: 'folders/01J7ZWKEDBK9X6G4053YBQ5RJH', _to: 'files/01J7ZZASV7JZD1FT3FNF6PZSET' });    
    db.contains.save({ _from: 'folders/01J7ZWKJN66WTK9YR6N09H4HYK', _to: 'files/01J7ZZA328VAWA0QVT9MGP4JE2' });
    db.contains.save({ _from: 'folders/01J7ZXD5C39HZ2M66SYXXXGEDA', _to: 'files/01J7ZZA6DQYZ1SYZ1ZPHVF36R3' });
    db.contains.save({ _from: 'folders/01J7ZXDBFWTPW88XNR4E583Y9A', _to: 'files/01J7ZZAAQR4KBHASWJ2D71FT73' });
    db.contains.save({ _from: 'folders/01J7ZXDFCWN284EYJBPVTRBGBJ', _to: 'files/01J7ZZAJ5E7B3NKDK1WMT37J4D' });
    db.contains.save({ _from: 'folders/01J7ZXDKNW7BKRKVP2KADRXSEG', _to: 'files/01J7ZZAPFHT99FTHFVQHV0BC7F' });
}

function createPersons() {
    console.log("Criando pessoas...");
    
    db.persons.save({ _key: '01J802WM7JT3N7RG6HRM1BHRDX', name: 'Chrystopher' });
    db.persons.save({ _key: '01J802Y0WY740P9KE33TZ1KMJD', name: 'Roberta' });
    db.persons.save({ _key: '01J802Y41VZ4Z7FJJS9R13ZRZW', name: 'Levi' });
    db.persons.save({ _key: '01J802Y6SV2CE8ZPW4FPP93R51', name: 'Jesus' });
    db.persons.save({ _key: '01J802YDHH4BE64X4S7S8N4NQV', name: 'Mizael' });
    db.persons.save({ _key: '01J802YGRYG60MA7Y7DEWYTMWX', name: 'Aline' });
    db.persons.save({ _key: '01J802YM2CZD8XAWKQJR6668F4', name: 'Leandro' });
    db.persons.save({ _key: '01J802YVE527MX8D0M84G2DHVS', name: 'Porfírio' });
    db.persons.save({ _key: '01J802Z02CSK2YZGK0RZ8TXRTQ', name: 'Alan' });
    db.persons.save({ _key: '01J802Z3Z51X0ZHCRW873VP4V5', name: 'Aislan' });

    db.persons.save({ _key: '01J802Z7VPMEAHX1N1819W4YSJ', name: 'Nuno' });
    db.persons.save({ _key: '01J802ZAHCRJPXYPCHDBTMK8ZR', name: 'Paola' });
    db.persons.save({ _key: '01J802ZDQ7GNWT85AYDQAHEK92', name: 'Flavio Guilherme' });
    db.persons.save({ _key: '01J802ZKWJF3PZFJ4W33K4M1DJ', name: 'Mauro' });
    db.persons.save({ _key: '01J802ZQJXBZFFQ5FGFS16JRH8', name: 'Débora' });
    db.persons.save({ _key: '01J802ZTWMEKKB6QH6JMZZHBCV', name: 'Silvana' });
    db.persons.save({ _key: '01J802ZYZZCVD99G3H09DSZEFB', name: 'Jabner' });
    db.persons.save({ _key: '01J80303C7TRT1ZAMC7DDRFHFC', name: 'Cláudia' });
    db.persons.save({ _key: '01J80307AF7GV81PG93K4RAF14', name: 'Cristina' });
    db.persons.save({ _key: '01J8030ADXKPAH3WN2HCDF9FWP', name: 'Victor' });
}


function createGroups() {
    console.log("Criando grupos...");
    
    db.groups.save({ _key: '01J8032RSHAJDFPYC05DS5JA7F', name: 'Administradores', systemGroup: false });    
    db.groups.save({ _key: '01J8035694ANSQX7N0HFKD7DJM', name: 'Gerentes', systemGroup: false });
    db.groups.save({ _key: '01J8035B02DXGWDWK7XVHRXQ0P', name: 'Desenvolvedores', systemGroup: false });
    db.groups.save({ _key: '01J8035FHBRXKT7MHAR75EWZZE', name: 'Marketing', systemGroup: false });
    db.groups.save({ _key: '01J8035MFW1A6HTNC0S8FPBGVR', name: 'Financeiro', systemGroup: false });
    db.groups.save({ _key: '01J8035T6CCSPFW0Y7SD2R8Z93', name: 'Auditores', systemGroup: false });
    db.groups.save({ _key: '01J8035Y1Z5BXWD9PEJER856GA', name: 'Estagiários', systemGroup: false });
    db.groups.save({ _key: '01J80362ZEF501TXRTVXXK6TRY', name: 'Suporte Técnico', systemGroup: false });
    db.groups.save({ _key: '01J80366MXTG1QGG1TF6SQX4YT', name: 'Implantadores', systemGroup: false }); 
}

function assignPersonsToGroups() {
    console.log("Associando pessoas à grupos...");    
    
    db.memberOf.save({ _from: 'groups/01J80366MXTG1QGG1TF6SQX4YT', _to: 'persons/01J802WM7JT3N7RG6HRM1BHRDX' });
    db.memberOf.save({ _from: 'groups/01J80366MXTG1QGG1TF6SQX4YT', _to: 'persons/01J802Y6SV2CE8ZPW4FPP93R51' });
    db.memberOf.save({ _from: 'groups/01J8035694ANSQX7N0HFKD7DJM', _to: 'persons/01J802YVE527MX8D0M84G2DHVS' });
    db.memberOf.save({ _from: 'groups/01J8035694ANSQX7N0HFKD7DJM', _to: 'persons/01J802YGRYG60MA7Y7DEWYTMWX' });
    db.memberOf.save({ _from: 'groups/01J8035B02DXGWDWK7XVHRXQ0P', _to: 'persons/01J8030ADXKPAH3WN2HCDF9FWP' });
    db.memberOf.save({ _from: 'groups/01J8035B02DXGWDWK7XVHRXQ0P', _to: 'persons/01J802Y41VZ4Z7FJJS9R13ZRZW' });
    db.memberOf.save({ _from: 'groups/01J8035B02DXGWDWK7XVHRXQ0P', _to: 'persons/01J802ZDQ7GNWT85AYDQAHEK92' });
    db.memberOf.save({ _from: 'groups/01J8035B02DXGWDWK7XVHRXQ0P', _to: 'persons/01J802YDHH4BE64X4S7S8N4NQV' });
    db.memberOf.save({ _from: 'groups/01J8035B02DXGWDWK7XVHRXQ0P', _to: 'persons/01J802Z02CSK2YZGK0RZ8TXRTQ' });
    db.memberOf.save({ _from: 'groups/01J8035B02DXGWDWK7XVHRXQ0P', _to: 'persons/01J802ZKWJF3PZFJ4W33K4M1DJ' });
    db.memberOf.save({ _from: 'groups/01J8035Y1Z5BXWD9PEJER856GA', _to: 'persons/01J802Z3Z51X0ZHCRW873VP4V5' });
    db.memberOf.save({ _from: 'groups/01J8035MFW1A6HTNC0S8FPBGVR', _to: 'persons/01J80303C7TRT1ZAMC7DDRFHFC' });
    db.memberOf.save({ _from: 'groups/01J8035MFW1A6HTNC0S8FPBGVR', _to: 'persons/01J802ZTWMEKKB6QH6JMZZHBCV' });
    db.memberOf.save({ _from: 'groups/01J8035MFW1A6HTNC0S8FPBGVR', _to: 'persons/01J802ZQJXBZFFQ5FGFS16JRH8' });
    db.memberOf.save({ _from: 'groups/01J8035MFW1A6HTNC0S8FPBGVR', _to: 'persons/01J80303C7TRT1ZAMC7DDRFHFC' });
    db.memberOf.save({ _from: 'groups/01J80362ZEF501TXRTVXXK6TRY', _to: 'persons/01J802ZYZZCVD99G3H09DSZEFB' });
    db.memberOf.save({ _from: 'groups/01J80362ZEF501TXRTVXXK6TRY', _to: 'persons/01J80307AF7GV81PG93K4RAF14' });
    db.memberOf.save({ _from: 'groups/01J8032RSHAJDFPYC05DS5JA7F', _to: 'persons/01J802Y0WY740P9KE33TZ1KMJD' });
    db.memberOf.save({ _from: 'groups/01J8032RSHAJDFPYC05DS5JA7F', _to: 'persons/01J802YM2CZD8XAWKQJR6668F4' });
    db.memberOf.save({ _from: 'groups/01J8035FHBRXKT7MHAR75EWZZE', _to: 'persons/01J802Z7VPMEAHX1N1819W4YSJ' });
    db.memberOf.save({ _from: 'groups/01J8035FHBRXKT7MHAR75EWZZE', _to: 'persons/01J802ZAHCRJPXYPCHDBTMK8ZR' });
    db.memberOf.save({ _from: 'groups/01J8035T6CCSPFW0Y7SD2R8Z93', _to: 'persons/01J802YGRYG60MA7Y7DEWYTMWX' });
}

function assignPermissionsToFolders() {
    console.log("Criando permissões para diretórios...");

    db.permissions.save({ _from: 'groups/01J80366MXTG1QGG1TF6SQX4YT' , _to: 'folders/01J7ZWDZFFA3N8859WPJ411482', action: 'Leitura' });
    
    db.permissions.save({ _from: 'groups/01J8032RSHAJDFPYC05DS5JA7F', _to: 'folders/01J7ZWHHM3ZDTR1G049J28DBJ7', action: 'Leitura' });
    db.permissions.save({ _from: 'groups/01J8032RSHAJDFPYC05DS5JA7F', _to: 'folders/01J7ZWHPDBN8ZCYK9XZPQY8XE7', action: 'Leitura' });
    db.permissions.save({ _from: 'groups/01J8032RSHAJDFPYC05DS5JA7F', _to: 'folders/01J7ZWHPDBN8ZCYK9XZPQY8XE7', action: 'Leitura' });

    db.permissions.save({ _from: 'groups/01J8035T6CCSPFW0Y7SD2R8Z93', _to: 'folders/01J7ZWDZFFA3N8859WPJ411482', action: 'Leitura' });
    db.permissions.save({ _from: 'groups/01J8035T6CCSPFW0Y7SD2R8Z93', _to: 'folders/01J7ZWJRWDY6ZNQ0RSWHTSZM3D', action: 'Escrita' });   
}

function assignPermissionsToFiles() {
    console.log("Criando permissões para arquivos...");

    db.permissions.save({ _from: 'groups/01J8035Y1Z5BXWD9PEJER856GA', _to: 'files/01J7ZZ37P9GRC5WFKFQYS6A3RE', action: "Leitura" });
    db.permissions.save({ _from: 'groups/01J8035Y1Z5BXWD9PEJER856GA', _to: 'files/01J7ZZ1VDM4ED91DTBS3E3BF1Y', action: "Leitura" });
    db.permissions.save({ _from: 'groups/01J8035Y1Z5BXWD9PEJER856GA', _to: 'files/01J7ZZ8J1X5Y835E2B9ZNJPJEK', action: "Leitura" });

    db.permissions.save({ _from: 'groups/01J8032RSHAJDFPYC05DS5JA7F', _to: "files/01J7ZZ4DEZ92AHHH8AJV1JFT9A", action: "Escrita" });
    db.permissions.save({ _from: 'groups/01J8032RSHAJDFPYC05DS5JA7F', _to: "files/01J7ZZ4JV92BYARMC7F78S9WVA", action: "Leitura" });    
}

function main() {
    const dbName = 'file_system_management_db';
    dropDatabaseIfExists(dbName);    
    createDatabase(dbName);
    createCollections();
    createGraphs();
    createFolders();
    assignFolderParentFolders();
    createFiles();
    assignFilesParentFolders();
    createPersons();
    createGroups();
    assignPersonsToGroups();    
    assignPermissionsToFolders();
    assignPermissionsToFiles();

    console.log("Configuração da base de dados finalizada.");
}

main();