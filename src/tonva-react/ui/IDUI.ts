import { ID, IDX } from "../uq";
import { FieldItem } from "./fieldItem";

export interface IDUI {
	ID: ID;
	fieldItems?: {[name:string]:Partial<FieldItem>};
}

export interface IDXUI {
	ID: ID|IDX;
	fieldItems?: {[name:string]:Partial<FieldItem>};
}
