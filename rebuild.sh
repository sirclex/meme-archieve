echo "Stopping containers and removing images..."
docker compose down --rmi all

echo "Rebuilding and starting containers..."
docker compose up --build -d