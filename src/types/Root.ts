import { Data } from './Data'
import { Workspace } from './Workspace'

export type Root = {
    datasets: {
        data: Data[];
        name: string;
    }
    workspaces: Workspace[];
}