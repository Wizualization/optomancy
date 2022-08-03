import { Data } from './Data'
import { View } from './View'
import { Transform } from './Transform'

export type Workspace = {
    data: Data | string;
    views: View[];
    transforms?: Transform[];
}