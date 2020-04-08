// eslint-disable-next-line object-curly-spacing
import { Command } from '@oclif/command'
import * as fs from 'fs'
import Action from '../Controllers/action'
import Feature from '../Controllers/feature'
import Redux from '../Controllers/redux'

class InitCommand extends Command {
  static description = 'Initialize Redux Directory in current dir.';

  async run() {
    if (fs.existsSync('./redux')) {
      this.error('Redux is already Initilized')
    } else {
      this.log('initialising Redux Directory')
      Redux.initiate()
      this.log('Redux directory is initialized')
      this.log('Initialising Notification Feature')
      Feature.initiate({feature: 'notification'})
      Action.createSyncAction({
        feature: 'notification',
        name: 'setNotification',
      })
      this.log('Done!')
    }
  }
}

module.exports = InitCommand
