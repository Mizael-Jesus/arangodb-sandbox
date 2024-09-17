const ids = {
    folders: {},
    files: {},
    persons: {},
    groups: {}    
};

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
    db._createEdgeCollection('groups_persons');    
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
        [graphModule._relation('groups_persons', ['groups'], ['persons'])]
    );
    
    graphModule._create(
        'grafico_visao_geral',
        [
            graphModule._relation('contains', ['folders', 'files'], ['folders', 'files']),
            graphModule._relation('permissions', ['groups'], ['folders', 'files']),
            graphModule._relation('groups_persons', ['groups'], ['persons'])
        ]
    );
}

function createView() {
    console.log("Criando view para consulta de permissões...");

    db._createView('permissions_view', 'arangosearch', {
        links: {
            permissions: {
                includeAllFields: true,
                fields: {
                    _from: { analyzers: ['identity'] },
                    _to: { analyzers: ['identity'] },
                    action: { analyzers: ['identity'] }
                }
            },
            groups: {
                includeAllFields: true,
                fields: {
                    name: { analyzers: ['identity'] }
                }
            }
        }
    });

    db._query(`
        FOR permission IN permissions
        FILTER permission._from == CONCAT('groups/', @groupId)
        LET target = DOCUMENT(permission._to)
        LET group = DOCUMENT(permission._from)
        RETURN { groupName: group.name, targetName: target.name, action: permission.action }
    `, { groupId: '@groupId' }).toArray();
}

function getRandomUniqueNames(names, count) {
    const shuffled = names.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function createFolders() {
    console.log("Criando diretórios...");
    const names = [
        'Pasta Projetos', 'Pasta Contratos', 'Pasta Documentos', 'Pasta Arquivos Mortos', 'Pasta Contabilidade',
        'Pasta Jurídico', 'Pasta Marketing', 'Pasta Vendas', 'Pasta Compras', 'Pasta Treinamento', 
        'Pasta Desenvolvimento', 'Pasta Pesquisa', 'Pasta Auditoria', 'Pasta Segurança', 'Pasta Qualidade', 
        'Pasta Atendimento', 'Pasta Comunicação', 'Pasta Estratégia', 'Pasta Planejamento', 'Pasta Administração',
        'Pasta Governança', 'Pasta Diretoria'
    ];
    const selectedNames = getRandomUniqueNames(names, 20);
    const newIds = selectedNames.map(() => generateULID());

    ids.folders['folderRootId'] = generateULID();
    db.folders.save({ _key: ids.folders['folderRootId'], name: 'Pasta Raíz' });

    newIds.forEach((id, index) => {
        ids.folders[`folder${index}Id`] = id;
        db.folders.save({ _key: id, name: selectedNames[index] });
    });
}

function assignFolderParentFolders() {
    console.log("Associando diretórios a seus diretórios pai...");
    const rootFolderId = ids.folders['folderRootId'];
    const folderIds = Object.values(ids.folders).filter(id => id !== rootFolderId);
    const parentMap = {};
   
    parentMap[rootFolderId] = { parent: null, children: [] };

    folderIds.forEach(folderId => {
        parentMap[folderId] = { parent: null, children: [] };
    });

    function getValidParentFolder(excludeId) {
        const validParents = Object.keys(parentMap).filter(id => id !== excludeId && parentMap[id].children.length < 3);
        return validParents[Math.floor(Math.random() * validParents.length)];
    }

    for (let i = 0; i < 3 && folderIds.length > 0; i++) {
        const childId = folderIds.shift();
        parentMap[childId].parent = rootFolderId;
        parentMap[rootFolderId].children.push(childId);
        db.contains.save({ _from: 'folders/' + rootFolderId, _to: 'folders/' + childId });
    }

    folderIds.forEach(folderId => {
        const parentFolderId = getValidParentFolder(folderId);
        parentMap[folderId].parent = parentFolderId;
        parentMap[parentFolderId].children.push(folderId);
        db.contains.save({ _from: 'folders/' + parentFolderId, _to: 'folders/' + folderId });
    });
}

function createFiles() {
    console.log("Criando arquivos...");
    const names = [
        'Proposta Comercial.docx', 'Termo de Confidencialidade.docx', 'Planejamento financeiro.xlsx', 
        'Nova logomarca.cdr', 'Relatório Financeiro Anual.xlsx', 'Apresentação Projeto Final.pptx', 
        'Lista de Contatos.csv', 'Planejamento Estratégico 2025.pdf', 'Notas de Reunião.docx', 
        'Fatura Setembro 2024.pdf', 'Inventário de Equipamentos.xlsx', 'Manual do Funcionário.pdf', 
        'Descrição de Cargo.docx', 'Relatório de Vendas Q1.xlsx', 'Política de Privacidade.pdf', 
        'Cronograma de Atividades.xlsx', 'Carta de Apresentação.docx', 'Relatório de Auditoria.pdf', 
        'Plano de Marketing 2023.pptx', 'Relatório de Desempenho.pdf', 'Contrato de Prestação de Serviços.docx', 
        'Lista de Tarefas.xlsx', 'Protocolo de Entrega.pdf', 'Relatório de Pesquisa.docx', 
        'Plano de Negócios 2024.pdf', 'Resumo Executivo.docx', 'Proposta de Projeto.pptx', 
        'Relatório de Status.docx', 'Plano de Treinamento.xlsx', 'Relatório de Incidentes.pdf', 
        'Relatório de Despesas.xlsx', 'Relatório de Produção.docx', 'Relatório de Qualidade.pdf', 
        'Relatório de Manutenção.xlsx', 'Relatório de Atendimento.docx', 'Relatório de Auditoria Interna.pdf', 
        'Relatório de Conformidade.docx', 'Relatório de Segurança.pdf', 'Relatório de Sustentabilidade.docx', 
        'Relatório de Responsabilidade Social.pdf', 'Relatório de Governança Corporativa.docx', 
        'Relatório de Riscos.pdf', 'Relatório de Oportunidades.docx', 'Relatório de Desempenho Ambiental.pdf', 
        'Relatório de Desempenho Social.docx', 'Relatório de Desempenho Econômico.pdf', 
        'Relatório de Desempenho Operacional.docx', 'Relatório de Desempenho Financeiro.pdf', 
        'Relatório de Desempenho de Mercado.docx', 'Relatório de Desempenho de Vendas.pdf', 
        'Imagem1.jpg', 'Imagem2.png', 'Imagem3.gif', 'Imagem4.bmp', 'Imagem5.tiff', 
        'Imagem6.jpeg', 'Imagem7.svg', 'Imagem8.webp', 'Imagem9.heic', 'Imagem10.raw'
    ];
    const selectedNames = getRandomUniqueNames(names, 50);
    const newIds = selectedNames.map(() => generateULID());

    newIds.forEach((id, index) => {
        ids.files[`file${index}Id`] = id;
        db.files.save({ _key: id, name: selectedNames[index] });
    });
}

function assignFilesParentFolders() {
    console.log("Associando arquivos à diretórios...");
    const rootFolderId = ids.folders.folder0Id;
    const folderIds = Object.values(ids.folders).filter(id => id !== rootFolderId);
    const fileIds = Object.values(ids.files);

    function getRandomParentFolder() {
        return folderIds[Math.floor(Math.random() * folderIds.length)];
    }

    fileIds.forEach(fileId => {
        const parentFolderId = getRandomParentFolder();
        db.contains.save({ _from: 'folders/' + parentFolderId, _to: 'files/' + fileId });
    });
}

function createPersons() {
    console.log("Criando arquivos...");
    const names = [
        'Chrystopher', 'Roberta', 'Levi', 'Jesus', 'Mizael', 
        'Aline', 'Leandro', 'Porfírio', 'Alan', 'Aislan', 
        'Nuno', 'Paola', 'Flavio Guilherme', 'Mauro', 'Débora', 
        'Silvana', 'Jabner', 'Cláudia', 'Cristina', 'Victor'        
    ];
    const selectedNames = getRandomUniqueNames(names, 20);
    const newIds = selectedNames.map(() => generateULID());
    
    const rootGroupId = generateULID();
    db.groups.save({ _key: rootGroupId, name: 'Todos os Usuários', systemGroup: true });

    newIds.forEach((id, index) => {        
        ids.persons[`person${index}Id`] = id;
        let groupId = generateULID();
        db.persons.save({ _key: id, name: selectedNames[index] });
        db.groups.save({ _key: groupId, name: '_grupo_' + selectedNames[index], systemGroup: true });
        db.groups_persons.save({ _from: 'groups/' + groupId, _to: 'persons/' + id });
        db.groups_persons.save({ _from: 'groups/' + rootGroupId, _to: 'persons/' + id });
    });
}


function createGroups() {
    console.log("Criando grupos...");
    const names = [
        'Administradores', 'Usuários', 'Gerentes', 'Desenvolvedores', 'Recursos Humanos', 
        'Financeiro', 'Auditores', 'Convidados', 'Suporte Técnico', 'Implantadores'
    ];
    const selectedNames = getRandomUniqueNames(names, 10);
    const newIds = selectedNames.map(() => generateULID());

    newIds.forEach((id, index) => {
        ids.groups[`group${index}Id`] = id;
        db.groups.save({ _key: id, name: selectedNames[index], systemGroup: false });
    });
}

function assignPersonsToGroups() {
    console.log("Associando pessoas à grupos...");    
    const groupIds = Object.values(ids.groups);
    const personIds = Object.values(ids.persons);

    function getRandomGroup() {
        return groupIds[Math.floor(Math.random() * groupIds.length)];
    }

    personIds.forEach(personId => {
        const groupId = getRandomGroup();
        db.groups_persons.save({ _from: 'groups/' + groupId, _to: 'persons/' + personId });
    });
}

function assignPermissionsToFolders() {
    console.log("Criando permissões para diretórios...");

    const actions = [
        'Ler', 'Escrever', 'Compartilhar', 'Excluir', 'Editar', 
        'Mover', 'Download', 'Criar', 'Renomear', 'Enviar para lixeira', 
        'Restaurar', 'Visualizar', 'Copiar', 'Alterar permissões'
    ];

    const folderIds = getRandomUniqueNames(Object.values(ids.folders), 10);
    const groupIds = Object.values(ids.groups);

    folderIds.forEach(folderId => {
        const selectedGroups = getRandomUniqueNames(groupIds, 2);

        selectedGroups.forEach(groupId => {
            const selectedActions = getRandomUniqueNames(actions, 1);

            selectedActions.forEach(action => {
                db.permissions.save({
                    _from: 'groups/' + groupId,
                    _to: 'folders/' + folderId,
                    action: action
                });
            });
        });
    });
}

function assignPermissionsToFiles() {
    console.log("Criando permissões para arquivos...");

    const actions = [
        'Ler', 'Escrever', 'Compartilhar', 'Excluir', 'Editar', 
        'Mover', 'Download', 'Criar', 'Renomear', 'Enviar para lixeira', 
        'Restaurar', 'Visualizar', 'Copiar', 'Alterar permissões'
    ];

    const fileIds = getRandomUniqueNames(Object.values(ids.files), 25);
    const groupIds = Object.values(ids.groups);

    fileIds.forEach(fileId => {
        const selectedGroups = getRandomUniqueNames(groupIds, 2);

        selectedGroups.forEach(groupId => {
            const selectedActions = getRandomUniqueNames(actions, 1);

            selectedActions.forEach(action => {
                db.permissions.save({
                    _from: 'groups/' + groupId,
                    _to: 'files/' + fileId,
                    action: action
                });
            });
        });
    });
}

function ensureImplantadoresPermissions() {
    console.log("Garantindo que o grupo Implantadores tenha todas as permissões na Pasta Raiz...");    
    const implantadoresGroupId = Object.values(ids.groups).find(groupId => db.groups.document(groupId).name === 'Implantadores');
    const rootFolderId = ids.folders['folderRootId'];

    const actions = [
        'Ler', 'Escrever', 'Compartilhar', 'Excluir', 'Editar', 
        'Mover', 'Download', 'Criar', 'Renomear', 'Enviar para lixeira', 
        'Restaurar', 'Visualizar', 'Copiar', 'Alterar permissões'
    ];

    if (implantadoresGroupId) {        
        const members = db.groups_persons.byExample({ _from: 'groups/' + implantadoresGroupId });
        if (members.count() === 0) {            
            const randomPersonId = Object.values(ids.persons)[0];
            db.groups_persons.save({ _from: 'groups/' + implantadoresGroupId, _to: 'persons/' + randomPersonId });
        }

        actions.forEach(action => {
            const existingPermission = db.permissions.firstExample({ _from: 'groups/' + implantadoresGroupId, _to: 'folders/' + rootFolderId, action: action });
            if (!existingPermission) {
                db.permissions.save({
                    _from: 'groups/' + implantadoresGroupId,
                    _to: 'folders/' + rootFolderId,
                    action: action
                });
            }
        });
    } else {
        console.error("Grupo Implantadores não encontrado.");
    }
}

function checkPermission(user, resource, action) {
    const groups = db._query(`
        FOR gp IN groups_persons
            FILTER gp._to == @user
            RETURN gp._from
    `, { user: 'persons/' + user }).toArray();

    const permissions = db._query(`
        FOR p IN permissions
            FILTER p._from IN @groups AND p._to == @resource AND p.action == @action
            RETURN p
    `, { groups, resource: 'folders/' + resource, action }).toArray();

    return permissions.length > 0;
}

function validatePermission(){
    console.log("Validando permissões ...");
    const implantadoresGroupId = Object.values(ids.groups).find(groupId => db.groups.document(groupId).name === 'Implantadores');
    const implantadoresMembers = db.groups_persons.byExample({ _from: 'groups/' + implantadoresGroupId }).toArray();
    const user = implantadoresMembers.length > 0 ? implantadoresMembers[0]._to.split('/')[1] : null;
    const resource = ids.folders['folderRootId'];

    if (user) {
        const userName = db.persons.document('persons/' + user).name;
        const hasPermission = checkPermission(user, resource, 'Ler');
        console.log(`Usuário ${userName} tem permissão de leitura no diretório raiz: ${hasPermission}`);
    } else {
        console.error("Nenhum usuário encontrado no grupo Implantadores.");
    }
}

function main() {
    const dbName = 'file_system_management_db';
    dropDatabaseIfExists(dbName);    
    createDatabase(dbName);
    createCollections();
    createGraphs();
    createView();
    createFolders();
    assignFolderParentFolders();
    createFiles();
    assignFilesParentFolders();
    createPersons();
    createGroups();
    assignPersonsToGroups();    
    assignPermissionsToFolders();
    assignPermissionsToFiles();
    ensureImplantadoresPermissions();
    validatePermission();
 
    console.log("Configuração da base de dados finalizada.");
}

main();