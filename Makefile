.DEFAULT_GOAL := help
NODE_ENV=development
ARANGO_DB_URL=http://localhost:8529
ARANGO_DB_USER=root
ARANGO_DB_PASSWORD=password
ARANGO_DB_NAME=file_system_management_db

up:
	@echo "🚀 Iniciando os contêineres..."
	docker run -e ARANGO_ROOT_PASSWORD=$(ARANGO_DB_PASSWORD) \
	-d --name $(ARANGO_DB_NAME) \
	-p 8529:8529 \
	-v arangodb_data:/var/lib/arangodb3 \
	-v arangodb_apps:/var/lib/arangodb3-apps \
	arangodb

down:
	@echo "🛑 Parando e removendo os contêineres..."
	docker stop $(ARANGO_DB_NAME)

logs:
	@echo "📜 Exibindo logs dos contêineres..."
	docker logs -f $(ARANGO_DB_NAME)

stats:
	@echo "📈 Exibindo o uso de recursos pelos contêineres em execução..."
	docker stats $(docker ps --format {{.Names}})

clean:
	@echo "🧹 Limpando volumes e dados persistentes..."
	docker stop $(ARANGO_DB_NAME)
	docker rm $(ARANGO_DB_NAME)
	docker container prune
	docker volume prune
	@echo "📦 Removendo as imagens de contêineres..."
	docker rmi $(shell docker images -q)

seed:	
	@echo "🌱 Populando banco de dados..."	
	docker cp seed.js $(ARANGO_DB_NAME):/tmp/seed.js
	docker exec -it $(ARANGO_DB_NAME) arangosh --server.username $(ARANGO_DB_USER) --server.password $(ARANGO_DB_PASSWORD) --javascript.execute /tmp/seed.js

exec:
	@echo "⌨️ Acessar console do contêiner..."
	docker exec -it $(ARANGO_DB_NAME) bash

arangosh:
	@echo "⌨️ Acessar console Arangosh..."
	docker exec -it $(ARANGO_DB_NAME) arangosh --server.username $(ARANGO_DB_USER) --server.password $(ARANGO_DB_PASSWORD) --server.database $(ARANGO_DB_NAME)
	
help:
	@echo " Comandos disponíveis:"
	@echo " make up         - 🚀 Construir e rodar os contêineres"		
	@echo " make down       - 🛑 Parar e remover os contêineres"
	@echo " make clean      - 🧹 Limpar volumes e imagens"	
	@echo " make logs       - 📜 Exibir os logs dos contêineres"
	@echo " make stats      - 📈 Exibir o uso de recursos pelos contêiners em execução"
	@echo " make seed       - 🌱 Populando banco de dados"
	@echo " make exec       - ⌨️  Acessar console do contêiner"
	@echo " make arangosh   - ⌨️  Acessar console Arangosh"
	@echo " make help       - ❔ Acessar comandos disponíveis"