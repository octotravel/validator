FROM postgres:17.2-alpine3.21

COPY ./common/entrypoint/database.sql /docker-entrypoint-initdb.d/init1.sql

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE ${DB_PORT}

CMD ["postgres"]
