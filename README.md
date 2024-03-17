### Getting Started - Practice Exercise with CAMSOL

1) Run `docker volume create rts_directus_db_volume` to create a docker volume.
2) Run `docker-compose up` in your root repository directory and keep  its terminal open
3) Navigate to the middleware root folder
4) Run `yarn install`
5) Do your code modification and check your application logs in the real-time-sockets terminal you kept open above
6) Directus will be av available at  `localhost:8080/admin/login`


## Rules or Folders and Files Naming Conventions

-   `Directories` with longer names should be named using
    `hyphens-to-seperate-each-word`.
-   `Components`, `files` and other `utility functions` should be named using
    `camelCasing`.

## How to work with directus schema updates

On startup, `directus` executes the script `./directus/schema/start.sh` updating the schema to the snapshot in `./directus/schema/snapshot.yaml`.

If you want to *export* a directus schema, navigate to the directus folder, then you can use the `docker exec directus sh ./schema/export.sh` script. It saves the directus schema to `./directus/schema/snapshot.yaml`. Docker-compose has to be up and running.

```bash
docker exec directus sh ./schema/export.sh
```

If you want to *import* a directus schema,navigate to the directus folder, then you can use the `docker exec directus sh ./schema/import.sh` script. It loads the directus schema from `./directus/schema/snapshot.yaml`. Docker-compose has to be up and running.

```bash
docker exec directus sh ./schema/import.sh
```
When you're ready, push your updated snapshot file to the main branch from the root directory of the project.