@t7m/redux-generator
====================

Generate Actions and Reducers based on Duck method

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@t7m/redux-generator.svg)](https://npmjs.org/package/@t7m/redux-generator)
[![Downloads/week](https://img.shields.io/npm/dw/@t7m/redux-generator.svg)](https://npmjs.org/package/@t7m/redux-generator)
[![License](https://img.shields.io/npm/l/@t7m/redux-generator.svg)](https://github.com/Aminejvm/Typescript redux generator/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [You can then get rootReducer from ./redux and integrate it in your config](#you-can-then-get-rootreducer-from-redux-and-integrate-it-in-your-config)
* [You'll get prompt with existing feature to choose from.](#youll-get-prompt-with-existing-feature-to-choose-from)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @t7m/redux-generator
$ redux COMMAND
running command...
$ redux (-v|--version|version)
@t7m/redux-generator/0.0.1 win32-x64 node-v10.16.3
$ redux --help [COMMAND]
# Getting started
```
yarn add @t7m/redux-generator --dev
#Or
npm install @t7m/redux-generator --save-dev
``` 
This is a redux generator following the duck pattern.
More documentation will come as the project mature with time.

USAGE
  $ redux COMMAND
...
```
<!-- usagestop -->
```bash
#First command is to initialise Redux boilerplate (./redux)
#You can then get rootReducer from ./redux and integrate it in your config
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
