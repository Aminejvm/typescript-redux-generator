// eslint-disable-next-line object-curly-spacing
import Command, { flags } from '@oclif/command'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
import Action from '../Controllers/action'
import Feature from '../Controllers/feature'
import { isDirectory, isEmpty } from '../helpers'

// Prompting Features
const isFeature = (dir: string): boolean =>
  dir !== 'hooks' && isDirectory('./redux')(dir)
const listFeaturesFromDir = () => fs.readdirSync('./redux').filter(isFeature)
const prompFeatures = async () => {
  const responses = await inquirer.prompt([
    {
      name: 'feature',
      message: 'Select a feature:',
      type: 'list',
      choices: listFeaturesFromDir().map(f => ({name: f})),
    },
  ])
  return responses.feature
}

class CreateCommand extends Command {
  static flags = {
    f: flags.string(),
    a: flags.string(),
    async: flags.string(),
  };

  static description =
    'Create feature, async and sync actions with the help of flags';

  async run() {
    const {flags} = this.parse(CreateCommand)
    if (flags.f) {
      this.log('initialising feature' + flags.f)
      Feature.initiate({feature: flags.f})
      this.log(flags.f + 'feature initialized')
    }
    if (flags.a) {
      const feature = await prompFeatures()
      if (isEmpty(feature)) {
        this.error(
          "can't detect your features, make sure you created a feature before creating an action"
        )
      }
      this.log(`initialising action ${flags.a} on feature ${feature}`)
      Action.createSyncAction({feature, name: flags.a})
      this.log(`${flags.a} Action is initialized on ${feature} feature.`)
    }
    if (flags.async) {
      const feature = await prompFeatures()
      if (isEmpty(feature)) {
        this.error(
          "can't detect your features, make sure you created a feature before creating an action"
        )
      }
      this.log(`initialising action ${flags.a} on feature ${feature}`)
      Action.createAsyncAction({feature, name: flags.async})
      this.log(`${flags.a} Async Action is initialized on ${feature} feature.`)
    }
    if (!(flags.a || flags.async || flags.f))
      this.error(
        'Add a flag --f:feature, --a:sync action ,--async:async action '
      )
  }
}

module.exports = CreateCommand
