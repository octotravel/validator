FROM postgres:18.1-alpine3.22

COPY ./common/entrypoint/database.sql /docker-entrypoint-initdb.d/init1.sql

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE ${DB_PORT}

CMD ["postgres"]
