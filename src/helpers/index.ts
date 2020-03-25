import * as fs from 'fs'
import * as path from 'path'

export const pipeEffect = (...fncs: any[]) => (val: any) => {
  fncs.forEach(f => {
    f(val)
  })
}
export const isDirectory = (root: string) => (dirName: string): boolean => {
  const joinedPath = path.join(root, dirName)
  return fs.lstatSync(joinedPath).isDirectory()
}

export const isEmpty = (arr: Array<any>) => arr.length === 0
