import { ID } from "../uq";
import { FieldItem } from "./fieldItem";

export interface FormUI {
	ID: ID;
	//FieldNO?: string;					// NO field
	//FieldIDs?: {[name:string]: ID};
	fields: {[name:string]:Partial<FieldItem>};
}
