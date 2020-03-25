@t7m/redux-generator
====================

Generate Actions and Reducers based on Duck method

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@t7m/redux-generator.svg)](https://npmjs.org/package/@t7m/redux-generator)
[![Downloads/week](https://img.shields.io/npm/dw/@t7m/redux-generator.svg)](https://npmjs.org/package/@t7m/redux-generator)
[![License](https://img.shields.io/npm/l/@t7m/redux-generator.svg)](https://github.com/Aminejvm/Typescript redux generator/blob/master/package.json)

<!-- toc -->
# Usage
<!-- usage -->
```bash
#First command is to initialise Redux boilerplate (./redux)
# You can then get rootReducer from ./redux and integrate it in your config
redux init

#Second you need to create a Feature to contain reducers and actions.
redux create --f (name of feature)

#Create a synchronous action
#You'll get prompt with existing features to choose from. 
redux create --a (name of action)

#Create a asynchronous action
# You'll get prompt with existing feature to choose from.
redux create --async (name of async action)
```
