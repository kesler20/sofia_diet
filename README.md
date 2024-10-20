# React Serverless Template Repo 
Replace the above with the title of the project (written as an image) and add the Logo just below.

---

| Badge | Description |
|-------|-------------|
| ![Python Tests](https://github.com/kesler20/python_projects_template_repo/actions/workflows/python-test.yml/badge.svg?branch=main) | Python unit tests status. |
| ![Build](https://github.com/kesler20/python_projects_template_repo/actions/workflows/python-build.yml/badge.svg) | Build status. |
| ![Type checks](https://github.com/kesler20/python_projects_template_repo/actions/workflows/python-types.yml/badge.svg) | Type checks. |
| ![Test Coverage](https://img.shields.io/codecov/c/github/kesler20/python_projects_template_repo) | Code coverage. |
| ![Release](https://img.shields.io/github/v/release/kesler20/python_projects_template_repo?include_prereleases) | Latest release version, including pre-releases. |
| ![Technical Debt](https://img.shields.io/codeclimate/tech-debt/kesler20/python_projects_template_repo) | Technical debt. |
| ![GitHub Issues](https://img.shields.io/github/issues/kesler20/python_projects_template_repo) | Open GitHub issues. |
| ![Technologies Used](https://img.shields.io/badge/technology-pytest-green) | Testing framework. |
| ![Technologies Used](https://img.shields.io/badge/technology-black-black) | Formatting. |
| ![Technologies Used](https://img.shields.io/badge/technology-mypy-blue) | Type checking. |

---

Quick description of the project (this can come from the repository description)


# Software Features
Describe the features of the software provide screenshots or a video demo of what it does.

# Table of Contents (TOC)

- [Getting Started](#getting-started)
- [Folder Structure and Conventions](#folder-structure-and-conventions)
- [Software Architecture and Design Patterns](#software-architecture-and-design-patterns)
  - [High Level Details](##high-level-details)
  - [Business Rules](##business-rules)

# Getting Started
How To Setup and Build/Run the Software 
Make sure that you have generated a Personal Access Token, as this will be used by some of the workflow actions. If you don't know how, check [How to Generate Personal Access Tokens on GitHub](https://scribehow.com/shared/How_to_Generate_Personal_Access_Tokens_on_GitHub__k3cOvB2HRx2gMKng-Bw1eQ)

# Folder Structure and Conventions
This describes the folder structure, link to any conventions used in the project.
All the images and third party stuff used in the README can be saved in a folder called `assets/README`

# Software Architecture and Design Patterns
>[!tip] Assumptions
>- No message bundling, this is because it requires a pre-conceived structure by the model execution engine and the canvas of intermidiary steps such as results of model executions.
>- Cards can be treated as models, since the input will publish a value to a model which will transform the value and publish to the next model accordingly, you only need the card inputs to simulate the propagation of the I/O response which will be executed with the models saved in the db by the model execution engine in real time
>- The model execution engine will wait for the input of the model to be filled completely before executing the model. This will allow for a model to receive inputs from other models or a sensor or other models

>[!Quote] The only way to make this work is 
>- To have each sensor publish to a specific model parameter
>- The model will then be executed once all its parameters have been received a new message
>- The model can publish its results to the next model/card parameter or a visualise block

## Models 📌🗃️

### Nodes & Edges

```js
[
  {
    source: '2',
    sourceHandle: 'this is the left',
    target: '1',
    targetHandle: 'frist input variable',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'black', strokeWidth: 3 },
    id: 'reactflow__edge-2this is the left-1frist input variable'
  }
]
```
### Card Model

>[!info] As you are adding nodes and edges construct the following card model

```ts
cardName: string;
version: string;
inputs:
	[
		{
			name : string;
			value: number;
			target: string; //model names
			units: Units;
		},...
	]
models:
	[
		{
			name: string;
			version: string;
			inputs:
				{
					[param as string]: number,
				}
			outputs: 
				{
					[param as string]: number,
				}
			stream rate: number;
		},...
	]
```

>[!info] The model execution engine will expect each message to have the schema described by the model inputs

```js
{
	NTP: 10,
	T7RNA: 2.4,
	Temperature: 25
}
```

### Example 
Given the following systems

![](docs/Pasted%20image%2020240626150335.png)

## Use Cases ⁉️🎯
> [!edit] upload a data set and stream its rows

>[!edit] upload a model and recognise I/O automatically

>[!edit] stream modified output to the simulation results view

>[!edit] save a canvas as a connector and load it into the next canvas

>[!edit] change the value of the sensor dynamically

- [ ] when a new connection is created, update the topic of the source node to match the topic of the target node. 
	- [ ] the useEffect that updates the topics is not looking at exclusive scenarios, since the outputblock can have a sourceNode being a sensor and a sensor can be the source node at the same time.
- [ ] create update and delete the various types of cards.
	- [ ] creating a sensor will not prompt you to add any name, the sensor by default will be called Sensor X (the number of the sensor)
	- [ ] creating a block will only be called Output Block and then as you connect it to something it will be called, Output Something
- [ ] the canvas needs to be persistent
- [ ] change the UI of the buttons, change the names of the buttons to Run and you can decide to jump to X time in the simulation
	- [ ] create a new UI component for the new custom button.
- [ ] complete the `modelExecutionEngine` to enable models to listen to messages and pass messages to each other.
- [ ] CRUD for the canvas card (Optional)
# Room For Improvement
>[!question] Potential Improvements?
> how to come up with a topic architecture which allows us to publish, test and productionise the message passing etc...
