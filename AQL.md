/*---------------------
  -- DIRETÓRIOS
  ---------------------*/
LET rootDirectory = "folders/01I7TUODFV642ON0KQ9OKRPTSW"
LET directories = (
  FOR v, e, p IN 1..999 OUTBOUND rootDirectory contains
    FILTER v._id LIKE "folders/%"
    LET ancestors = (
        FOR ancestor IN 1..999 INBOUND v._id contains
        FILTER ancestor._id LIKE "folders/%"
        RETURN ancestor.name
    )
    LET fullPath = (
        CONCAT(CONCAT_SEPARATOR("/", SLICE(ancestors, 0, LENGTH(ancestors))), CONCAT("/", v.name))
    )
    RETURN {
        "id": v._id,
        "name": v.name,
        "fullPath": fullPath
    }
)
RETURN directories

LET rootFolder = "folders/01I7TUODFV642ON0KQ9OKRPTSW"
LET folders = (
    FOR v, e, p IN 1..999 OUTBOUND rootFolder contains
      FILTER v._id LIKE "folders/%"
      RETURN {
        "path": CONCAT_SEPARATOR("/", p.vertices[*].name)
      }
)
RETURN folders

FOR d IN folders
SORT d.name
RETURN d






/*---------------------
  -- GRUPOS
  ---------------------*/
FOR g IN groups
FILTER g.systemGroup == false
//  AND g.name == 'Implantadores'
SORT g.name
RETURN {
    "id": g._id,
    "name": g.name
}

/*---------------------
  -- PERMISSÕES
  ---------------------*/
FOR p IN permissions
  FOR g IN groups
      FILTER p._from == g._id
  FOR f IN files
      FILTER p._to == f._id
  SORT g.name, f.name
  RETURN {
      "groupName": g.name,
      "resourceName": f.name,
      "action": p.action
  }
  
FOR p IN permissions
  FOR g IN groups
      FILTER p._from == g._id
  FOR f IN files
      FILTER p._to == f._id
  LET fullPath = (
      FOR v, e IN 1..999 INBOUND f._id contains
      SORT v._key
      RETURN v.name
  )
  SORT g.name, CONCAT(CONCAT_SEPARATOR("/", fullPath), CONCAT("/", f.name))
  RETURN {
      "groupName": g.name,
      "resourceFullPath": CONCAT(CONCAT_SEPARATOR("/", fullPath), CONCAT("/", f.name))
  }


/*
PERMISSÕES - POR GRUPO
*/
LET groupId = "groups/01I7TUODRPLHCGUYRF8PH8EVAT"
LET directoriesWithAccess = (
  FOR p IN permissions
  FILTER p._from == groupId
  FOR f IN folders
    FILTER p._to == f._id 
    RETURN {
        "directoryId": f._id,
        "directoryName": f.name,
        "accessType": p.action
    }
)
RETURN directoriesWithAccess