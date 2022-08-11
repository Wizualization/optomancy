import { Data } from './Data'
import { Workspace } from './Workspace'

export type Root = {
    datasets: Data[];
    workspaces: Workspace[];
}