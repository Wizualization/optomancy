import Optomancy, { DataType } from "../optomancy";

// Sets the dataset
function data(this: Optomancy, data: DataType) {
  this.config.data = data;
}

export default data;
