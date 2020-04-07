import 'reflect-metadata';
export declare const namespace = 'test';
declare function Model(): (target: any) => void;
declare const fieldSetAttr: (
  setting?: string | object | undefined
) => (target: any, propertyKey: string) => void;
declare const fieldSetPk: (
  setting?: object | undefined
) => (target: any, propertyKey: string) => void;
declare const fieldSetFk: (
  setting: object
) => (target: any, propertyKey: string) => void;
export {Model, fieldSetAttr, fieldSetPk, fieldSetFk};
