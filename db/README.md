# DB Docker image for LaPlumeVirtuelle

This folder contains a small Docker image for MySQL that initializes the `lpvDB` database and creates an `admin` user (password `admin`).

Build the image:

```bash
docker build -t lpv-mysql:local ./db
```

Run the container (allow empty root password - not recommended for production):

```bash
docker run -d \
  --name lpv-mysql \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
  -e MYSQL_DATABASE=lpvDB \
  -p 3306:3306 \
  lpv-mysql:local
```

Or run with a root password (recommended):

```bash
docker run -d \
  --name lpv-mysql \
  -e MYSQL_ROOT_PASSWORD=your_root_password \
  -e MYSQL_DATABASE=lpvDB \
  -p 3306:3306 \
  lpv-mysql:local
```

Docker Compose snippet to add to `docker-compose.yml`:

```yaml
  db:
    build: ./db
    image: lpv-mysql:local
    container_name: lpv-mysql
    environment:
      MYSQL_ALLOW_EMPTY_PASSWORD: "yes"   # or set MYSQL_ROOT_PASSWORD
      MYSQL_DATABASE: lpvDB
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

Notes:
- The init SQL runs only on the first initialization of the data volume. If you change `init.sql`, remove the volume `db_data` before restarting to re-run the script.
- After starting the DB container, update `SPRING_DATASOURCE_URL` in `docker-compose.yml` to point to `jdbc:mysql://db:3306/lpvDB...` and set credentials accordingly.
