# Consultas AQL

## Diretórios
Lista a hierarquia de diretórios filhos a partir de um diretório específico:

```bash
LET startFolder = "folders/01J7ZWJRWDY6ZNQ0RSWHTSZM3D" 
LET folders = ( 
  FOR v, e, p IN 1..999 OUTBOUND startFolder contains 
  FILTER v._id LIKE "folders/%" 
  RETURN { "path": CONCAT_SEPARATOR("/", p.vertices[*].name) } 
) 
RETURN folders
```

Lista a estrutura de diretórios ancestrais a partir de um diretório específico:

```bash
LET startFolder = "folders/01J7ZWK0RKETKSVE39SK7HPKGB"
LET folders = (
  FOR v, e, p IN 1..999 INBOUND startFolder contains
  FILTER v._id LIKE "folders/%"
  RETURN { "path": CONCAT_SEPARATOR("/", REVERSE(p.vertices[*].name)) }
)
RETURN folders
```

Conteúdo de um diretório específico:

```bash
LET startFolder = "folders/01J7ZWH0YGY6G3V5MQ56ZDAVRP" 
LET files = ( 
  FOR v, e, p IN 1..1 OUTBOUND startFolder contains 
  FILTER v._id LIKE "files/%" 
  RETURN { "path": CONCAT_SEPARATOR("/", p.vertices[*].name) } 
)
LET folders = ( 
  FOR v, e, p IN 1..1 OUTBOUND startFolder contains 
  FILTER v._id LIKE "folders/%" 
  RETURN { "path": CONCAT_SEPARATOR("/", p.vertices[*].name) } 
) 
RETURN { folders, files }
```

## Grupos

Membros de um grupo específico:

```bash
LET groupId = "groups/01J80366MXTG1QGG1TF6SQX4YT"
LET members = (
  FOR user IN 1..1 OUTBOUND groupId memberOf
  RETURN user
)
LET persons = (
  FOR user IN members
  SORT user.name ASC
  RETURN { "name": user.name }
)
RETURN persons
```

## Pessoas

Listagem de pessoas: 

```bash
FOR p IN persons
SORT p.name ASC
RETURN { "id": p._id, "name": p.name }
```

De quais grupos uma pessoa espefiífica participa:

```bash
LET personId = "persons/01J802YGRYG60MA7Y7DEWYTMWX"
LET members = (
  FOR group IN 1..1 INBOUND personId memberOf
  RETURN group
)
LET groups = (
  FOR group IN members
  SORT group.name ASC
  RETURN { "name": group.name }
)
RETURN groups
```

## Permissões

Recursos aos quais um grupo tem privilégios diretamente:
```bash
FOR permission IN permissions
  FILTER permission._from == 'groups/01J80366MXTG1QGG1TF6SQX4YT'
  LET target = DOCUMENT(permission._to)
  LET group = DOCUMENT(permission._from)
  SORT group.name ASC, target.name ASC
  RETURN { groupName: group.name, targetName: target.name, action: permission.action }
```

Verifica quais ações são permitidas a um grupo, diretamente ou herdado de diretórios superiores
```bash
LET folderId = "01J7ZWJRWDY6ZNQ0RSWHTSZM3D"
LET groupId = "01J8032RSHAJDFPYC05DS5JA7F"

LET folderDocuments = (
  FOR doc IN 1..999 INBOUND CONCAT("folders/", folderId) contains
  FILTER doc._id LIKE "folders/%"
    RETURN SPLIT(doc._id, "/")[1]
)
LET folderIds = UNION(folderDocuments, [folderId])

LET permissions = (
  FOR p IN permissions
    FILTER CONTAINS(groupId, SPLIT(p._from, "/")[1])
    FILTER CONTAINS(folderIds, SPLIT(p._to, "/")[1])
    RETURN p.action
)
RETURN UNIQUE(permissions)
```
