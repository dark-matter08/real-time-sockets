## Marbel Backend

### Getting Started

-   **Perequisites: Make sure you have the server/the middleware setup and
    running on your local machine.**
-   **Perequisites: make sure you have docker & docker compose installed
    locally**
-   Create a fork of this repository into your own github account.
-   Clone the repo from your own account.
-   Open the project in your favourite code editor _preferrably Visual Studio
    Code_.

## Rules or Folders and Files Naming Conventions

-   `Directories` with longer names should be named using
    `hyphens-to-seperate-each-word`.
-   `Components`, `files` and other `utility functions` should be named using
    `camelCasing`.

## Folder Structuring Explained (Most important files and folders)

    .
    ├── ...
    ├── public                 # Public folder
    ├── src                    # Source folder
    │   ├── routes             # Endpoint routes
    │   ├── controllers        # Endpoint controllers
    │   ├── models             # Model folder
    │   ├── services           # Services folder
    │   ├── utils              # Utils folder
    │   ├── configs            # Config folder
    │   ├── static             # Static folder
    │   ├── index.ts           # Index entry files
    │   └── ...
    └── ...

## How to contribute

-   Make sure to pull the latest changes.
-   Name your branch accordingly by your task name and with `_` if it is
    `composed_of_may_words`.
-   Try to add as many as possible tests of your services to increase the test
    coverage of the project.
-   Test files should have a `.spec.ts` as extension.
-   Before pushing, you should run the linter `npm run lint` and if it failed,
    you can execute `npm run lint -- --fix` to help you to fix.

## Project testing

To perform our testing, we are using Jest. You could have a look into the
[documentation](https://jestjs.io/).<br /> You can run unit tests locally by
executing the script: `npm run test`