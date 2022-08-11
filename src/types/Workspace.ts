import { Data } from './Data'
import { View } from './View'
import { Transform } from './Transform'

export type Workspace = {
    data: Data | string; //Either dataset name or new Data object
    views: View[];
    transforms?: Transform[];
}