![Logo](assets/image.png)

> An app for planning diets on a budget that works really well with any food tracking
> app

https://sofiadiet-production.up.railway.app

---

| Badge                                                                                       | Description                                     |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| ![Release](https://img.shields.io/github/v/release/kesler20/sofia_diet?include_prereleases) | Latest release version, including pre-releases. |
| ![GitHub Issues](https://img.shields.io/github/issues/kesler20/sofia_diet)                  | Open GitHub issues.                             |
| ![CI Pipeline](https://github.com/kesler20/sofia_diet/actions/workflows/ci.yml/badge.svg)   | CI Pipeline                                     |
| pnpm                                                                                        | Package manager                                 |
| vite                                                                                        | Bundler                                         |
| nodejs                                                                                      | Runtime                                         |
| Auth0                                                                                       | Auth                                            |
| React                                                                                       | JS Framework                                    |
| Typescript                                                                                  | Language                                        |
| Tailwindcss                                                                                 | Styling                                         |
| xstate                                                                                      | state management                                |
| axios                                                                                       | API                                             |

---

# Getting Started

> Make sure that you have generated a Personal Access Token, as this will be used by
> some github action.
> https://scribehow.com/shared/How_to_Generate_Personal_Access_Tokens_on_GitHub__k3cOvB2HRx2gMKng-Bw1eQ
> Make sure that you have configured Auth0 application
> https://scribehow.com/shared/Create_a_JavaScript_Front-End_Application_with_Auth0__EMTUP5ACTqqGQixIqa4cBQ

## Deploying to production

> To deploy easily you can use a Platform as a Service (PaaS) provider such as
> [Railway](https://railway.app/dashboard) which allows you to deploy different
> branches on commit.

By creating a development branch separate to the main branch you can have a
`canary deployment` which can be used to test the website before it is shown to
users.

Accordingly, each new feature can be created on a `user/new-feature` branch of the
development branch which is merged back to dev once all the unit tests pass. The
following setup should be obtained

```cmd
--main
|
---dev
|
----user1/new-feature-1
|
----user2/new-feature-1
```

This will allow to separate releases from delivery so you can merge the development
branch back to `main` for each new release.

### Setting up git repositories

<img style="width: 100%;" src="assets/git-deploy.png" alt="" srcset="">
    
Starting from the `main` branch, you can create and move to a new branch with the
following command.

```git
git checkout -b dev
```

You can then make some changes, and add them using

```git
git add .
```

```git
git commit -m "first commit for development branch"
```

and publish to github with the following

```git
git push --set-upstream origin dev
```

to get the latest changes from the main branch

```bash
# Ensure you are in the dev branch
git checkout dev

# Pull the latest changes from the master branch
git pull origin master
```

### Creating a canary deployment

step by step guide to create a canary deployment in Railway
https://scribehow.com/shared/Create_a_canary_deployment_in_Railway_app__9a_OC3HSR_Ci6Pd-vPFjpA

# Software Architecture and Design Patterns

> This describes any high level design patterns followed and the general software
> Architecture.

## Software Features

Include any design diagram used to inform the development of the software features
mentioned. This can include, diagrams from UX workflows, UI mockups and wireframes,
Xstate diagrams, draw UML and draw SQL diagrams etc...

# Folder Structure and Conventions

> Here are the folder structure description and some of the conventions used in the
> repository
