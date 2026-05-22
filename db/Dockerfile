FROM mysql:8.0

# Copy initialization SQL into the image so the database and a helper user are created
COPY init.sql /docker-entrypoint-initdb.d/

RUN chmod 0444 /docker-entrypoint-initdb.d/init.sql

EXPOSE 3306

CMD ["mysqld"]
