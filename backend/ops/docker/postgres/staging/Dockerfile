FROM postgres:14.5-alpine3.16

COPY ./common/entrypoint/database.sql /docker-entrypoint-initdb.d/init1.sql
COPY ./common/entrypoint/load-extensions.sh /docker-entrypoint-initdb.d/init2.sh

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE ${DB_PORT}

CMD ["postgres"]
